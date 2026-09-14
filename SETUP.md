# Setup — Sanity CMS + Cloudflare Pages

The site is a statically-exported Next.js app. All content (profile, experience,
skills, tags, socials, blog posts, 3D models, images) lives in **Sanity** and is
editable in Sanity Studio. On publish, a webhook triggers a Cloudflare Pages
rebuild, so the live site updates in ~1–2 minutes.

> Until a Sanity project is configured, the site renders built-in placeholder
> content (so `npm run dev` works out of the box).

## 1. Create the Sanity project (you)

```bash
npx sanity@latest login          # browser auth
npx sanity@latest init --env     # creates a project, writes projectId/dataset
```

Or create it at https://sanity.io/manage. Note the **projectId** and use dataset
`production`. In the project settings, set the dataset to **public** (read), and
add `http://localhost:3000`, `http://localhost:3333` and your Cloudflare domain
under **API → CORS origins**.

## 2. Configure env

Copy `.env.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_WRITE_TOKEN=...   # API → Tokens → Editor (only for seeding)
```

## 3. Seed initial content (one-time)

```bash
npm run seed
```

Creates the Profile singleton + two sample posts so the Studio isn't empty.

## 4. Edit content

```bash
npm run studio       # local Studio at http://localhost:3333
npm run studio:deploy   # deploy to https://<projectId>.sanity.studio
```

Edit Profile and Posts; embed a **3D model** block in a post body and upload a
`.glb`. Add a **cover** image per post.

## 5. Deploy the site to Cloudflare Pages

- Push this repo to GitHub, then in Cloudflare → **Pages → Create → connect repo**.
- Build command: `npm run build` · Output dir: `out`.
- Add env vars (same `NEXT_PUBLIC_SANITY_*` as above) in the Pages project.
- `/` → `/en/` is handled by `public/_redirects`.

## 6. Auto-rebuild on publish

- Cloudflare Pages → Settings → **Deploy hooks** → create one, copy the URL.
- Sanity → **API → Webhooks** → add webhook → paste the URL, trigger on
  create/update/delete, dataset `production`. Now publishing in the Studio
  rebuilds the site automatically.

## Local development

```bash
npm run dev        # site at http://localhost:3000 (reads Sanity at build/runtime)
npm run studio     # CMS at http://localhost:3333
npm run typecheck  # tsc --noEmit
```
