-- Seed data for landing_pages and landing_page_audiences.
-- Depends on the schema from landing-pages-schema.sql being applied first.
-- Do NOT run this file from the dev environment -- apply manually to the production database.

INSERT INTO landing_pages (service_slug, service_name, default_headline, default_subheadline, problem_text, solution_text, proof_text, how_it_works, faq) VALUES

-- 1. AI Voice Agents
('ai-voice-agents', 'AI Voice Agents',
 'Never miss another call.',
 'An AI voice agent answers every inbound call, books the appointment, and hands your team a clean summary, day or night.',
 'The phone is still the highest-intent channel most service businesses have, and it''s also the leakiest. A call that goes unanswered during a busy afternoon rarely gets a callback in time, and the caller has usually already moved on to the next result by then. Every missed call is a lead someone else is about to close.',
 'The AI voice agent picks up the moment staff can''t. It answers real questions, qualifies the caller, and either books the appointment directly on your calendar or hands off a clean, structured summary to your team, so nothing depends on someone being at their desk when the phone rings.',
 'An Australian cleaning company using this exact approach took their lead response rate from 23% to 94%, combining instant capture with automated qualification instead of relying on someone noticing a form fill in time.',
 '[{"step":1,"title":"Connect your number","description":"Your existing business line routes to the agent, or we provision a new one. No hardware, no new phone system."},{"step":2,"title":"We train it on your business","description":"Services, pricing logic, availability, and how you actually want calls handled, not a generic script."},{"step":3,"title":"It goes live","description":"Every call gets answered, qualified, and either booked or handed to your team with a real summary attached."}]',
 '[{"question":"Does it sound like a robot?","answer":"No. Callers regularly don''t realize they''re speaking with an AI agent until told."},{"question":"What happens with a question it can''t answer?","answer":"It hands off cleanly to your team with full context, instead of guessing or dead-ending the caller."},{"question":"How long does setup take?","answer":"Most agents go live within a week of kickoff."}]'),

-- 2. Chatbots & Web Agents
('chatbots-web-agents', 'Chatbots & Web Agents',
 'Turn site visitors into booked calls.',
 'A website agent that answers questions, qualifies leads, and books appointments — trained on your services, not a generic script.',
 'Most service business websites are brochures. A visitor lands, reads a paragraph or two, doesn''t find the answer they need fast enough, and leaves. The contact form sits there hoping someone fills it out, but the conversion rate on a generic form is brutal. The visitor had buying intent and the site let it evaporate.',
 'The web agent sits on your site and actually talks to visitors in real time. It answers questions about your services, pricing, and availability using your real business data — not canned responses. When a visitor is ready, it books them directly onto your calendar or captures their details with full context attached.',
 'The same service business that deployed voice agents saw their website-originated leads increase measurably once the chat agent started catching visitors who would have bounced without finding a phone number.',
 '[{"step":1,"title":"Install a single script tag","description":"One line of code on your site. Works with any website builder, CMS, or custom site."},{"step":2,"title":"Train on your business","description":"We feed it your services, pricing, FAQs, availability rules, and tone of voice."},{"step":3,"title":"It starts converting","description":"Visitors get answered instantly. Qualified leads go straight into your pipeline with context."}]',
 '[{"question":"Will it clash with my existing site design?","answer":"No. The widget matches your brand colors and sits unobtrusively until a visitor engages."},{"question":"Can it handle WhatsApp and Messenger too?","answer":"Yes. Same agent, multiple channels — website, WhatsApp, Messenger, or SMS."},{"question":"What if it gets a question wrong?","answer":"It escalates to your team with the full conversation attached, rather than guessing."}]'),

