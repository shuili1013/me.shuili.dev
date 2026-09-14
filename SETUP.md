# Setup — Sanity CMS + Cloudflare Pages

The site is a statically-exported Next.js app. All content lives in **Sanity**
and is edited in the Studio embedded at **`/edit`** (https://me.shuili.dev/edit):

- **網站設定** — site title, title template, description, favicon; navbar
  (logo text, menu items, language/theme toggles); footer copyright and social
  links (preset or uploaded icons); every UI string on the site.
- **個人資料** — home page heading, tags, intro, email, bio, résumé, skills,
  experience.
- **文章** — blog posts (title, summary, tags, cover, 3D model, body).

Every text field has an English and a 中文 version. Blank Site-settings fields
fall back to the built-in defaults (`src/sanity/placeholder.ts`,
`src/i18n/dictionaries/*.json`).

On publish, a webhook triggers a Cloudflare Pages rebuild, so the live site
updates in ~1–2 minutes.

> Until a Sanity project is configured, the site renders built-in placeholder
> content (so `npm run dev` works out of the box).

## 1. Create the Sanity project (you)

```bash
npx sanity@latest login          # browser auth
npx sanity@latest init --env     # creates a project, writes projectId/dataset
```

Or create it at https://sanity.io/manage. Note the **projectId** and use dataset
`production`. In the project settings, set the dataset to **public** (read), and
under **API → CORS origins** add, each with **Allow credentials** checked:

- `http://localhost:3000`
- `http://localhost:3333`
- `https://me.shuili.dev`

Without "Allow credentials" you can't log in to the Studio at `/edit`.

## 2. Configure env

Copy `.env.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_STUDIO_PROJECT_ID=xxxxxxx     # same id; read by `npm run studio`
SANITY_STUDIO_DATASET=production
SANITY_WRITE_TOKEN=...   # API → Tokens → Editor (only for seeding)
```

## 3. Seed initial content (one-time)

```bash
npm run seed
```

Creates Site settings, Profile and two sample posts filled with the site's
current defaults, so every Studio field starts populated. Documents that already
exist are skipped, so re-running it never overwrites your edits.

## 4. Edit content

Open https://me.shuili.dev/edit (or http://localhost:3000/edit with
`npm run dev`) and log in with your Sanity account. Studio UI language can be
switched between 繁體中文 and English from the user menu.

Embed a **3D model** block in a post body and upload a `.glb`, or set the post's
3D model field.

## 5. Deploy the site to Cloudflare Pages

- Push this repo to GitHub, then in Cloudflare → **Pages → Create → connect repo**.
- Build command: `npm run build` · Output dir: `out`.
- Add env vars (`NEXT_PUBLIC_SANITY_*` as above, plus `NODE_VERSION=22`).
- `public/_redirects` handles `/` → `/en/` and serves the Studio for every
  `/edit/*` URL.

## 6. Auto-rebuild on publish

- Cloudflare Pages → Settings → **Deploy hooks** → create one, copy the URL.
- Sanity → **API → Webhooks** → add webhook → paste the URL, trigger on
  create/update/delete, dataset `production`. Now publishing in the Studio
  rebuilds the site automatically.

## Local development

```bash
npm run dev        # site at http://localhost:3000, Studio at /edit
npm run studio     # standalone Studio at http://localhost:3333/edit
npm run typecheck  # tsc --noEmit
```
