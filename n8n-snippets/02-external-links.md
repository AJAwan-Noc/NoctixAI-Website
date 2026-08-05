# Fix: external link validation always fails

## Root cause

The current "Validate external links" Code node tries `this.helpers.httpRequest` with
`method: 'HEAD'` first, falls back to `GET` on failure, and wraps both attempts in one
`try/catch` that swallows whatever goes wrong. In practice:

- A `HEAD` request from a datacenter IP gets rejected (403/406/999, or just a hang) by most
  large publishers — they only serve `HEAD` to known crawlers.
- The `GET` fallback rarely gets a chance to run cleanly because the node doesn't
  distinguish "this specific link is dead" from "the whole validation step errored," so a
  single early failure can abort the batch.
- Zero external links have survived across all fifteen published posts. The Slack approval
  message still prints "already checked, all live" — the copy assumes an empty rejected list
  means success, when here it means *everything* failed before rejection was ever recorded.

## Fix overview

Replace the single Code node with three nodes:

1. **Split Out** — turns the post's `external_links` array into one item per candidate link.
2. **HTTP Request** — a real node (not `this.helpers.httpRequest` inside a Code node), doing
   a plain `GET` with a browser User-Agent, one per item.
3. **Code node ("Validate external links")** — aggregates the per-link responses, classifies
   valid vs. rejected, caps valid links at 5, and throws if none pass.

Since only a fraction of proposed candidates typically survive an HTTP check (dead links,
paywalls, blocked requests), the generation prompt asks the model for 6-8 external-link
candidates rather than 2-3, specifically so 5 usually clears validation — see
`04-content-mix.js`. This node still only throws on *zero* survivors, not fewer than 5: a
hard minimum of 5 would block publishing on topics where fewer authoritative sources exist,
trading a rare thin-citations post for a much higher failed-run rate. Adjust `MAX_VALID_LINKS`
and the throw condition below if you want stricter behavior.

Assumptions (adjust the field names below if your actual node differs):

- The item entering this section has a field `external_links`: an array of
  `{ url, anchor_text }` objects (or plain URL strings — the code below handles both).
- Nothing else on the post item is needed by these three nodes. Downstream nodes that need
  the post's other fields (title, slug, body, …) should reference the generation node
  directly via `$('<your generation node name>').item.json.title`, not this branch — see the
  note on field collisions below.

---

## Node 1 — Split Out ("Split Out External Links")

| Setting | Value |
|---|---|
| Field to Split Out | `external_links` |
| Destination Field Name | `link` |
| Include Other Fields | **Off** |

Name this node exactly **`Split Out External Links`** — the aggregating Code node below
references it by name via `itemMatching()`. If you name it differently, update the
`SPLIT_OUT_NODE` constant in that node to match.

Include Other Fields is off on purpose. The HTTP Request node's "Include Response Headers
and Status" option wraps its output as `{ statusCode, headers, body }` — and `body` there
means the raw HTTP response text, not the post's own article body. If the post's fields rode
along on the same item, this node's own `body` field would get silently clobbered by the
response text of whichever link happened to load last. Keeping this branch minimal (link
data only) avoids the collision entirely.

## Node 2 — HTTP Request ("GET external link")

Runs once per item (default HTTP Request behavior when fed one item at a time — leave
**Execute Once** off).

| Setting | Value |
|---|---|
| Method | **GET** (never HEAD — this is the entire point of the fix) |
| URL | `={{ $json.link.url ?? $json.link }}` |
| Send Headers | On |
| Header: `User-Agent` | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36` |
| Options → Response Format | Text |
| Options → Include Response Headers and Status | On |
| Options → Never Error | **On** *(see note below — required, not in the original list)* |
| Options → Timeout | `8000` |
| Node settings → Always Output Data | On |
| Node settings → Continue On Fail | On |

**Why "Never Error" is required in addition to what was specified:** "Continue On Fail"
alone stops the *workflow* from halting on a failed request, but a non-2xx response is still
treated as a node-level item error — the output item gets `{ error: ... }` with no
`statusCode` at all. The classification logic in the next node needs the actual status code
for every response, including 403s and 404s, to sort valid from rejected and report *why*
each rejected link failed. "Never Error" makes the node return every completed HTTP
exchange — 2xx through 5xx — as a normal item with `statusCode` populated. "Continue On
Fail" then only has to cover genuine failures that never got a response at all: DNS failure,
connection refused, the 8s timeout.

With this combination, every item downstream is one of:
- `{ statusCode: <number>, headers, body }` — request completed, any status
- `{ error: <Error> }` — request never completed (Continue On Fail caught it)

## Node 3 — Code node ("Validate external links")

**Mode: Run Once for All Items.**

```js
// Code node: "Validate external links" (aggregate)
// Mode: Run Once for All Items
//
// Reads the per-link HTTP responses from this node's own input, and pulls the
// original link (url + anchor_text) back from the Split Out node via
// itemMatching() so the two stay correctly paired regardless of item order.
//
// IMPORTANT: leave "Continue On Fail" OFF on *this* node. The throw below is
// what's supposed to stop the workflow and hand off to the configured Error
// Workflow. Swallowing it here would let a post with zero citations publish
// anyway — which is the exact failure mode this fix closes.