-- 3. RAG Knowledge Agents
('rag-knowledge-agents', 'RAG Knowledge Agents',
 'Your business knowledge, instantly searchable.',
 'An AI assistant trained on your SOPs, contracts, and internal docs — so your team stops hunting through folders for answers.',
 'Every business accumulates knowledge in scattered places — Google Drive folders, SharePoint sites, Notion pages, PDFs nobody remembers uploading. When someone needs an answer, they interrupt a colleague or spend twenty minutes searching. The knowledge exists, it''s just not accessible at the speed work actually moves.',
 'The RAG agent ingests your documents, indexes them with vector search, and answers questions with cited sources — in Slack, Teams, or a private web interface. Your team asks a question in plain language and gets the actual answer from your actual docs, not a hallucinated guess.',
 'This is the same retrieval-augmented generation architecture used in enterprise knowledge management — applied at a scale that makes sense for growing businesses, not just Fortune 500 companies.',
 '[{"step":1,"title":"Connect your document sources","description":"Google Drive, SharePoint, Notion, uploaded PDFs — wherever your knowledge lives."},{"step":2,"title":"The agent indexes everything","description":"Documents are chunked, embedded, and stored in a vector database for fast retrieval."},{"step":3,"title":"Your team starts asking questions","description":"In Slack, Teams, or a web UI — plain language questions, cited answers from your real documents."}]',
 '[{"question":"Does it hallucinate answers?","answer":"The RAG architecture grounds every answer in your actual documents. If the information isn''t in the source material, it says so instead of guessing."},{"question":"How does it handle document updates?","answer":"Re-indexing runs on a schedule or on-demand. Updated documents are reflected in answers within minutes."},{"question":"Can we control who sees what?","answer":"Yes. Access controls mirror your existing document permissions."}]'),

-- 4. AI SDR & Outreach
('ai-sdr-outreach', 'AI SDR & Outreach',
 'Outbound that books, without the headcount.',
 'An autonomous SDR system that researches prospects, writes personalized messages, sends across email and LinkedIn, and follows up until the meeting is booked.',
 'Hiring SDRs is expensive, training them takes months, and turnover is brutal. Meanwhile, every day without outbound means pipeline dries up. Most teams oscillate between "we need more meetings" and "we can''t afford another rep" — and the gap keeps widening.',
 'The AI SDR handles the entire top-of-funnel sequence: it enriches lead lists, writes personalized outreach based on real prospect data, sends across email and LinkedIn, detects replies, and routes hot leads to your closers with full context. It doesn''t replace your best rep — it replaces the 80% of the role that''s research and follow-up.',
 'Noctix has built outreach systems that run thousands of personalized touches per week while maintaining deliverability — using the same enrichment and sequencing infrastructure that enterprise sales teams pay six figures for.',
 '[{"step":1,"title":"Define your ICP","description":"We build targeting criteria from your best customers, not generic firmographics."},{"step":2,"title":"We build the sequences","description":"Personalized messaging, multi-channel delivery (email, LinkedIn, SMS), and follow-up logic."},{"step":3,"title":"Meetings start appearing","description":"Qualified prospects get routed to your team with enrichment data and conversation context attached."}]',
 '[{"question":"Won''t this hurt our domain reputation?","answer":"No. We use proper warm-up, rotation, and deliverability monitoring. Volume is scaled responsibly."},{"question":"How personalized is the outreach?","answer":"Each message references real prospect data — role, company context, recent activity. Not mail merge with a first name."},{"question":"Can it handle replies?","answer":"Yes. The system detects positive replies, objections, and out-of-office responses, routing each appropriately."}]'),

