# Course outline: the 28 walkthroughs

Titles and numbering are taken from the partner sales page, so what students find
here matches what they were sold. Per video: what to put on screen, the topics to
cover, and the one thing that must not go unsaid.

No dialogue. Nothing to read out.

## Open these before you hit record

- [The student repo](https://github.com/BrettZuke/AIPM-Complete-Setup)
- [Template gallery, all 20](https://aipm-templates.vercel.app)
- [A finished client site](https://summit-roofing-site.vercel.app)
- [The sales call proposal](https://aipm-client-proposal.vercel.app)
- [An auto-built proposal](https://aipm-instant-proposal.vercel.app/proposal.html?site=integrity-plumbing-heating)
- [An auto-built site](https://aipm-instant-site.vercel.app)
- [Evergreen video page](https://settoku-watch.vercel.app)
- [Apify token](https://console.apify.com/settings/integrations)
- [Groq key, free](https://console.groq.com/keys)
- [Slack incoming webhook](https://api.slack.com/apps)
- [GA4 property](https://analytics.google.com)
- [Google Business Profile](https://business.google.com)


---

## Module 01: Get set up on the AI
*Day 1*

### 1.1 Welcome and how the partnership works

**Show**
- The Circle space, so they know where everything lives
- The repo top level on GitHub, folders only, no code
- The seven modules and the day and week timings

**Cover**
- What they have actually bought: the systems, the walkthroughs, the calls, the texting
- One outcome only. A signed local business client
- The order of the six months, and that week one is not orientation, it is outreach
- What the AI does versus what they do
- How to get help: the weekly calls, the 1:1 texting, and Circle between them

⚠️ **Do not skip:** Tell them to watch 1.2 and 1.3 back to back today and set the accounts up while the video plays. The people who browse the repo first are the ones who never start.

### 1.2 Installing your software stack

**Show**
- `00-setup/README.md`, the cost table on screen
- `/setup` running in Claude Code
- Four properly: Vercel, [Apify](https://console.apify.com/settings/integrations), the Google Sheet, Resend
- `00-setup/07-google-sheet.md`, slowly, this is the one they get stuck on
- The other six at speed: GitHub, Claude Code, [Groq](https://console.groq.com/keys), domain, Cal.com, Stripe
- `/check` finishing green

**Cover**
- Ten accounts, nine free. Only the domain costs money, about ten a year
- Done once, never again
- It walks them one at a time and writes every key into the right file. They never hand-edit anything
- Apify: make two or three free accounts, number the tokens, it rolls to the next when one runs dry
- Resend: verify the domain or every email lands in spam
- Run `/check` first whenever anything stops working, ever

⚠️ **Do not skip:** The sheet SHARED_TOKEN is not optional, whatever the older guide says. Blank means anybody who ever gets that web app address can write straight into their CRM. Put the words on screen.

### 1.3 Getting your AI set up and connected  **[thin backup, write the page first]**

**Show**
- Claude Code installing, then `claude` starting inside the repo folder
- `cp -R skills/* ~/.claude/skills/` then a restart
- The `.claude/commands` folder, all five
- A real request typed out in full, and the result
- It getting something wrong on purpose, and you correcting it

**Cover**
- This is the thing that does the work. Everything else is plumbing
- The five commands: `/setup` `/check` `/find-leads` `/build-site` `/onboard-client`
- 39 skills installed once. They never call one by name, it picks
- How to phrase a request: describe the outcome you want, not the command you think it needs
- What to do when it gets it wrong. Tell it what is wrong, do not start again
- How to check its work before a client ever sees it

⚠️ **Do not skip:** Read what it produces before it reaches a client. It is very good and it is not infallible, and a made-up detail on a real business is their problem as well as yours.

### 1.4 Setting your agency profile and signature  **[thin backup, write the page first]**

**Show**
- Searching the repo for `{{YOUR_BUSINESS}}`, `{{YOUR_NAME}}`, `{{YOUR_BOOKING_LINK}}`, `yourdomain.com`
- The seller panel on [the proposal](https://aipm-client-proposal.vercel.app), where their name and prices go
- Where the signature and photo go on the proposal
- The sign-off in `scripts/cold-email` and `scripts/phone`
- Their Cal.com booking link, pasted everywhere it belongs

**Cover**
- Every single place their name, business, booking link and signature appear, in one pass
- An email address on their own domain, never a free webmail one
- Their own photo and signature on the proposal, not a placeholder
- The contract clauses are a starting point and should be looked at by their own solicitor

⚠️ **Do not skip:** Never claim clients they do not have. "I build websites for local businesses" is true on day one. "Trusted by fifty businesses" is not, and one ordinary question on a call ends the deal.


---

## Module 02: Make the systems yours
*Day 2 to 4*

### 2.1 Picking the trade you are going after

**Show**
- `01-find-leads/README.md`, the evidence table full screen

**Cover**
- Plumbers best. About half list an email and nearly a third have no site or a weak one
- Electricians second
- Avoid dentists, lawyers and accountants. Every one already had a decent site, they have agencies
- Avoid barbers and nail salons. Only about eight percent list an email, so there is nothing to send to
- Measured across 224 real businesses, not a hunch
- The town: where they live, or anywhere they have a connection. A connection beats a bigger city

⚠️ **Do not skip:** Pick from the table, not from what sounds interesting. Most people choose a niche they like the idea of and then wonder why nobody replies.

### 2.2 Prompting the AI to reskin everything

**Show**
- [The gallery](https://aipm-templates.vercel.app), scroll it, open two
- `04-deliver/01-website/REUSING-A-TEMPLATE.md`, the start-from table
- One live reskin, plumbing skin into a different trade, start to finish

**Cover**
- A template is a skin, not a trade. Underneath they are the same site
- The start-from table: electrician from plumbing, roofer and builder from landscaping, cleaner from wellness, garage from auto detailing, removals from landscaping
- Only three things make it a different trade: the words, the photos and the colours
- Nine of the twenty are agency, creator and ecommerce skins. Good for their own site, wrong for a plumber

⚠️ **Do not skip:** Search the finished site for the template's own business name before handing it over. It is the most common thing left behind, usually in the footer, an alt tag, or a blog post nobody read.

### 2.3 Setting your prices and your offer  **[thin backup, write the page first]**

**Show**
- The seller panel on [the proposal](https://aipm-client-proposal.vercel.app), prices being set
- The ten line items with their stated values, scrolled through
- Stripe, where the payment links live

**Cover**
- The ten line values as they appear on the proposal, and that they add up to the anchor
- Setup fee versus monthly fee, and which one is the actual business
- What moves the price up and what moves it down
- Never discount the monthly to win the build. You regret it every month for a year

⚠️ **Do not skip:** Work starts after the money clears, never on a promise to pay. The non-refundable clause only protects them if that order is kept.

### 2.4 Checking it over before you sell it  **[thin backup, write the page first]**

**Show**
- `python3 00-setup/setup_check.py` running
- Sending yourself a test lead through a built site's form, and the email arriving
- Generating a test proposal end to end
- Signing a test contract and the PDF coming back

**Cover**
- Prove the whole rig works before a stranger sees any of it
- The four things to test: a lead arriving, a proposal generating, a signature completing, their own site being live
- What a failure at each step actually means

⚠️ **Do not skip:** A green setup check is not the same as a working end-to-end flow. The check proves the keys are present. Only sending yourself a real lead proves anything arrives.


---

## Module 03: What you are selling
*Day 3 to 5*

### 3.1 The offer, line by line, and what each part is worth

**Show**
- [The proposal](https://aipm-client-proposal.vercel.app), scrolled top to bottom once in silence, then again with commentary
- The ten folders in `04-deliver`, one per line item
- [A finished client site](https://summit-roofing-site.vercel.app) as the thing all ten add up to

**Cover**
- All ten in order with what each is worth: website, CRM, lead follow-up, SEO, referral, reviews, chatbot, launch, notifications, analytics
- Which ones the client notices and which ones quietly earn the monthly fee
- That lead follow-up is the most important thing they deliver, despite not being the biggest number

⚠️ **Do not skip:** They sell a mechanism and a standard of work. Never a result, never a number of leads, never a ranking.

### 3.2 Why a local business actually pays for this  **[thin backup, write the page first]**

**Show**
- A real, genuinely bad local business site, found live
- [The finished site](https://summit-roofing-site.vercel.app) next to it, and the enquiry form submitted
- A Google listing with no photos and no services filled in

**Cover**
- What they are losing right now: a customer fills in three forms on a Tuesday night and whoever replies first gets the job
- Most local sites show a thank-you page and do nothing, so the owner never even knows
- They have usually already paid for a website once, which is why they value one
- Their Google listing brings most trades more work than the site does, and it is usually half empty
- Why a website on its own was never the thing they were buying

⚠️ **Do not skip:** Never insult their current site to their face. Show them what is missing, not what is bad. The person who built it is often their nephew.

### 3.3 Handling the price question

**Show**
- `scripts/phone/discovery-call.md`, the objections section
- The price moment on the proposal, where you stop talking

**Cover**
- Say the number, then nothing. Whoever speaks first loses
- The real objection versus the wrapper. "I need to think about it" is almost never about thinking
- The four objections and what each one actually means
- When "too expensive" means they do not believe it will work, and how that is a different conversation

⚠️ **Do not skip:** Agreeing at the start of the call that a no today is completely fine is what makes the price moment survivable. Without it they will talk over their own number.

### 3.4 What to promise and what never to promise

**Show**
- `03-sell/README.md`, the warnings
- The contract inside `tools/sales-proposal`
- The AEO section of `04-deliver/04-seo` as a worked example of an honest claim

**Cover**
- Never promise a result, a lead count, a ranking, or that an AI will recommend them
- What they do promise: the mechanism, a standard of work, and to keep going until the client is happy
- Never invent a review, a rating, a year founded, a customer count or an accreditation
- Why the honest version actually sells better: the audience has been burnt before

⚠️ **Do not skip:** This is what keeps them out of a dispute they cannot win. Say it as a business protection, not as a moral point, and it lands.


---

## Module 04: Finding thousands of leads
*Week 1*

### 4.1 Running the scraper on any town or trade

**Show**
- `/find-leads` in Claude Code, giving it a trade and a town
- It asking for confirmation and quoting the cost before it spends anything
- The run, uncut, so they see how long it really takes

**Cover**
- It searches Google Maps then opens each business's site to judge how old it is
- About six tenths of a cent per business. A whole town of one trade is pennies
- Keep any single run under about four dollars. Add another free Apify account rather than one huge run
- It never spends their credit without asking first

⚠️ **Do not skip:** Two things that waste an afternoon. The country code is the two letter one, gb not uk. And re-running the same town returns nothing, on purpose, because it skips businesses already in the sheet. That looks exactly like a bug.

### 4.2 Filtering down to the ones worth calling

**Show**
- The results sorted, strongest at the top
- The columns: phone, email, website status, rating, and the one-line reason to reach out
- Two real rows, one of each hot lead type

**Cover**
- No website: you are selling them their first one. Proven demand, nothing to beat
- Old or broken site: the better lead, because they already paid for a website once and you can show them exactly what is wrong
- Why the reason column decides which email angle to send
- Which rows to ignore entirely

⚠️ **Do not skip:** Work top down, hottest first, and inside that the ones with an email first, because those can be contacted tonight rather than during business hours.

### 4.3 Getting them into the CRM

**Show**
- The deployed CRM with the leads in it
- The pipeline, the lead drawer, and the statuses
- `00-setup/ENV-REFERENCE.md`, the CRM section

**Cover**
- The Google Sheet is the database. The CRM is the front end on it
- The statuses and what moves a lead between them
- Two ways to run it: you keep it, or a client with a sales team gets their own login

⚠️ **Do not skip:** The scraper and the CRM must have exactly the same sheet URL and token. If they differ, leads land somewhere the CRM cannot see and nothing errors.

### 4.4 Keeping the pipeline full  **[thin backup, write the page first]**

**Show**
- `02-outreach/email-warmup.md`, the ramp
- The CRM counts, and what a healthy week looks like in it
- Scraping a second town while the first is still being worked

**Cover**
- The maths: how many leads makes how many replies, how many replies makes a call, how many calls makes a client
- Therefore what one week actually looks like, in numbers
- When to scrape the next town, which is before the current one runs out, not after
- The warmup ramp, five a day in week one building to fifty over a month

⚠️ **Do not skip:** Two domains. Never send cold email from the same domain clients reply to. Burn it and you burn the address your paying clients use.


---

## Module 05: Outreach that books calls
*Week 1*

### 5.1 Connecting the automatic email sender

**Show**
- `tools/lead-scraper/RESEND-SETUP.md`
- The domain records going in, and the verification turning green
- `tools/lead-scraper/send_emails.py` running against real rows
- A lead's status moving after a send

**Cover**
- How the sequence works: a first touch, then up to five follow-ups if they do not reply
- The statuses that stop somebody being emailed twice
- The warmup ramp again, because this is where it actually bites
- Checking their own deliverability before sending at volume

⚠️ **Do not skip:** The failure here is deliverability, not copy, and it looks exactly like a copy problem because test emails they send themselves always arrive. Fifty sends on a brand new domain on day one lands in spam permanently.

### 5.2 The email scripts that get replies

**Show**
- `scripts/cold-email`, the folder listing
- One angle file open, first two lines read, then stop
- `scripts/cold-email/follow-ups.md` and the break-up email
- [The auto-built proposal](https://aipm-instant-proposal.vercel.app/proposal.html?site=integrity-plumbing-heating) that goes in the email

**Cover**
- Four angles: no website, outdated site, reviews, not ranking
- Match the angle to what the scraper found. It is already in the lead row
- Short. Their name, one specific thing, the link, the ask. Nobody reads paragraph two from a stranger
- Most replies come from the follow-ups, not the first send
- The three shapes of outreach: a proposal, a video, or both

⚠️ **Do not skip:** Never a form. A busy owner will not answer questions for a stranger they have not decided to trust. Every message ends in one ask: book a call.

### 5.3 Working the phone and the power dialler

**Show**
- `scripts/phone/cold-call.md` and the voicemail script
- The dialler in the CRM, moving with arrow keys
- One real call placed, and the outcome logged

**Cover**
- It dials through their own phone with a normal phone link. Nothing to buy, nothing billed, no number to register
- The opening line and what to do in the first ten seconds
- Logging every outcome as they go, so the follow-up knows what happened
- Best times to ring a trade, which is not the middle of the working day

⚠️ **Do not skip:** Leave the voicemail. Most people hang up, and the voicemail is what makes the second call a returned call instead of a cold one.

### 5.4 DM outreach, word for word

**Show**
- `scripts/dm/README.md`
- A real lead row with a social profile and no email
- The objection handling in the same file

**Cover**
- This is for the leads the scraper found no email for, which is a big slice in some trades
- The opener, and why it is not a pitch
- How the conversation gets to the same place: book a call
- When to give up and ring them instead

⚠️ **Do not skip:** Do not pitch in the first message. A DM that opens with an offer gets deleted, and on some platforms it gets the account limited.


---

## Module 06: Closing the deal
*Week 1 to 2*

### 6.1 Running the sales call

**Show**
- `scripts/phone/discovery-call.md`, the seven steps on screen
- [The proposal](https://aipm-client-proposal.vercel.app) as they would share it on the call

**Cover**
- Step one, agree up front that a yes or a no today are both fine
- Step two, six questions about how they get work now, then be quiet
- Step three, say their answers back and get agreement
- Step four, walk the levers tied to what they just said, not a feature list
- Step five, the price, then silence
- Step six, the real objection
- Step seven, payment and signature while still on the call

⚠️ **Do not skip:** Step five is where everyone fails. They will say the number and then, because the silence is unbearable, start justifying it. Demonstrate the pause on camera, properly, for longer than is comfortable.

### 6.2 Sending the proposal from the system

**Show**
- Generating a proposal for a real scraped lead
- [The result](https://aipm-instant-proposal.vercel.app/proposal.html?site=integrity-plumbing-heating), with their existing site embedded in it
- The seller panel with prices already set

**Cover**
- One per client, generated from their data, not a template they fill in
- Their own site embedded so the comparison makes itself
- Sharing screen on the call versus sending the link before it
- What to do when they want to "have a look and come back to you"

⚠️ **Do not skip:** Set the prices before the call, never during it. Editing a number while they watch is the fastest way to make the price look invented.

### 6.3 Handling objections

**Show**
- The objections section of `scripts/phone/discovery-call.md`
- The objection handling in `scripts/dm/README.md`

**Cover**
- The four objections and the real meaning behind each
- "I need to think about it", "I need to speak to my partner", "it is too expensive", "I already have a website"
- Answering the objection under the objection instead of the words
- When a no is genuinely a no, and leaving well

⚠️ **Do not skip:** Never argue. The moment it becomes a debate the sale is over, and a local trade talks to every other local trade in that town.

### 6.4 Contract, signature and collecting the money

**Show**
- The contract at the bottom of the proposal
- A signature being taken on the page
- The executed PDF and the audit trail it produces
- Stripe, and the payment landing

**Cover**
- Signed and paid while still on the call, not "I will send it over"
- What the agreement actually covers, in plain English
- The non-refundable clause and what makes it hold
- That referral rewards are funded by the client, and it is in the contract

⚠️ **Do not skip:** Two things. Work starts after the money clears, never before. And the contract is a starting template, not legal advice, so they should have their own solicitor look at it before signing anything real.


---

## Module 07: Building and delivering
*Week 2 onward*

### 7.1 Prompting the factory to build the client site

**Show**
- `/onboard-client` running the moment payment lands
- `04-deliver/client-onboarding`, the form the client fills in
- `scripts/client-emails`, all ten, and 01 and 02 in particular
- `/build-site` reading their answers and building
- The deploy to a Vercel project of its own

**Cover**
- The ten client emails and when each goes out
- Onboarding form the same day they pay. Chase in two days by offering to fill it in together
- Most stalled builds are a form nobody filled in, not a technical problem
- Photos are what actually holds up a build. Ask in the first email, every time
- One Vercel project per client, never shared

⚠️ **Do not skip:** Their own photos, always. Stock photos of somebody else's roof is the fastest way to look like every other cheap site in town. And never invent a review, a rating or a year founded to fill a blank on the form.

### 7.2 Switching on the CRM and review engine

**Show**
- Marking a lead Won in the CRM and the thank-you email firing
- The thank-you page in order: thanks and video, discount, review ask, referral
- The referrals page, the payout ledger and the cap
- `04-deliver/06-reviews/CLIENT-VIDEO-SCRIPT.md`, the video the owner records

**Cover**
- It fires on Won, runs once per customer, and only after the save succeeds
- It stays silent until three variables are set, which is why it looks broken when it is simply off
- Referral reward, discount, keyword and yearly cap, all editable without redeploying
- The owner records a thirty second video on their phone, and it powers both the review ask and the referral

⚠️ **Do not skip:** The discount is given unconditionally and never tied to leaving a review. Paying for reviews breaks Google's rules and can get the client's listing penalised. And get their Google review link at onboarding, because this whole line item dies without it.

### 7.3 Launching and handing over

**Show**
- Vercel, Settings then Domains, adding the domain and the DNS records
- The padlock appearing on the real address
- The `/privacy` and `/terms` pages on the built site
- `04-deliver/08-launch/LAUNCH-QA.md`, worked through on camera
- `04-deliver/01-website/GOOGLE-BUSINESS-PROFILE.md` and [the listing itself](https://business.google.com)
- [GA4](https://analytics.google.com), and seeing yourself in Realtime
- [The Slack webhook](https://api.slack.com/apps), about two minutes

**Cover**
- Four steps and a wait. The SSL turns itself on
- Every client site now ships a privacy policy and terms, because the contact form collects personal details
- The QA checklist, phone first, then the form submitted for real
- Google Business Profile: category, service areas, hours, photos. It brings most trades more work than the site
- GA4 on day one, because it cannot tell you about traffic from before it was installed
- Slack into a dedicated leads channel, not their general one

⚠️ **Do not skip:** Never move a client's domain or GA4 property into their own account quietly. If the client leaves, both are theirs. And a successful deploy message is not proof of anything, open the real address and look at it.

### 7.4 Setting up the monthly plan

**Show**
- `scripts/client-emails/06-monthly-report.md`, the template
- The four numbers being pulled out of GA4
- `05-keep-the-client/README.md`
- `scripts/client-emails/10-seasonal.md` and the per-trade timing table

**Cover**
- The build fee pays once, the monthly fee is the business. Do the maths out loud on ten clients
- The four numbers: found, enquired, where from, what they read
- The fifth part that actually keeps them paid: what you changed this month and what is next
- Even a quiet month has something. A speed check, a new service page, seasonal copy
- Answer small edits the same day, it buys more loyalty than any report
- Seasonal timing per trade, put in the calendar the day the client signs

⚠️ **Do not skip:** Send it every single month whether they ask or not, and never skip a bad month. A client who hears from you monthly stays for years. A client who hears nothing cancels the first quiet month they have.

---

## Not yet covered by any of the 28

Six things landed in the repo after this outline was written. None of them has a
video, and between them they open a second route the curriculum does not describe.

**The creator and coach route.** `01-find-leads/client-research` builds a
thirteen section dossier on any creator from their Instagram and YouTube, and
`01-find-leads/youtube-creator-scraper` finds and qualifies those creators into a
CSV. Together with the `coach_1on1_call_form` in `04-deliver/form-templates`, this
is a working online coach route, which the partner page promises and the 28 videos
do not mention once. It needs either its own module or a decision to leave it out.

**`02-outreach/email-toolkit`.** Frameworks, subject line rules, sequence
templates and swipe files, driven from a one page brief. Extends 5.2, and is
arguably a video of its own.

**`04-deliver/form-templates`.** Six ready Typeform templates. Slots into 7.1
alongside the client onboarding form.

**`04-deliver/reel-editor`.** Strips silences and filler out of a talking video
automatically. Belongs with the student's own credibility work, not with client
delivery.

**`tools/dashboard`.** Settoku OS, a full multi tenant agency dashboard. Far too
big to bolt onto an existing video, and it is not one of the ten line items on the
proposal. Decide whether students are being handed this before writing anything
about it.