const SPLIT_OUT_NODE = 'Split Out External Links';
const MAX_VALID_LINKS = 5;

const items = $input.all();
const valid = [];
const rejected = [];

for (let i = 0; i < items.length; i++) {
  const response = items[i].json;
  const sourceLink = $(SPLIT_OUT_NODE).itemMatching(i).json.link;

  const url = sourceLink && typeof sourceLink === 'object' ? sourceLink.url : sourceLink;
  const anchorText =
    sourceLink && typeof sourceLink === 'object' ? sourceLink.anchor_text : undefined;

  // With "Never Error" on, every completed request lands here with a numeric
  // statusCode — success or not. Only hard failures (DNS, connection refused,
  // the 8s timeout) skip that and show up as an item-level error instead.
  if (response.error || typeof response.statusCode !== 'number') {
    rejected.push({
      url,
      status: null,
      reason: response.error?.message ?? String(response.error ?? 'request failed'),
    });
    continue;
  }

  const status = response.statusCode;

  if (status < 400) {
    if (valid.length < MAX_VALID_LINKS) {
      valid.push({ url, anchor_text: anchorText, status });
    }
    // Extra passing links beyond the cap are just not carried forward — the
    // target site didn't reject them, so they don't belong in rejected_links
    // either. They're simply unused.
  } else {
    rejected.push({ url, status, reason: `HTTP ${status}` });
  }
}

if (valid.length === 0) {
  throw new Error(
    `External link validation: 0 of ${items.length} candidate link(s) passed. ` +
      rejected.map((r) => `${r.url} -> ${r.status ?? r.reason}`).join('; '),
  );
}

const slackLines = [
  `*External links (${valid.length}/${MAX_VALID_LINKS} used):*`,
  ...(valid.length
    ? valid.map((l) => `• <${l.url}|${l.anchor_text || l.url}> — HTTP ${l.status}`)
    : ['_none validated_']),
];

if (rejected.length) {
  slackLines.push('', `*Rejected (${rejected.length}):*`);
  slackLines.push(
    ...rejected.map((l) => `• ${l.url} — ${l.status ? `HTTP ${l.status}` : l.reason}`),
  );
}

return [
  {
    json: {
      valid_links: valid,
      rejected_links: rejected,
      slack_message: slackLines.join('\n'),
    },
  },
];
```

Output shape: a single item with `valid_links` (≤5, each `{ url, anchor_text, status }`),
`rejected_links` (all failures, each `{ url, status, reason }` — `status` is `null` for
hard failures that never got a response), and a ready-to-post `slack_message` string.

## Slack approval message template

Whatever currently builds the "already checked, all live" / "none survived validation" copy
was inferring success from the *absence* of a rejected list, which is exactly backwards when
every link fails before rejection is ever recorded. Replace that logic with the explicit
`slack_message` built above:

- Point the Slack node's **Text** field at:

  ```
  ={{ $json.slack_message }}
  ```

- Delete whatever branch previously defaulted to an all-clear message. There is no longer an
  implicit "no news is good news" path — `valid_links` and `rejected_links` are always both
  present and always both printed when non-empty, and the run never reaches the Slack node at
  all if zero links validated (it goes to the error workflow instead, per the throw above).

Example rendered message:

```
*External links (2/3 used):*
• <https://example.com/report|industry report> — HTTP 200
• <https://another-source.com/data|supporting data> — HTTP 200

*Rejected (1):*
• https://blocked-publisher.com/article — HTTP 403
```