-- 5. CRM Automations
('crm-automations', 'CRM Automations',
 'Your CRM, finally working for you.',
 'Automated enrichment, pipeline updates, task creation, and deduplication — so your team sells instead of doing data entry.',
 'Every sales team has the same complaint: the CRM is a chore. Reps skip fields, records go stale, duplicates pile up, and by the time anyone runs a report the data is unreliable. The tool meant to organize your pipeline becomes the thing nobody trusts.',
 'We build automations that keep the CRM clean and current without anyone needing to think about it. New leads get enriched automatically. Pipeline stages update based on real activity. Tasks create themselves. Duplicates merge before they multiply. Your CRM becomes something you can actually trust for decisions.',
 'When Groovebox migrated 182,000 contacts to a new CRM, the automation layer we built handled the entire sync — load-tested at 350 webhooks per minute — without losing a single record.',
 '[{"step":1,"title":"Audit your current CRM","description":"We map every field, pipeline, and integration to find where manual work and data rot are costing you."},{"step":2,"title":"Build the automation layer","description":"Auto-enrichment, deduplication, pipeline triggers, task creation — all wired into your existing CRM."},{"step":3,"title":"Your team just sells","description":"The CRM updates itself. Reports are accurate. Reps spend time selling, not typing."}]',
 '[{"question":"Which CRMs do you work with?","answer":"HubSpot, GHL, Pipedrive, Salesforce, and custom CRMs. If it has an API, we can automate it."},{"question":"Will this break our existing workflows?","answer":"No. We build on top of what you have, not replace it. Existing integrations stay intact."},{"question":"How long until we see results?","answer":"Most teams notice the difference within the first week — cleaner data, fewer manual tasks, more accurate reporting."}]'),

-- 6. Workflow Automations
('workflow-automations', 'Workflow Automations',
 'The repetitive steps, running themselves.',
 'Every manual handoff between your tools — data entry, status updates, notifications, file moves — automated into reliable flows.',
 'Most businesses run on a patchwork of tools that don''t talk to each other. Someone exports a CSV here, copies it there, sends an email to notify someone else, and updates a spreadsheet to track that it happened. These manual bridges are fragile, slow, and the first thing that breaks when the team gets busy.',
 'We connect your tools into automated workflows using n8n, Make, and custom code. Data flows between systems without anyone touching it. Status updates trigger the next step automatically. Error handling is built in so you know immediately when something needs attention, instead of discovering it three days later.',
 'The same webhook orchestration infrastructure Noctix used for the Groovebox migration — 350 webhooks per minute, zero data loss — is the backbone of every workflow we build.',
 '[{"step":1,"title":"Map the manual bridges","description":"We document every place where a human is the glue between two systems."},{"step":2,"title":"Build the flows","description":"n8n workflows, webhooks, database syncs, and custom integrations — all with error handling and logging."},{"step":3,"title":"Your ops run unattended","description":"Workflows execute reliably in the background. You get alerts only when something actually needs a human."}]',
 '[{"question":"What tools can you connect?","answer":"If it has an API, webhook, or database, we can connect it. We''ve integrated hundreds of tools across industries."},{"question":"What happens when a workflow fails?","answer":"Built-in error handling retries automatically where safe, and alerts your team immediately when human intervention is needed."},{"question":"Can we modify workflows later?","answer":"Yes. Everything is documented and built to be maintainable, not a black box only we can touch."}]'),

-- 7. Lead Gen Systems
('lead-gen-systems', 'Lead Gen Systems',
 'Leads found, qualified, and routed — automatically.',
 'An end-to-end pipeline that finds prospects matching your ICP, enriches them, scores them, and delivers qualified leads straight into your sales workflow.',
 'Most lead generation is either manual and slow, or automated and untargeted. Your team either spends hours on LinkedIn and Apollo building lists by hand, or buys bulk data that''s mostly noise. Neither scales, and both waste the time of people who should be closing, not prospecting.',
 'We build systems that scrape, enrich, score, and route leads on autopilot. Prospects matching your ICP get identified from multiple sources, enriched with contact and firmographic data, scored against your qualification criteria, and dropped into your sales pipeline ready for outreach — without your team touching a spreadsheet.',
 'The lead enrichment and scoring infrastructure Noctix builds handles thousands of records per run while maintaining data quality — the same approach that powered the 182K-contact Groovebox migration.',
 '[{"step":1,"title":"Define your ideal customer","description":"We build scoring criteria from your best existing customers, not guesswork."},{"step":2,"title":"Activate the pipeline","description":"Automated scraping, enrichment, scoring, and routing — running continuously in the background."},{"step":3,"title":"Qualified leads appear in your CRM","description":"Your sales team opens their pipeline and the prospects are already there, scored and enriched."}]',
 '[{"question":"Where do the leads come from?","answer":"Multiple sources — Apollo, LinkedIn, industry directories, web scraping — matched against your ICP criteria."},{"question":"How accurate is the scoring?","answer":"It''s based on your real customer data, not generic demographics. Accuracy improves as we learn what actually converts for you."},{"question":"Can we adjust the criteria over time?","answer":"Absolutely. The scoring model adapts as your ICP evolves and you close more deals."}]'),

