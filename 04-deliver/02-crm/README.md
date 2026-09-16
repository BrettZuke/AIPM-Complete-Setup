# 02. The CRM and power dialler

**What the client is paying for:** somewhere every lead and customer lives, so
nothing gets forgotten. Value on the proposal: $1,500.

**Where the system lives:** the aipm-crm repo, next to this one on GitHub. This
repo no longer carries a copy; `tools/crm` only points there.

## Two ways to use it

**Most clients:** you run the CRM, they get the leads by email and Slack. Simpler
for them, and it keeps you in the loop.

**Clients with a sales team:** give them their own login so they can work the
pipeline themselves.

## What you do

1. Clone aipm-crm and, from its `dashboard` folder, run `node setup.mjs`. It
   asks for two free tokens (Supabase and Vercel), makes the database, deploys,
   and prints the address with a one-time setup code.
2. Open that address. The first visit makes the owner login.
3. Connect sending: Settings, You (your name and a sending address on a domain
   verified in Resend). `dashboard/README.md` there covers replies, Gmail
   through Make, the assistant and the site builder.
4. Point the scraper at it: `CRM_URL` and `CRM_KEY` (Settings, Developer) in
   `tools/lead-scraper/.env`. Every scrape then lands in the CRM.
5. For a client with a sales team: Settings, Team invites them, or run them a
   copy of their own under their accounts.

## You MUST customise

- Settings, You: the name, sending address, phone and video link on every
  email the CRM sends
- A copy per client. `setup.mjs` generates fresh secrets each time; never reuse
  a database or a login across clients
- The Google Sheet is optional now (`google-sheet/SETUP.md` in that repo), and
  if you use one its password must match on the scraper and the CRM

## The power dialler

Runs through the user's own phone with a `tel:` link, so there is nothing to set
up and nothing billed. Arrow keys move down the list, and every call outcome is
logged.

⚠️ **Environment changes only take effect on a new deployment.** Change a variable
then redeploy, or nothing happens.
