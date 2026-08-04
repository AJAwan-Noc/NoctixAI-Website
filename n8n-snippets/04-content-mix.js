// Code node: "Build generation prompt"
// Replaces the current node's jsCode in full. Self-contained change to
// topic selection only -- the returned shape ({ systemPrompt, userPrompt,
// queuedIdeaId }) is identical, so nothing downstream (OpenRouter call,
// "Parse and validate LLM output", the JSON schema the model must return)
// needs to change.
//
// What changed vs. the previous version: only how `topicGuidance` gets
// built when no human idea is queued. The hasIdea branch is untouched --
// a queued idea still wins regardless of what day it is.
//
// When no idea is queued, topic selection now depends on the day the
// workflow actually runs (schedule: Mon/Wed/Fri 09:00):
//   Monday    -> niche-specific angle (NICHES x a service pillar)
//   Wednesday -> AI news commentary, RSS becomes the primary directive
//                instead of an optional signal
//   Friday (or any other day this runs on, e.g. a manual test execution)
//                -> general gap-filling, same logic as before
//
// Day-of-week is read from $now (Luxon, in the workflow/instance timezone)
// rather than `new Date()`, so it matches the same timezone the schedule
// trigger's cron expression is evaluated in -- not whatever timezone the
// underlying Node.js process happens to be in.

const recentPosts = $('Get recent posts').all().map(item => item.json);
const internalCandidates = $('Get internal link candidates').all().map(item => item.json);
const ideaRow = $('Get queued topic idea').first().json;
const hasIdea = ideaRow.has_idea === true;

let rss = '(skipped -- a queued idea took priority this run)';

if (!hasIdea) {
  try {
    rss = $('Merge RSS items').first().json.rssHeadlines;
  } catch (e) {
    rss = '(no recent items fetched)';
  }
}

const usedTopics = recentPosts
  .map(p => `- "${p.title}" (keyword: ${p.keyword}${p.source_topic ? `, angle: ${p.source_topic}` : ''})`)
  .join('\n') || '(none yet)';

const internalLinkList = internalCandidates
  .map(p => `- /blog/${p.slug} -- "${p.title}"`)
  .concat([
    "- /services -- Noctix's full services overview page",
    '- /case-studies -- Noctix client case studies',
    '- /contact -- Book an automation audit',
  ])
  .join('\n');

const servicePillars = [
  'AI Voice Agents (inbound Voxie, outbound Voxo)',
  'CRM & Workflow Automation',
  'Lead Generation Systems',
  'Marketing Automation',
  'Dashboards & Reporting',
  'Custom AI Tools',
  'API Integrations',
].join(', ');

const styleReference = `Most CRMs are clean for about three weeks. After that, fields go missing, leads get stuck in the wrong stage, and the pipeline stops reflecting reality. CRM automation is what keeps it usable.

The goal isn't to automate everything -- it's to remove the manual steps that always get skipped when the team is busy.`;

const systemPrompt = `You are a senior operations writer for Noctix AI, an AI automation agency that builds voice agents, CRM automations, workflow automations, lead generation systems, marketing automation, and dashboards for businesses in the US, UK, and Pakistan.

You write like an operator who has actually built these systems -- direct, concrete, no filler, no hype words like "revolutionize" or "game-changing" or "unlock". Short paragraphs. Real specifics over vague claims. This is the voice of an existing post on the site, match this tone exactly:

"""
${styleReference}
"""

You are writing ONE new blog post. Output ONLY valid JSON matching the schema below -- no markdown code fences, no commentary before or after, just the JSON object.`;

// ---------------------------------------------------------------------
// Day-of-week content mix (only applies when no human idea is queued --
// the hasIdea branch below always wins outright).
// ---------------------------------------------------------------------

const NICHES = [
  'Real Estate',
  'Healthcare & Medical Practices',
  'Legal & Law Firms',
  'Home Services (HVAC, Plumbing, Electrical)',
  'E-commerce & Retail',
  'Hospitality & Restaurants',
  'Financial Services & Accounting',
  'Dental Practices',
  'Fitness & Wellness Studios',
  'Automotive Sales & Service',
];

function buildMondayGuidance() {
  return `No specific human-suggested topic is queued this time. Today's angle: niche-specific.

Pick ONE niche from this list that has not been recently covered -- cross-check the "Topics already covered" list below for both the niche name itself and any close synonym mentioned in a title or angle, not just an exact string match:
${NICHES.map(n => `- ${n}`).join('\n')}

Combine that niche with ONE Noctix service pillar (${servicePillars}), and frame the entire post around a concrete implementation-intent angle for that specific niche -- e.g. "AI voice agents for real estate agencies," not a generic voice-agent post that happens to mention real estate once. The title, meta_title, and keyword must reflect the niche explicitly: the niche name or a natural variant of it should appear in the keyword.`;
}

