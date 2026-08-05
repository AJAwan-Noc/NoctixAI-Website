# Fix: external links are invented from memory, not searched for

## Root cause

The model proposes external link candidates purely from its own training-data memory of
what a plausible URL for a source "should" look like. That's why validation keeps rejecting
so many of them (404s, wrong paths, pages that were restructured or never existed at that
path) — there was never a real search involved, just a guess. Tavily is a real search API;
using it to find an actual page for each claim, before the existing HTTP-status validation
even runs, replaces guessing with a real lookup.

## Change 1 — Tavily search replaces invented external link URLs (all post types)

Insert three new nodes between `Parse and validate LLM output` and the existing
`Split Out External Links`, so the existing `Split Out External Links` → `GET external
link` → `Validate external links` chain runs completely unchanged — it still does its own
live HTTP-status check afterward, since a search result can occasionally point to a page
that's since been taken down.

New chain:

```
Parse and validate LLM output
  -> Split Out for Tavily Search
  -> Tavily Search
  -> Rebuild external links from Tavily results
  -> Split Out External Links   (existing, untouched)
  -> GET external link          (existing, untouched)
  -> Validate external links    (existing, untouched)
```

### Node 1 — Split Out ("Split Out for Tavily Search")

| Setting | Value |
|---|---|
| Field to Split Out | `external_links` |
| Destination Field Name | `candidate` |

One item per model-proposed link candidate, same shape the model returned:
`{ url, anchor_text, reason }`. The `url` here is the invented one — it gets discarded,
not read, by the next node.

### Node 2 — HTTP Request ("Tavily Search")

Runs once per item (default HTTP Request behavior fed one item at a time).

| Setting | Value |
|---|---|
| Method | POST |
| URL | `https://api.tavily.com/search` |
| Authentication | Generic Credential Type → HTTP Header Auth → your Tavily credential |
| Send Body | On → JSON |
| Body | `={{ JSON.stringify({ query: $json.candidate.reason, max_results: 3 }) }}` |
| Options → Timeout | `15000` |
| Node settings → Always Output Data | On |
| Node settings → Continue On Fail | On |

The search query is the model's own `reason` field for that link — the one-sentence
explanation of *why* it wanted a citation there, which reads as a natural search query
("official docs on X rate limiting", "recent study on Y adoption in SMBs", etc).

Always Output Data + Continue On Fail mirror the resilience pattern already used on `GET
external link`: if Tavily itself errors for one candidate (rate limit, auth issue, momentary
outage), that one item just carries an `error` field forward instead of stopping the whole
batch — handled explicitly in the next node.

You'll need to create the HTTP Header Auth credential in n8n (Tavily's API key, whatever
header format their current docs specify) and select it here — the JSON below ships with a
placeholder credential id that **will not resolve** until you do that and re-point the node
at it.

### Node 3 — Code node ("Rebuild external links from Tavily results")

**Mode: Run Once for All Items.**

```js
// Code node: "Rebuild external links from Tavily results"
// Mode: Run Once for All Items
//
// Replaces the model's invented external_links URLs with real Tavily search
// results -- one search per candidate, using the model's own `reason` field
// as the query. Anything Tavily can't find a result for is dropped outright
// rather than falling back to the model's original guessed URL, since the
// entire point of this step is to stop shipping memory-invented links.
//
// Reassembles the full post object (everything from "Parse and validate LLM
// output", untouched) with only external_links replaced, so the existing
// "Split Out External Links" -> "GET external link" -> "Validate external
// links" chain downstream needs zero changes -- it still does its own live
// HTTP-status check on these Tavily results, since a search result can
// still occasionally point to a page that's since gone down.

const SPLIT_OUT_NODE = 'Split Out for Tavily Search';
const post = $('Parse and validate LLM output').first().json;

const items = $input.all();
const externalLinks = [];

for (let i = 0; i < items.length; i++) {
  const response = items[i].json;
  const candidate = $(SPLIT_OUT_NODE).itemMatching(i).json.candidate;

  if (response.error) continue; // Tavily call itself failed -- drop this candidate

  const results = Array.isArray(response.results) ? response.results : [];
  const topResult = results[0];
  if (!topResult || typeof topResult.url !== 'string' || !topResult.url) continue;

  externalLinks.push({
    url: topResult.url,
    anchor_text: candidate.anchor_text,
    reason: candidate.reason,
  });
}

return [{ json: { ...post, external_links: externalLinks } }];
```

Only the top Tavily result (`results[0]`) is used per candidate, per spec — this doesn't
retry against `results[1]`/`results[2]` if the top result later fails the live HTTP check in
`Validate external links`. That's a reasonable follow-up if the survival rate turns out too
low in practice, but it's a real restructure (the retry would need to happen *after*
validation, not before), not a one-line change, so it's left out here.

**A design note on the Wednesday case (see Change 2 below):** the model is now handed the
real RSS article URL directly and told to cite it. That candidate still flows through this
same Tavily-search-and-replace step like every other one — it isn't special-cased to skip
search. In practice, searching on a `reason` that specifically describes that news item
should converge back to the same article (or an equally good one) essentially every time,
and it still gets the same live HTTP re-check either way, so special-casing an exemption
felt like meaningfully more branching logic for very little behavioral difference. Flagging
this interpretation explicitly in case "no search needed for that one" was meant literally —
that would require tagging that one candidate (e.g. a `source: "rss"` field with the real
url on it) and skipping the search step specifically for it.

## Change 2 — capture the real RSS article URL (Wednesday news-commentary posts)

The RSS feed's `link` field already has the article's real URL — `Merge RSS items` currently
only extracts `title`. Add the URL to the same headline list already fed to the model, and
tell the model to cite it directly for whichever headline it picks.

### "Merge RSS items" (replace jsCode in full)

```js
const feed1 = $('RSS: TechCrunch AI').all().map(i => i.json);

const combined = feed1
  .filter(item => item.title)
  .sort((a, b) => new Date(b.isoDate || b.pubDate || 0) - new Date(a.isoDate || a.pubDate || 0))
  .slice(0, 10)
  .map(item => `- "${item.title}" (${item.link || 'no URL available'})`)
  .join('\n');

return [
  {
    json: {
      rssHeadlines: combined || '(no recent items fetched)'
    }
  }
];
```

Only change: each line now includes `(${item.link})` alongside the title.

### "Build generation prompt" — `buildWednesdayGuidance()` (replace this one function)

```js
function buildWednesdayGuidance(rssHeadlines) {
  return `No specific human-suggested topic is queued this time. Today's angle: AI news commentary.

Recent AI industry headlines, each with its real source URL:
${rssHeadlines}

Pick ONE specific, recent headline from the list above -- the most substantive and concrete one, not the vaguest. Explain what it actually means in plain terms (skip the hype framing from the original headline), then give a grounded, practical take aimed at an SMB owner who is evaluating automation for their business. Only connect it to a Noctix service pillar (${servicePillars}) if there is a real, specific connection -- do not force one in if there isn't.

Include the source article's own URL (shown next to the headline you picked above) as one of your external_links entries, with a reason describing what it reports -- you already have the real URL for this one, no guessing required.

Write entirely in your own words. Never copy or closely paraphrase sentences from the headline or its source -- this is commentary and analysis, not reporting.`;
}
```

Only change: the new paragraph telling the model to use the real URL it was just handed,
plus updating "headlines" to "headlines, each with its real source URL" so the list's new
shape is explained.

Everything else in `Build generation prompt` (the `hasIdea` branch, Monday/Friday guidance,
the JSON output schema, `NICHES`, day-of-week detection) is untouched.
