# AIPM Instant Site

A lead gets an email with their business name in it. They click through to a page
that says "here is how your website could look", answer six questions about their
business, and about half a minute later a real, finished website exists for them.
It gets emailed over with a link to a proposal page carrying the price and a pay
button.

Run it on this machine first to see it work. Nothing is deployed and no email
is sent until you put it live, which is the section "Put it live" below.

## Run the demo

```
cd tools/instant-builder
python3 tools/local_server.py
```

Then open the pitch page as a lead would, with their details in the link:

```
http://localhost:4400/?business=Kerrigan%20Roofing&trade=Roofer&town=Stockport
```

Fill the form in. About 30 seconds later their website is live at
`http://localhost:4500/?site=<their-name>`, and the email that would have gone to
them is written to `out/`.

Stop it with ctrl-c.

## The two lanes

Both produce the exact same kind of site through the same template and the same
photos. The only difference is who writes the words, so they can be compared
honestly side by side.

| | Free API lane | Claude Code lane |
|---|---|---|
| Runs through | OmniRoute, free models | `claude -p`, your Max plan |
| Time per site | about 30 seconds | about 8 minutes |
| Cost | nothing | nothing beyond normal plan usage |
| Copy quality | good | noticeably better, more specific |
| Use it for | the live webinar demo | real client work |

The free lane runs automatically when someone submits the form. The Claude lane
is run by hand:

```
python3 builder-lane/build_with_claude.py --answers /tmp/answers.json
```

It writes to a `-claude` slug so you can open both versions next to each other.

## Why the form asks what it asks

Every question is wired to a part of the site. This is the bit worth explaining
on the webinar, because it is why the output does not read like filler.

| What they are asked | Where it shows up |
|---|---|
| What work do you want more of | Which services lead, and the headline |
| What do customers worry about | The FAQ and the guarantee copy answer it directly |
| What do you do better | The founder story and the about page |
| What is holding you back | The hero promise and the why-choose-us list |
| What would change in 90 days | The main call to action and the offers |
| How should it feel | The colours and fonts |

Real example. The owner said customers worry about "cowboys who take a deposit
and disappear". The site came back with the headline "one fixed price in writing"
and the first FAQ reading "Do you take a deposit up front?".

## What it will not do

- **It never invents reviews, ratings, years in business or statistics.** Made-up
  social proof about someone else's business is both dishonest and the fastest
  way to lose the deal when they ask who a testimonial is from. Sites generate
  with no review section rather than a fake one.
