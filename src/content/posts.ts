export type Post = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  date: string;
  readTime: string;
  body: string;
};

export const posts: Post[] = [
  {
    slug: "what-is-business-automation",
    title: "What Is Business Automation? A Simple Guide for Growing Companies",
    description:
      "Learn what business automation is, how it works, and how companies use automation to save time, reduce manual work, and scale faster.",
    keyword: "business automation",
    date: "2026-01-12",
    readTime: "6 min read",
    body: `Business automation is the use of software, AI, and connected systems to take over repetitive work that people used to do manually. Instead of copying data between tools, chasing follow-ups, and re-running the same reports every week, automation handles those tasks in the background — quietly, accurately, and around the clock.

Most growing companies don't have a "people" problem. They have a "manual work" problem. The longer that work piles up, the harder it gets to scale without burning the team out.

## How automation actually works

Automation connects the tools you already use — your CRM, inbox, forms, spreadsheets, ticketing platforms, calendar, billing — and runs predictable rules across them. A new lead lands, the system enriches it, scores it, assigns it to the right person, and sends the first follow-up before anyone touches a keyboard.

Modern automation also adds a layer of AI on top. Instead of only following rigid rules, AI can read messages, summarise calls, classify enquiries, and decide what to do next.

## Where it pays off first

The first wins are almost always in the same places: lead intake, CRM hygiene, reporting, internal handoffs, and client communication. Those are the boring tasks that consume hours every week and rarely get done well.

Once those are stable, automation extends into voice agents, marketing flows, and full operations dashboards.

If your team is doing the same task more than five times a week, it should probably be automated. Noctix AI builds those systems end-to-end.`,
  },
  {
    slug: "ai-voice-agents-for-business",
    title: "AI Voice Agents: How They Work and Why Businesses Are Adopting Them",
    description:
      "AI voice agents handle inbound and outbound calls 24/7. Here's how they work, what they can do, and why businesses are switching.",
    keyword: "ai voice agents",
    date: "2026-01-18",
    readTime: "7 min read",
    body: `AI voice agents are intelligent phone agents that can answer calls, qualify leads, book appointments, follow up, and route conversations to the right human when needed. They sound natural, work 24/7, and never miss a call.

For most service businesses, the phone is still the highest-intent channel — and the most leaky one. Missed calls, slow callbacks, and inconsistent qualification quietly cost more revenue than any ad budget.

## Inbound vs outbound

Inbound voice agents pick up every call instantly, qualify the caller, answer common questions, and either book the appointment or pass a warm hand-off to the team.

Outbound voice agents reach out at scale — confirming bookings, reactivating old leads, running follow-up sequences, and qualifying lists before a human ever joins the call.

Noctix AI runs these as two productised services: Voxie for inbound and Voxo for outbound.

## Why adoption is accelerating

Three things changed: voice quality became indistinguishable from a human in short conversations, the cost per minute collapsed, and integrations with CRMs and calendars became reliable. That combination turned voice agents from a novelty into an operations tool.

If your business loses leads after hours or struggles to follow up fast enough, a voice agent is usually the highest-leverage place to start.`,
  },
  {
    slug: "crm-automation-guide",
    title: "CRM Automation: How to Stop Losing Leads in Your Pipeline",
    description:
      "A practical guide to CRM automation — what to automate first, what to leave alone, and how to keep your pipeline clean as you scale.",
    keyword: "crm automation",
    date: "2026-01-25",
    readTime: "6 min read",
    body: `Most CRMs are clean for about three weeks. After that, fields go missing, leads get stuck in the wrong stage, and the pipeline stops reflecting reality. CRM automation is what keeps it usable.

The goal isn't to automate everything — it's to remove the manual steps that always get skipped when the team is busy.

## What to automate first

Start with capture and routing. Every lead from forms, ads, calls, and inboxes should land in the CRM with a source, a score, and an owner — automatically. No manual entry, no copy-paste.

Next, automate stage hygiene. When a deal hasn't moved in X days, flag it. When a quote is sent, move the deal. When a customer pays, mark it won and trigger onboarding.

Then layer in follow-ups: reminders, sequences, and re-engagement for stale leads.

## What to leave alone

Don't automate the actual sales conversation. Automation should set up the human, not replace them. The system gets the right lead in front of the right person at the right time — the close still belongs to your team.

A clean CRM isn't a tooling problem, it's a process problem with a tooling solution. Noctix AI builds the workflows that keep yours honest.`,
  },
  {
    slug: "lead-generation-systems",
    title: "Lead Generation Systems: Building a Predictable Pipeline",
    description:
      "How modern lead generation systems combine data, AI scoring, and outreach automation to build a predictable B2B pipeline.",
    keyword: "lead generation systems",
    date: "2026-02-02",
    readTime: "7 min read",
    body: `A lead generation system is the difference between "we ran some outreach last month" and a pipeline that produces qualified conversations every single week.

The companies that grow predictably treat lead gen as a system, not a campaign. That means defined inputs, defined outputs, and a workflow that runs whether anyone is paying attention to it or not.

## The four layers

The first layer is data — building accurate lists of accounts that match your ICP, with the right contacts and enrichment. Generic databases aren't enough; the data has to be fresh and filtered.

The second layer is intent. Which of those accounts are showing real signals right now — hiring, funding, tech changes, web activity, content engagement? AI scoring prioritises the ones worth contacting first.

The third layer is outreach — multi-channel, personalised, and sequenced. Email, LinkedIn, and voice agents working together instead of in silos.

The fourth layer is feedback. Every reply, booking, and rejection feeds back into the scoring model so the system gets sharper over time.

## Why most lead gen fails

Most teams build the third layer and skip the rest. They send a lot of messages to a poorly filtered list and call it a strategy. The result is low reply rates and burned domains.

A real system fixes the inputs first. Noctix AI builds the data, scoring, and outreach layers as one connected pipeline.`,
  },
  {
    slug: "marketing-automation-customer-data",
    title: "Marketing Automation: Turning Customer Data Into Smarter Campaigns",
    description:
      "How marketing automation uses clean customer data to send better campaigns, improve segmentation, and drive more revenue per contact.",
    keyword: "marketing automation",
    date: "2026-02-10",
    readTime: "6 min read",
    body: `Marketing automation is only as good as the data behind it. The fanciest email platform in the world won't save a list that's stale, mis-segmented, or disconnected from the rest of the business.

The companies that win with marketing automation aren't always the ones with the biggest lists. They're the ones who understand their customers best and can act on that understanding at speed.

## Start with the data layer

Before any campaign, the customer record needs to be clean and connected. Purchases, events, support tickets, calls, web activity — all flowing into one profile. That profile is what makes segmentation meaningful.

Once that's in place, segmentation stops being about "all customers in the UK" and starts being about "customers who bought X in the last 90 days, opened the last two emails, and haven't returned." That's where automation earns its keep.

## Automate the boring, personalise the rest

Welcome flows, win-back sequences, post-purchase follow-ups, abandoned-cart recovery, review requests — these run on autopilot. They don't need a human writing each send.

What does need human input is the strategy, the offer, and the brand voice. Automation amplifies those; it doesn't replace them.

When your data is clean and connected, marketing becomes more personal, more timely, and easier to scale. Noctix AI builds the pipelines that get you there.`,
  },
  {
    slug: "why-businesses-lose-leads",
    title: "Why Businesses Lose Leads and How Automation Fixes It",
    description:
      "Learn why businesses lose leads through slow follow-up, missed calls, messy CRMs, and manual processes — and how automation helps fix the problem.",
    keyword: "lead automation",
    date: "2026-02-18",
    readTime: "8 min read",
    body: `Most businesses don't lose leads because their service is bad. They lose leads because the process after the enquiry is too slow, too manual, or too unorganised.

A potential customer fills out a form, sends a message, calls the business, or replies to an ad — and then nothing happens fast enough. The lead waits, gets distracted, contacts a competitor, or forgets why they reached out in the first place.

This is one of the biggest problems automation can solve. At Noctix AI, we build systems that capture, organise, and follow up with leads automatically so fewer opportunities slip through the cracks.

## Why leads get lost

Lead loss usually comes from small operational gaps. One missed call or delayed reply doesn't seem expensive on its own. Across weeks and months, those gaps quietly eat the pipeline.

The most common reasons we see: slow response times, missed calls, messy CRMs, manual follow-up that depends on memory, and too many lead sources that never get unified.

## Slow response times

When someone reaches out, they're usually interested right now. If your business takes hours or days to respond, the lead may already be talking to a competitor. Automation can send instant replies, notify the team, create CRM records, and trigger follow-up tasks within seconds.

## Missed calls

For service businesses, calls are still one of the highest-intent channels. A person who calls usually wants an answer fast — and if no one picks up, they often don't call back. AI voice agents answer when staff are busy or out of hours, qualify the caller, and send a clean summary to the team.

## Messy CRM systems

A CRM should make sales easier. When records are missing details, stages are outdated, and ownership is unclear, it becomes another mess instead. CRM automation fixes this by creating records, updating stages, assigning owners, and tracking follow-ups automatically.

## Manual follow-up

Manual follow-up depends on memory, and memory is unreliable. Automation creates reminders, sends scheduled follow-ups, and alerts the team when a lead actually needs attention.

## Too many lead sources

Modern businesses receive leads from forms, calls, emails, ads, DMs, WhatsApp, referrals, landing pages, and outbound. Without automation, juggling all of that gets messy fast. A lead automation system pulls every source into one workflow.

## What lead automation actually does

A simple flow looks like this: a customer submits a form, the lead is added to the CRM, the system tags the service requested, sends a confirmation, notifies the sales team, creates a follow-up task, tags by source and urgency, and updates a dashboard — all without anyone touching a keyboard.

## Where AI makes it smarter

Traditional automation follows rules. AI adds context. It can read a message, identify what the customer wants, gauge urgency, flag missing info, and prepare a useful summary before the team replies — so conversations don't start from zero every time.

## Signs your business needs lead automation

Leads coming from multiple channels, forgotten follow-ups, missed calls during busy hours, an inconsistent CRM, no visibility on which sources convert, spreadsheets running the pipeline, slow replies, unclear ownership. The problem usually isn't the team — it's the system.

Want to stop losing leads? Noctix AI builds the lead automation system that captures every enquiry, organises your CRM, and helps your team follow up faster.`,
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
