# Client onboarding form

**Send this only after the client has paid.** It is the one form anybody ever
fills in for you, and it collects everything needed to build their site.

## The rule it exists to protect

We never ask a prospect to fill in a form. A prospect gets a proposal, or a
video, or both, and every one of them pushes to the same thing: book a call.
Asking a busy owner to answer questions before they trust you is how you lose
them.

Once they have paid, the relationship is different. Now they want to give you
information, because they want their site built. That is what this is for.

## Deploy it

Push this folder to Vercel like any other project, then set three environment
variables:

| Variable | What it is |
|---|---|
| `RESEND_API_KEY` | The same Resend key you use for contracts and lead alerts |
| `ONBOARDING_FROM` | A verified sender, for example `You <you@yourdomain.com>` |
| `ONBOARDING_TO` | Where the answers land. Comma separate for more than one |

Send the client the link the day their payment clears, in the same email that
confirms the sale.

## What happens when they submit

You get an email with every answer laid out, with reply-to set to the client so
you can just hit reply. They get a short confirmation so they know it arrived and
stop wondering.

⚠️ If the email to you fails, the client is told plainly and asked to try again.
The form never shows a thank-you page for an intake you did not receive, because
ten minutes of a paying client's work is not something to lose quietly.

## What it asks, and why

- **The basics and what you do.** Services and service areas are required, they
  drive the pages and the local SEO.
- **Their customers.** What work they want more of, what customers worry about,
  what they do better than competitors. These four answers do more for the copy
  than anything else on the form, because they are what the site argues.
- **How it should feel.** Years trading, team size, price position, vibe, and
  sites they like. The reference links save you a rebuild.
- **Photos, logo and proof.** A file-sharing link is easiest. Real photos of
  finished jobs beat stock every time.
- **Accounts.** Domain, Google Business Profile, and their Google review link.
  The review link is what every finished customer gets sent, so you need it
  before the review engine can run.
- **Where leads go.** The email addresses that get an alert the second an enquiry
  lands. This feeds straight into `tools/website-template/api/lead.mjs`.

⚠️ Never invent a review, a rating, a year founded, or an accreditation. If they
leave it blank, ask, or leave it off the site.
