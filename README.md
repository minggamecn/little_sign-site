# Little Sign website

Public companion site for the Little Sign app, served by GitHub Pages:

| Route | Page |
| --- | --- |
| `/` | Account deletion request (email instructions with a prefilled `mailto:` link; bilingual toggle) |
| `/privacy/`, `/zh/privacy/` | Privacy policy (English / 简体中文) |
| `/terms/`, `/zh/terms/` | Terms of service |
| `/support/`, `/zh/support/` | Support |

The site is a static [Next.js](https://nextjs.org) export (`output: 'export'`). It has no
backend and calls no external service: the deletion page only opens the visitor's email app
with a prefilled request to the support inbox. Real, immediate deletion lives in the app
(Settings → Delete my account). Never put a Supabase key or any other secret in this project.

The app itself, its Supabase functions and the product documentation live in the main
`little_sign` repository. See its `doc/Account-Deletion.md` and `doc/Store-Website.md`
for the deletion backend, the manual request process, Google Play requirements, and the
content review checklist.

## Handling deletion requests

Requests arrive at the support inbox configured in `lib/site-config.ts`. The page and the
policies promise completion within `deletionResponseDays` days of a verifiable request:

1. Confirm the message was sent from the account's own email address. Never delete based on
   an address supplied in the message body alone, and never ask for a code or password.
2. Delete the Supabase Auth user (the database trigger removes the account's quota records).
3. Reply to confirm completion. The reply is the user's only receipt; no server record is kept.

## Develop

Requires Node 22.13 or newer.

```sh
npm ci
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
Pages must be set to **Settings → Pages → Source: GitHub Actions** (already done). No build
variables are needed.

### Custom domain

If the site later moves to a custom domain served from `/`, remove `NEXT_PUBLIC_BASE_PATH`
from the workflow, add a `public/CNAME` file, and update `origin` in `lib/site-config.ts`
(it drives canonical and language-alternate links).

## Before publishing the policies

`lib/site-config.ts` still has a blank `operatorName` and `effectiveDate`. While either is
empty the policy pages show a draft notice and ask search engines not to index them. Fill them
in, review `app/policy-content.tsx` in both languages, and confirm provider retention
arrangements before submitting the URLs to Play Console.

Regenerate `package-lock.json` with `npx npm@10 install --package-lock-only`: npm 11 writes
optional platform entries without versions, which makes `npm ci` fail on the Linux runner.
