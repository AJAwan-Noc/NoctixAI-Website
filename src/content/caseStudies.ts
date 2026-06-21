export type CaseStudy = {
  slug: string;
  title: string;
  industry: string;
  service: string;
  summary: string;
  metric: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  result: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "groovebox-event-data-automation",
    title: "Groovebox — Event Data Automation & Reporting System",
    industry: "Events & Ticketing",
    service:
      "Data automation, reporting dashboards, database workflows, multi-platform integration",
    summary:
      "Unified Skiddle, Fixr, and Fatsoma ticketing data into one source of truth powering venue-level reporting.",
    metric: "One unified reporting layer across 3 ticketing platforms",
    challenge:
      "Groovebox was managing event, ticketing, and customer data across multiple platforms including Skiddle, Fixr, and Fatsoma. Each platform had its own data structure, which made it difficult to track event performance, venue-level sales, customer activity, and historical ticketing data in one clean system. Manual reporting was slow, fragmented, and difficult to scale. The team needed one reliable source of truth that could power internal reporting, venue owner reports, and future marketing automation.",
    solution:
      "Noctix built an automated data pipeline that connected the different ticketing platforms into a structured central database. We mapped event records, cleaned venue and customer data, handled historical data imports, and created workflows to keep new data flowing automatically. We also built reporting-ready database views so the client could connect their data directly into Looker Studio and generate venue-level reports.",
    deliverables: [
      "Automated Skiddle, Fixr, and Fatsoma data pipelines",
      "Historical event, order, ticket, and customer imports",
      "Central Supabase/Postgres database structure",
      "Clean venue and event mapping across platforms",
      "Reporting-ready views for Looker Studio",
      "Production n8n workflows for ongoing data syncs",
      "Foundation for future Klaviyo marketing automation",
    ],
    result:
      "Groovebox gained a unified event reporting system that reduced manual reporting work and gave the team a much cleaner view of their event performance. Instead of switching between platforms and spreadsheets, the business could now manage its ticketing data from one central source.",
  },
  {
    slug: "anytime-cleaners-lead-management",
    title: "Anytime Cleaners — Lead Management & Workflow Automation",
    industry: "Cleaning Services",
    service: "CRM automation, lead routing, operations workflow automation",
    summary:
      "Replaced scattered enquiry tracking with a single CRM workflow that captures, routes, and follows up on every lead.",
    metric: "Zero leads lost between enquiry and follow-up",
    challenge:
      "Anytime Cleaners needed a more reliable way to manage incoming leads, customer requests, job information, and follow-ups. Like many service businesses, the company had valuable enquiries coming in from different places, but the process to track, qualify, and follow up was inconsistent. Leads were being missed, follow-ups were forgotten, and team members did not always have a clear view of who was responsible for the next step.",
    solution:
      "Noctix built a CRM-driven lead management system that captures every enquiry from website forms, ads, and inbound calls into one structured pipeline. We added automated lead routing based on service type and location, follow-up reminders for the team, and clean job records that travel with the customer through quote, booking, and completion.",
    deliverables: [
      "Centralised CRM pipeline for leads and customers",
      "Website form and ad lead capture automations",
      "Service-type and location-based lead routing",
      "Automated follow-up reminders and tasks",
      "Quote and booking status tracking",
      "Internal team notifications via email and chat",
      "Reporting on lead source, conversion, and response time",
    ],
    result:
      "Anytime Cleaners stopped losing leads in inboxes and spreadsheets. Every enquiry now lands in the CRM with a clear owner, the right follow-up sequence, and visibility for the management team — turning a chaotic intake process into a repeatable operations system.",
  },
  {
    slug: "internal-ai-operations-system",
    title: "Internal AI Operations System — Enterprise Automation Layer",
    industry: "Operations & Internal Tools",
    service: "Custom AI tools, internal automations, n8n workflows, API integrations",
    summary:
      "Built an internal AI operations layer that connects tools, automates handoffs, and removes repetitive admin from the team's day.",
    metric: "Internal admin time reduced across recurring workflows",
    challenge:
      "The client's operations team was spending too much time on repetitive internal tasks — moving data between tools, generating recurring reports, updating internal trackers, and chasing handoffs. The work was important but manual, and it was getting in the way of higher-value projects. They wanted an internal layer of AI and automation that the team could actually rely on day-to-day.",
    solution:
      "Noctix designed and built a custom internal operations layer combining n8n workflows, API integrations, and AI agents. We mapped the recurring tasks, identified which steps were rules-based and which needed AI judgement, and built each workflow with clear ownership, logging, and error handling. The result was a system the team could trust to run without supervision.",
    deliverables: [
      "Workflow audit and prioritisation roadmap",
      "n8n production workflows with monitoring",
      "Custom AI agents for triage, summarisation, and routing",
      "API integrations across the internal stack",
      "Internal dashboards for visibility and ownership",
      "Error alerting and retry logic",
      "Documentation and handover for the internal team",
    ],
    result:
      "The team got back hours of recurring admin time each week, and the operations layer became a foundation the business could keep extending — adding new agents and workflows as new bottlenecks appeared, instead of hiring more people for repetitive work.",
  },
  {
    slug: "b2b-prospecting-lead-intelligence",
    title: "Smart Prospecting & Lead Intelligence System",
    industry: "B2B Sales & Outreach",
    service: "Lead generation, intent-based prospecting, AI lead scoring",
    summary:
      "Turned generic cold outreach into a targeted prospecting engine that prioritises companies with real buying signals.",
    metric: "Higher-quality lead lists, prioritised by intent signals",
    challenge:
      "The client was running outreach campaigns to large lists of companies but seeing weak response rates. The targeting was based on basic filters like industry and size — not on whether the companies actually had a real reason to need the service. They wanted a smarter way to build prospect lists, prioritise the right companies, and focus outreach on accounts with real intent signals.",
    solution:
      "Noctix built an intent-based lead generation system that combines data collection, website and signal analysis, decision-maker research, and AI scoring into one workflow. Instead of contacting everyone in a category, the system surfaces the companies most likely to need the service right now and prepares them as outreach-ready records.",
    deliverables: [
      "Target market and ICP definition",
      "Automated business discovery and enrichment",
      "Website and signal analysis logic",
      "Intent scoring system",
      "Decision-maker research process",
      "Outreach-ready lead lists",
      "Qualification logic before campaigns",
      "Exportable data for email or CRM campaigns",
    ],
    result:
      "The client moved from volume-based prospecting to a focused, intent-driven system. Sales effort now goes into companies with stronger signs of need, the messaging is grounded in real context, and the pipeline is built on quality rather than blasted lists.",
  },
  {
    slug: "klaviyo-data-pipeline-events",
    title: "Klaviyo Data Pipeline — Customer Marketing Automation for Events",
    industry: "Events & Marketing",
    service: "Klaviyo integration, customer data automation, buyer behaviour tracking",
    summary:
      "Designed a Klaviyo-ready data model that turns raw ticketing data into segmentation-ready customer profiles.",
    metric: "Buyer-level data ready for personalised campaigns",
    challenge:
      "The client had a large amount of customer and ticket purchase data, but it was not fully structured for advanced marketing automation. They needed buyer-level information inside Klaviyo, including what each customer bought, which events they attended, how often they purchased, and what type of events they were interested in. Without this structure, email marketing would remain generic instead of personalised.",
    solution:
      "Noctix designed a Klaviyo-ready data model that pushes customer profiles, purchase events, event attendance data, and behavioural properties into Klaviyo. The goal was to help the client segment customers more intelligently and send more relevant campaigns. The system was planned to support both historical data migration and ongoing real-time updates from production workflows.",
    deliverables: [
      "Buyer-level customer data structure",
      "Event and ticket purchase mapping",
      "Historical data push planning",
      "Ongoing sync workflow design",
      "Klaviyo profile property mapping",
      "Event-based marketing triggers",
      "Segmentation-ready customer fields",
      "Foundation for personalised email campaigns",
    ],
    result:
      "The client gained a clear plan for turning raw ticketing data into actionable marketing data. With the right customer properties and event history inside Klaviyo, the business could move toward smarter segmentation, better targeting, and more personalised campaigns.",
  },
  {
    slug: "sales-followup-automation",
    title: "Sales Follow-Up Automation — Turning Missed Leads Into Booked Conversations",
    industry: "B2B Services",
    service: "Sales automation, CRM workflow, lead follow-up system, AI-assisted qualification",
    summary:
      "Replaced inconsistent manual follow-up with a structured CRM workflow that captures, classifies, and chases every new lead.",
    metric: "Consistent follow-up across every new lead and channel",
    challenge:
      "A growing service business was getting leads from website forms, direct messages, referrals, and outbound campaigns. Volume wasn't the issue — consistency was. Some leads were contacted in minutes; others sat untouched for hours or days. Sales notes lived across messages, spreadsheets, and CRM fields, so the team had no simple way to know which leads were warm, which needed a nudge, and which were ready for a call. The result was lost opportunities and a sales process that was hard to manage.",
    solution:
      "Noctix designed a sales follow-up automation system that captures every new lead, organises it inside a CRM workflow, and automatically triggers the next best action. The system classifies leads by source, urgency, service interest, and buying intent, then creates reminders, sends internal alerts, and prepares the sales team with AI-generated summaries before outreach. Instead of relying on memory or manual tracking, the business now has a structured process for every lead that comes in.",
    deliverables: [
      "Multi-source lead capture workflow",
      "CRM lead creation and pipeline updates",
      "Automated follow-up reminders",
      "AI-assisted lead summaries",
      "Lead source tracking and tagging",
      "Sales task assignment by service and urgency",
      "Internal notifications for high-priority leads",
      "Follow-up status tracking",
      "Missed lead recovery process",
      "Foundation for email and SMS automation",
    ],
    result:
      "The business gained a more reliable sales process where leads are captured, tracked, and followed up with consistently. The team can prioritise stronger opportunities, reduce manual admin, and stop losing potential customers to slow or missed follow-up.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
