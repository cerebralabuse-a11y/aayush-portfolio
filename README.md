# Aayush Soni · Portfolio

A responsive developer portfolio built with React and Vite, with Supabase Storage, a shared click counter and a private contact inbox.

Home highlights Agentic Pay, AQHigh and APEX GP. All six projects live at `/projects/`, with background details at `/about/`. Four themes, ten accent colors and an IST clock add personality. Appearance preferences stay in the browser.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Fill in `.env.local` with your Supabase project URL and **publishable** key. Never place a secret or service-role key in a `VITE_` variable. Without configuration the site uses bundled images, a clearly labeled session counter and an email link; the contact form stays hidden.

```sh
npm run build
npm test
```

The build produces `dist/client` plus a supporting Sites worker package. A static host needs an SPA rewrite to `index.html` for `/projects/` and `/about/`. Supply both Vite environment variables when building. Repository publication does not deploy the website.

## Supabase setup

Apply `supabase/migrations/20261027083000_portfolio.sql` to a fresh project through the Supabase SQL editor or CLI. It creates:

- A public `portfolio-images` bucket with a 5 MB image limit. Upload the nine files below through the authenticated Storage dashboard. Public users can download, but have no upload/update/delete policy. Bundled cover images remain fallbacks.
- An atomic shared counter exposed through two narrow RPC functions. It counts button presses, not unique visitors or page views. Other open tabs see the latest total on refresh or their next click.
- A private `portfolio_private.messages` table. Visitors can submit through a validated RPC, but cannot read messages or access underlying tables. Read the inbox through the Supabase SQL editor: `select * from portfolio_private.messages order by created_at desc;`. No automatic email notification is configured.

Upload these files from `public/assets/`:

```text
agentic-pay-owner-console.jpg
agentic-pay-owner-console.png
aqhigh-supplied-ui.jpg
aqhigh-supplied-ui.png
apex-gp-race.png
apex-gp-overview.png
hni-wallet-tracker-illustration.jpg
virtual-pet-research.jpg
neural-networks-learning.jpg
```

The message RPC bounds inputs, discards a honeypot, deduplicates retries with a random submission ID, and serializes writes to enforce three messages per email per hour and 100 total per day. These are basic spam controls, not identity verification; add a server-verified CAPTCHA if abuse warrants it. The fun counter is intentionally public and is not an analytics metric. No IP addresses or background visitor analytics are collected.

Supabase's security advisor flags the three publicly executable `SECURITY DEFINER` RPC functions. They are intentionally public: each has a fixed empty search path, qualified table references, no dynamic SQL, and only the specific read-counter, increment-counter or validated message-insert capability. Underlying tables deny direct visitor access. Review those boundaries before expanding the RPCs.

Keep `.env.local`, builds, dependencies and local design/QA material out of commits. Visitors need no login or admin UI.