-- 8. Marketing Automation
('marketing-automation', 'Marketing Automation',
 'Campaigns that run on behavior, not a calendar.',
 'Email, SMS, and ad flows triggered by what your customers actually do — segmenting, nurturing, and converting without a marketing team managing every send.',
 'Most marketing automation is just scheduled blasts with a fancy interface. Everyone on the list gets the same email on the same Tuesday, regardless of where they are in the buying process. The result is mediocre open rates, unsubscribes, and a growing sense that "email doesn''t work for us."',
 'We build behavior-driven flows that respond to what each contact actually does. Someone visits your pricing page? They get a relevant follow-up. A trial user goes quiet for three days? They get a re-engagement sequence. A customer hits a usage milestone? They get an upsell offer. Every message is triggered by real behavior, not a calendar.',
 'This is the same segmentation and trigger infrastructure that powers the Noctix blog automation — behavior-based sequences that maintain engagement without manual intervention.',
 '[{"step":1,"title":"Map your customer journey","description":"We identify the key moments where the right message at the right time changes outcomes."},{"step":2,"title":"Build the trigger flows","description":"Behavior-based email, SMS, and ad sequences — each triggered by real actions, not schedules."},{"step":3,"title":"Campaigns run themselves","description":"New contacts enter the right sequence automatically. You monitor performance, not manage sends."}]',
 '[{"question":"Which platforms do you work with?","answer":"Mailchimp, ActiveCampaign, HubSpot, GHL, Klaviyo, and custom setups. The logic is platform-agnostic."},{"question":"Won''t this feel spammy to recipients?","answer":"The opposite. Because messages are triggered by real behavior, they feel relevant and timely — not like bulk blasts."},{"question":"Can we A/B test the sequences?","answer":"Yes. Testing is built into the flow architecture so you can iterate on what actually drives conversions."}]'),

-- 9. Content & Creative AI
('content-creative-ai', 'Content & Creative AI',
 'On-brand content, at a pace humans can''t match.',
 'Production pipelines that generate blog posts, social content, ad creative, and video — trained on your brand voice, running at volume.',
 'Content marketing works, but the bottleneck is always production. Writing a good blog post takes hours. Repurposing it for social takes more hours. Creating ad variations takes even more. Most businesses know they should be publishing more, but they can''t justify hiring a full content team — so they publish sporadically and wonder why content "doesn''t work."',
 'We build production pipelines that generate content at volume while maintaining your brand voice. Blog posts get written, reviewed, and published on schedule. Social content gets repurposed automatically. Ad creative gets generated in multiple variations for testing. The quality stays consistent because the AI is trained on your existing voice, not generating generic output.',
 'The Noctix blog itself runs on this exact infrastructure — an automated content pipeline that produces SEO-optimized articles at a consistent publishing cadence with human review built into the workflow.',
 '[{"step":1,"title":"Train on your brand voice","description":"We analyze your existing content, tone, and style to build a voice model that sounds like you, not like AI."},{"step":2,"title":"Build the pipelines","description":"Blog generation, social repurposing, ad creative variation — each with review gates and approval flows."},{"step":3,"title":"Content ships consistently","description":"Your publishing calendar fills itself. You review and approve, instead of writing from scratch."}]',
 '[{"question":"Will the content sound generic?","answer":"No. The AI is fine-tuned on your brand voice, messaging guidelines, and existing content. Output matches your tone."},{"question":"Do we still review before publishing?","answer":"Always. Every piece goes through an approval gate. The AI produces drafts at speed; your team maintains editorial control."},{"question":"What types of content can it produce?","answer":"Blog posts, social captions, email copy, ad creative, video scripts, and repurposed content across formats."}]'),