function buildWednesdayGuidance(rssHeadlines) {
  return `No specific human-suggested topic is queued this time. Today's angle: AI news commentary.

Recent AI industry headlines:
${rssHeadlines}

Pick ONE specific, recent headline from the list above -- the most substantive and concrete one, not the vaguest. Explain what it actually means in plain terms (skip the hype framing from the original headline), then give a grounded, practical take aimed at an SMB owner who is evaluating automation for their business. Only connect it to a Noctix service pillar (${servicePillars}) if there is a real, specific connection -- do not force one in if there isn't.

Write entirely in your own words. Never copy or closely paraphrase sentences from the headline or its source -- this is commentary and analysis, not reporting.`;
}

function buildGeneralGuidance(rssHeadlines) {
  return `No specific human-suggested topic is queued this time. Choose the best topic using the signals below, in this priority order:
1. Recent AI industry news below -- only if something genuinely connects to a Noctix service and is worth a timely angle.
2. Noctix's service pillars generally, filling a gap not yet covered.

Recent AI industry headlines (use only if genuinely relevant to a Noctix service -- do not force a connection that isn't there):
${rssHeadlines}`;
}

function buildNoIdeaGuidance(rssHeadlines) {
  // Luxon weekday: 1 = Monday ... 7 = Sunday. $now is already in the
  // workflow/instance timezone, matching how the "3x a week" schedule
  // trigger's cron expression ("0 9 * * 1,3,5") itself gets evaluated.
  const weekday = $now.weekday;
  const hasRealHeadlines = typeof rssHeadlines === 'string' && rssHeadlines !== '(no recent items fetched)';

  if (weekday === 1) {
    return buildMondayGuidance();
  }

  if (weekday === 3 && hasRealHeadlines) {
    return buildWednesdayGuidance(rssHeadlines);
  }

  // Friday, or any other day this happens to run on (manual test
  // executions, a Wednesday with no RSS items fetched), falls back to the
  // same general gap-filling logic as before.
  return buildGeneralGuidance(rssHeadlines);
}

const topicGuidance = hasIdea
  ? `A human has specifically suggested this topic idea -- prioritize writing about this unless it's a near-duplicate of something already covered above: "${ideaRow.idea}" (source: ${ideaRow.source || 'manual'})`
  : buildNoIdeaGuidance(rss);

const userPrompt = `Noctix's core service pillars: ${servicePillars}

${topicGuidance}

Topics already covered on the blog -- do NOT repeat these or pick a near-duplicate angle:
${usedTopics}

Real internal pages you may link to (pick 2-4 of these, and ONLY these -- never invent a URL):
${internalLinkList}

Task:
1. Pick ONE specific, narrow topic related to Noctix's services that is NOT already covered above, following the topic guidance given.
2. Write a full blog post about it, 1000-1600 words, following this structure:
   - The first 1-2 sentences must directly answer the core question a reader has, in plain language, before any setup or context. AI search engines (ChatGPT, Perplexity, Google AI Overviews) extract answers from roughly the first 500 words, so the direct answer cannot be buried.
   - 4-7 H2 sections (use "## " markdown), each covering one concrete sub-point.
   - Natural paragraph prose, not bullet-point-only content. Short paragraphs (2-4 sentences).
   - A natural closing paragraph connecting the topic back to what Noctix builds, without being a hard sales pitch mid-article -- one clear mention of Noctix is enough.
   - 3-5 FAQ question/answer pairs covering related questions a reader would still have (each answer 1-3 sentences).
3. Propose 2-3 external links to genuinely well-known, authoritative sources (official documentation, established research or news organizations, well-known tool vendors) that support a specific factual claim you make in the post. Never link to a company that competes directly with Noctix's automation-agency services. If you are not confident of the exact real URL for a source, use the organization's known root domain plus your best-effort path -- a validation step will check these before publishing, so do not fabricate a specific statistic or quote to justify a link; only propose a link where the general claim is true regardless of the exact page.

Output this exact JSON shape:
{
  "title": "string, compelling, under 65 characters",
  "meta_title": "string, keyword near the front, under 60 characters",
  "meta_description": "string, 140-160 characters, includes the target keyword",
  "slug": "string, lowercase-hyphenated, under 60 characters",
  "keyword": "string, the primary target keyword/phrase",
  "secondary_keywords": ["string", "string"],
  "description": "string, 1-2 sentence teaser for the blog index card",
  "body": "string, the full post in markdown using ## for H2 headers, with internal links written as [anchor text](/blog/slug-here) and external links written as [anchor text](https://example.com/path) inline in the prose where relevant",
  "faq": [{"question": "string", "answer": "string"}],
  "internal_links": [{"slug": "string, matching one of the real pages listed above exactly", "anchor_text": "string"}],
  "external_links": [{"url": "string", "anchor_text": "string", "reason": "string, one sentence on why this source"}],
  "source_topic": "string, one sentence explaining why you picked this angle -- state explicitly whether it came from the human-suggested idea, AI news, a niche angle, or general reasoning",
  "read_time_minutes": integer
}`;

return [{
  json: {
    systemPrompt,
    userPrompt,
    queuedIdeaId: hasIdea ? ideaRow.id : null,
  }
}];
