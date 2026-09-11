# Little Sign website

Public companion site for the Little Sign app, served by GitHub Pages:

| Route | Page |
| --- | --- |
| `/` | Account deletion (email code verification, then explicit confirmation; bilingual toggle) |
| `/privacy/`, `/zh/privacy/` | Privacy policy (English / 简体中文) |
| `/terms/`, `/zh/terms/` | Terms of service |
| `/support/`, `/zh/support/` | Support |

The site is a static [Next.js](https://nextjs.org) export (`output: 'export'`). There is no
server: the deletion page talks to Supabase Auth and the `delete-account` edge function
directly from the browser using the project's **public** URL and anon key. Never put a
service-role key or any other secret in this project.

The app itself, its Supabase functions and the product documentation live in the main
`little_sign` repository. See its `doc/Account-Deletion.md` and `doc/Store-Website.md`
for the deletion backend, Google Play requirements, and the content review checklist.

## Develop

Requires Node 22.13 or newer.

```sh
npm ci
cp .env.example .env.local   # fill in the public Supabase URL and anon key
npm run dev                  # http://localhost:3000
```

Checks, in the same order the deploy workflow runs them:

```sh
npm run typecheck
npm run lint
npm run build                # writes the static site to out/
```

To preview the exported site exactly as GitHub Pages serves it (under the repo base path):

```sh
NEXT_PUBLIC_BASE_PATH=/little_sign-site npm run build
npx serve out -l 3000        # then open http://localhost:3000/little_sign-site/
```

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which typechecks, lints, builds and
publishes `out/` to GitHub Pages at <https://minggamecn.github.io/little_sign-site/>.

One-time repository setup:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Settings → Secrets and variables → Actions → Variables**: add
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the same public values
   the app uses. They are compiled into the browser bundle by design. Until they are set, the
   deletion form shows "not available yet" and the policy pages still work.

### Custom domain

If the site later moves to a custom domain served from `/`, remove `NEXT_PUBLIC_BASE_PATH`
from the workflow, add a `public/CNAME` file, and update `origin` in `lib/site-config.ts`
(it drives canonical and language-alternate links).

## Before publishing the policies

`lib/site-config.ts` still has blank `operatorName`, `supportEmail` and `effectiveDate`. While
any of them is empty the policy pages show a draft notice and ask search engines not to index
them. Fill them in, review `app/policy-content.tsx` in both languages, and confirm provider
retention arrangements before submitting the URLs to Play Console.