-- 10. Document & Invoice AI
('document-invoice-ai', 'Document & Invoice AI',
 'Paperwork that processes itself.',
 'Automated extraction, classification, and routing for invoices, contracts, intake forms, and any document your team currently handles manually.',
 'Every business that deals with paperwork has the same hidden cost: someone is manually reading documents, pulling out the relevant data, and typing it into another system. Invoices get keyed into accounting software. Contracts get reviewed and summarized. Intake forms get transcribed into the CRM. It''s slow, error-prone, and nobody''s favorite part of the job.',
 'We build systems that read, extract, classify, and route document data automatically. Invoices get parsed and entered into your accounting system. Contracts get key terms extracted and flagged. Intake forms get structured and pushed into your CRM. The documents still get processed — just without someone spending their afternoon doing it.',
 'This combines OCR with LLM-based parsing to handle messy, inconsistent document formats that traditional automation can''t — the same approach used in enterprise document processing, scaled for growing businesses.',
 '[{"step":1,"title":"Identify the document types","description":"Invoices, contracts, forms — we map every document type your team processes manually."},{"step":2,"title":"Build the extraction logic","description":"OCR + LLM parsing tailored to your specific document formats, with validation rules for accuracy."},{"step":3,"title":"Documents route themselves","description":"Data flows from documents into your systems automatically. Exceptions get flagged for human review."}]',
 '[{"question":"Can it handle handwritten documents?","answer":"In most cases, yes. The OCR layer handles printed and handwritten text, and the LLM layer interprets context."},{"question":"What about documents in different formats?","answer":"PDFs, scanned images, Word docs, and email attachments — the system handles all common formats."},{"question":"How accurate is the extraction?","answer":"Validation rules catch errors before data enters your systems. Confidence scores flag anything that needs human review."}]'),

-- 11. Dashboards & Reporting
('dashboards-reporting', 'Dashboards & Reporting',
 'Real-time visibility, one screen.',
 'Live dashboards that replace weekly status calls, manual report pulls, and spreadsheet gymnastics — showing exactly what matters, updated automatically.',
 'Most businesses track performance by asking someone to pull numbers from three different tools, paste them into a spreadsheet, and email it around on Friday. By the time anyone looks at it, the data is stale. Important trends get missed because nobody has time to run the report more than once a week.',
 'We build live dashboards that pull from your real data sources — CRM, ad platforms, accounting, project management — and display exactly the metrics that matter to your team. No manual pulls, no stale spreadsheets, no waiting until Friday to find out something went sideways on Tuesday.',
 'The same dashboard infrastructure Noctix builds for clients replaced weekly status calls at multiple service businesses — real-time KPI visibility without a single manual data pull.',
 '[{"step":1,"title":"Define what matters","description":"We work with your team to identify the metrics that actually drive decisions, not vanity numbers."},{"step":2,"title":"Connect your data sources","description":"CRM, ad platforms, accounting tools, databases — all feeding into a single dashboard."},{"step":3,"title":"Your team sees everything live","description":"Real-time dashboards, automated alerts for anomalies, and scheduled reports — all without manual pulls."}]',
 '[{"question":"Which tools can you pull data from?","answer":"Any tool with an API or database — HubSpot, Google Ads, Xero, Stripe, custom databases, and hundreds more."},{"question":"Can different team members see different data?","answer":"Yes. Role-based views ensure everyone sees exactly what''s relevant to their function."},{"question":"Do we need Looker or Metabase?","answer":"We recommend the best fit for your needs. Looker, Metabase, and custom-built dashboards are all options."}]'),