- **It refuses to ship a broken site.** Before anything is written out it checks
  for leftover copy from the demo client, wrong-trade language (roofing words on
  a plumber's site), em dashes, en dashes, emoji and missing sections. If any of
  that is present the build stops instead of emailing the lead something wrong.

## How the pieces fit

```
pitch-page/index.html      the page the lead lands on, with the form
pitch-page/proposal.html   price, what is included, and the pay button
generator/                 the free API lane and the email
builder-lane/              the Claude Code lane
preview-app/               a copy of the real website factory template
tools/local_server.py      runs it all locally
out/                       composed emails, nothing sent
```

The clever bit is `preview-app`. It is one copy of your real website template,
changed so it loads its config by name when the page opens. That means a new
client's site is just a saved file: it appears instantly, costs nothing, and
there is no build step that can fail during a live demo. The same config also
feeds the real factory build later, so nothing is throwaway.

## Before this goes anywhere near a real lead

1. **Set the payment link.** `pitch-page/proposal.html`, `CONFIG.payLink`. Blank
   right now, so the button opens an email instead of dead-ending.
2. **Set the agency name** in both pages, `CONFIG.agencyName`.
3. **Turn sending on.** `generator/delivery_email.py`, `SEND_ENABLED`. It is off,
   and the Resend call is not wired up yet, deliberately.
4. **Point the outreach link at the pitch page.** The CRM already appends
   `?business=&trade=&town=` to its outreach link, which is exactly what this
   page reads, so no change is needed in the lead finder repo.

## Put it live (three Vercel projects, then your CRM)

Three small deployments from this folder, then six variables on your CRM. Every
account is free tier. Do them in this order, because each one needs an address
from the one before.

**1. The database.** Use the Supabase project your CRM runs on. Its `schema.sql`
(in the aipm-crm repo) creates the `sites` table the builder writes to and the
read rule the two pages below rely on: the public key can read a site's config
and nothing else. From Project Settings, API copy the Project URL, the anon key
and the service_role key.

**2. The site host: `preview-app`.** Every built site is served from here at
`<address>/?site=<slug>`. Put your Project URL in `src/config/site-loader.js`
(`STORE_URL`) and the anon key in `index.html` (`window.__AIPM_STORE_KEY__`).
Then, from `preview-app`: `npm install`, then `npx vercel deploy --prod`. Note
the address: it is `INSTANT_SITE_URL` on the CRM and `SITE_BASE` on the builder.

**3. The proposal host: `pitch-page`.** Two static files, no build. In
`proposal.html` fill the `CONFIG` block at the top of the script (your business
name, `storeKey` = the anon key, `previewOrigin` = the address from step 2,
`payLink` = your checkout link, `bookingUrl`, `fallbackEmail`, your prices) and
set `STORE_URL` further down to your Project URL. In `index.html` set the
business name and booking link. Then `npx vercel deploy --prod` from
`pitch-page`. Proposals open at `<address>/proposal.html?site=<slug>`; the
address is `INSTANT_PROPOSAL_URL` on the CRM and `PROPOSAL_BASE` on the builder.

**4. The builder: `api-service`.** `npx vercel deploy --prod` from `api-service`,
then set its environment variables in Vercel and redeploy:

| Variable | What it is |
|---|---|
| `BUILD_SECRET` | A long random string. The CRM sends the same value as `INSTANT_BUILD_SECRET`. Without it the builder refuses every call. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | The database from step 1. |
| `GROQ_API_KEY`, `GEMINI_API_KEY` | Free keys that write the site copy. Either works; both is safer. `OPENROUTER_API_KEY` and `MISTRAL_API_KEY` are optional extras it can fall back to. |
| `APIFY_TOKEN` | The Google Maps scrape behind Find. The same key as the lead scraper. `APIFY_TOKEN_2` and up add spares. |
| `SITE_BASE`, `PROPOSAL_BASE` | The addresses from steps 2 and 3. Without them the emails link to hosts that are not yours. |
| `TEMPLATE_BASE` | Where the website templates are served from. The public gallery it defaults to works as it is; deploy `tools/website-templates` yourself to use your own. |
| `AGENCY_NAME`, `SENDER_NAME`, `SENDER_PHONE`, `SENDER_SITE` | How the emails and proposals are signed. |
| `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_REPLY_TO`, `DEMO_SEND_DOMAIN` | The email that carries the finished site and proposal to the lead: your Resend key, the address it comes from, where replies go, and the domain of that address. `RESEND_CAP` is the daily ceiling, 100 unless set. |
| `RESEND_WEBHOOK_SECRET` | Optional. Delivery events from Resend into the `email_events` table through `/api/resend-webhook`. |

The builder's address plus `/api/build`, `/api/scrape` and `/api/settings` are
the CRM's `INSTANT_BUILD_URL`, `INSTANT_SCRAPE_URL` and `INSTANT_SETTINGS_URL`.

**5. Your CRM.** In the aipm-crm project on Vercel set the six variables and
redeploy: `INSTANT_BUILD_URL`, `INSTANT_SCRAPE_URL`, `INSTANT_SETTINGS_URL`,
`INSTANT_BUILD_SECRET`, `INSTANT_SITE_URL`, `INSTANT_PROPOSAL_URL`. Build on any
lead then scrapes their listing, writes the site, stores it, and, when the lead
has an email address and sending is on, emails them the proposal link.

## How the builder is protected

The builder spends free LLM quota and can send email, so it must never be
callable by anyone who finds its address. It fails closed: with no
`BUILD_SECRET` set it refuses every request with a 503 rather than treating a
broken deployment as permission.

The CRM never puts that secret in a page. The CRM's page is served to anyone
who loads it, so it posts to its own `api/instant`, a same-origin endpoint that
checks the login cookie and adds the secret from the CRM's environment. Two
variables, two projects, one value:

    api-service    BUILD_SECRET
    your CRM       INSTANT_BUILD_SECRET

A CRM without them gets a clean "the builder is not configured yet".

## Sending, and warming a new domain

Outreach goes out through a pool of Resend accounts, `RESEND_KEY_1..8` with a
matching `RESEND_FROM_n`. Each build picks whichever account has the most room
left today, counted from our own `emails` table rather than from Resend.

A brand new sending domain has no reputation, and putting a hundred cold emails
a day through one is how a domain gets permanently filtered. That damage cannot
be undone; the domain is spent. So each account may set `RESEND_START_n` to the
date it began sending, and its daily allowance climbs from five to its
`RESEND_CAP_n` over about a fortnight (5 on day one, 16 by day five, 38 by day
nine, full by day fifteen). Leave `RESEND_START_n` unset for an address that
already has history and wants no ramp.

Warming only works if the early sends get opened and replied to, and cold
outreach to strangers is the worst possible traffic for it. Seed the first week
with mail to people who will actually open and reply.

Every send is checked for a mail server first (`hasMailServer`, over
DNS-over-HTTPS). Scraped addresses contain typos and placeholders, three of the
76 recipient domains in the current sheet have nowhere to deliver, and a bounce
rate over roughly 2% will wreck a domain that is still warming. A DNS failure
lets the send through rather than blocking everything.

Open and click tracking are per-domain in Resend and need a CNAME on the
tracking subdomain. Verified by reading a delivered message: from a domain with
the record set, links come through as `https://<tracking-subdomain>/CL0/...`
plus a 1x1 pixel. From a domain without it, links arrive raw and there is no
pixel at all, so nothing is recorded. The outreach email is sent as both HTML
and plain text, so tracking works without changing its plain look.

## Changing how it sends, without code

The CRM's Sent emails tab carries the controls: pause or resume each sending
account, set its daily ceiling, and set the date its warm up started. They save
to `outreach_settings` and the builder reads them on every send, so a pause
takes effect on the next email rather than the next deploy.

The API keys are deliberately NOT editable from the page. They come from the
server environment, and a web page should never be able to set a sending key.

The ceiling is a destination, not a daily target. While `warm_start` is set, the
account climbs from 5 a day to that ceiling over about a fortnight. Clearing the
date sends it straight to the ceiling, which is right for an address with
history behind it and wrong for a new one.

`POST /api/settings` merges with the stored row rather than replacing it. An
upsert replaces, so sending only the field that changed once wiped the others:
pausing an account cleared its warm up date, which would have let it jump from a
ramped handful a day to its full ceiling the moment it was resumed.

## Known limits

- The photo library covers 41 families, plus a neutral `local` set used as the
  fallback. Coverage was measured rather than guessed: all 3,968 categories in
  Google's own business category list were routed through `TRADE_PATTERNS`.

      all 42 niches the scraper sweeps          0 on the fallback
      the 210 leads currently in the sheet      0 on the fallback
      Google's full category list              53% matched to a specific set

  The 47% that land on the neutral set are almost entirely things nobody sells a
  website to: embassies, abbeys, national parks, government offices, and
  industrial B2B supply (bearings, abrasives, dynamometers, oil field
  equipment). For those the neutral set is the right answer, not a wrong
  specific one.

  `tools/routing_traps.py` holds the regression tests for the ordering traps.
  Run it after any change to either pattern list.

  Add a trade by adding an entry to `SETS` in `tools/build_photo_library.py` and
  running `python3 tools/build_photo_library.py --only <name>`. It pulls the 12
  images from Pexels, crops them to the aspects the template wants, and writes
  them to `preview-app/public/trades/<name>/`. Existing images are never
  overwritten without `--force`, and `--slot work/project-3.webp` re-pulls a
  single photo when one search returns something daft.

  Which set a lead gets is decided by `TRADE_PATTERNS`, which exists twice:
  `api-service/api/build.js` and `generator/generate_site.py`. **Change both.**
  Order matters, first match wins, and the comment above each list records the
  traps (garage doors are not cars, "law" matches "lawn", "pet" matches
  "carpet").
- Service areas come from whatever the lead types, so a one-word answer gives a
  thin service-areas section.
- The Claude Code lane takes about 8 minutes, which is too slow to run live on
  stage. Use the free lane for the demo.
