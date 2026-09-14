# Setup — Sanity CMS + Cloudflare Pages

The site is a statically-exported Next.js app. All content lives in **Sanity**
and is edited in the Studio embedded at **`/edit`** (https://me.shuili.dev/edit):

- **網站設定** — site title, title template, description, favicon; navbar
  (logo text, menu items, language/theme toggles); footer copyright and social
  links (preset or uploaded icons); every UI string on the site.
- **個人資料** — home page heading, tags, intro, email, bio, résumé, skills,
  experience.
- **文章** — blog posts (title, summary, tags, cover, 3D model, body).

Every text field has an English and a 中文 version. **Content left blank is not
shown** — there is no placeholder content. Only interface strings (section
headings, "View all", aria labels…) have built-in defaults in
`src/i18n/dictionaries/*.json`, overridable under 網站設定 → 介面文字.

Changes appear on the site only after you **Publish** (drafts are not read) and
the site rebuilds (~1–2 minutes, triggered by the webhook in step 5).

## 1. Create the Sanity project (you)

```bash
npx sanity@latest login          # browser auth
npx sanity@latest init --env     # creates a project, writes projectId/dataset
```

Or create it at https://sanity.io/manage. Note the **projectId** and use dataset
`production`. In the project settings, set the dataset to **public** (read), and
register the Studio: open https://me.shuili.dev/edit and choose **Register this
studio** (use **Add development host** for `http://localhost:3000`).

## 2. Configure env

Copy `.env.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_STUDIO_PROJECT_ID=xxxxxxx     # same id; read by `npm run studio`
SANITY_STUDIO_DATASET=production
```

## 3. Edit content

Open https://me.shuili.dev/edit (or http://localhost:3000/edit with
`npm run dev`) and log in with your Sanity account. Studio UI language can be
switched between 繁體中文 and English from the user menu.

Social links accept a URL (`https://…`) or a plain email address, which becomes
a `mailto:` link. Embed a **3D model** block in a post body and upload a `.glb`,
or set the post's 3D model field.

## 4. Deploy the site to Cloudflare Pages

- Push this repo to GitHub, then in Cloudflare → **Pages → Create → connect repo**.
- Build command: `npm run build` · Output dir: `out`.
- Add env vars (`NEXT_PUBLIC_SANITY_*` as above, plus `NODE_VERSION=22`).
- `public/_redirects` handles `/` → `/en/` and serves the Studio for every
  `/edit/*` URL.

## 5. Auto-rebuild on publish

- Cloudflare Pages → Settings → Build → **Deploy hooks** → create one (branch
  `main`), copy the URL.
- Sanity → **API → Webhooks** → add webhook → paste the URL, dataset
  `production`, trigger on create/update/delete, filter
  `_type in ["siteSettings", "profile", "post"]`, drafts **off**. Now publishing
  in the Studio rebuilds the site automatically.

## Local development

```bash
npm run dev        # site at http://localhost:3000, Studio at /edit
npm run studio     # standalone Studio at http://localhost:3333/edit
npm run typecheck  # tsc --noEmit
```