-- 12. Custom AI Tools
('custom-ai-tools', 'Custom AI Tools',
 'Tools built for how your team actually works.',
 'Internal applications, AI agents, and API integrations designed around your specific workflows — not off-the-shelf software you have to work around.',
 'Off-the-shelf tools solve generic problems generically. Your business has specific workflows, specific data structures, and specific edge cases that no SaaS product was designed for. You end up building workarounds, maintaining spreadsheets alongside the tool, or just accepting that the last 20% of the process stays manual.',
 'We build internal tools and AI agents designed around how your team actually works. Custom web apps for specific workflows. Multi-agent systems that coordinate across your stack. API integrations that connect tools no one else has connected. Private LLM deployments for sensitive data. Everything built to fit your process, not the other way around.',
 'From multi-agent orchestration systems to private LLM stacks, Noctix builds custom AI infrastructure that enterprise teams typically need six-figure budgets to access — scoped for the operational reality of growing businesses.',
 '[{"step":1,"title":"Scope the workflow","description":"We map the exact process the tool needs to support, including edge cases and integrations."},{"step":2,"title":"Build and iterate","description":"Rapid development with your team reviewing working software weekly, not waiting months for a big reveal."},{"step":3,"title":"Deploy and support","description":"The tool goes live in your environment, with monitoring, documentation, and ongoing support."}]',
 '[{"question":"Do we own the code?","answer":"Yes. Everything we build is yours. Full source code, documentation, and deployment access."},{"question":"What tech stack do you use?","answer":"Whatever fits the problem. Node, Python, React, Postgres, vector databases, cloud APIs — we choose based on your requirements."},{"question":"Can it integrate with our existing tools?","answer":"That''s the point. Custom tools are built specifically to work with your existing stack, not replace it."}]')

ON CONFLICT (service_slug) DO UPDATE SET
  service_name = EXCLUDED.service_name,
  default_headline = EXCLUDED.default_headline,
  default_subheadline = EXCLUDED.default_subheadline,
  problem_text = EXCLUDED.problem_text,
  solution_text = EXCLUDED.solution_text,
  proof_text = EXCLUDED.proof_text,
  how_it_works = EXCLUDED.how_it_works,
  faq = EXCLUDED.faq;


-- Audience-specific headline overrides (examples to prove the mechanism)

INSERT INTO landing_page_audiences (service_slug, audience_slug, headline, subheadline) VALUES
('ai-voice-agents', 'realtors', 'Stop losing listings to missed calls.', 'An AI agent answers every buyer and seller call instantly — qualifies them, books the showing, and sends your team a clean summary.'),
('ai-voice-agents', 'cleaning-companies', 'Every cleaning inquiry answered, day or night.', 'An AI voice agent picks up when your team is on a job, qualifies the caller, and books the estimate directly on your calendar.'),
('crm-automations', 'home-builders', 'Your CRM should build pipeline, not paperwork.', 'Automated lead enrichment, stage updates, and task creation — so your sales team focuses on selling homes, not updating fields.'),
('lead-gen-systems', 'agencies', 'Fill your client pipeline without cold calling.', 'An automated system that finds agencies-ready prospects, enriches them, scores them against your ICP, and drops qualified leads into your CRM.'),
('marketing-automation', 'ecommerce', 'Abandoned carts recovered. Repeat buyers activated.', 'Behavior-triggered email and SMS flows that recover revenue and drive repeat purchases — without a marketing team managing every campaign.')
ON CONFLICT (service_slug, audience_slug) DO UPDATE SET
  headline = EXCLUDED.headline,
  subheadline = EXCLUDED.subheadline;
