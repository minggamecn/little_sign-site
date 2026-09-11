# Little Sign website

Public companion site for the Little Sign app, served by GitHub Pages at
<https://minggamecn.github.io/little_sign-site/>. Plain HTML and CSS, no build step, no
JavaScript framework, no external services.

| Route | Page |
| --- | --- |
| `/`, `/zh/` | Account deletion request (email instructions with a prefilled `mailto:` link) |
| `/privacy/`, `/zh/privacy/` | Privacy policy (English / 简体中文) |
| `/terms/`, `/zh/terms/` | Terms of service |
| `/support/`, `/zh/support/` | Support |

The deletion page only opens the visitor's email app with a prefilled request to the support
inbox. Real, immediate deletion lives in the app (Settings → Delete my account). Never put a
Supabase key or any other secret in this project.

The app itself, its Supabase functions and the product documentation live in the main
`little_sign` repository. See its `doc/Account-Deletion.md` and `doc/Store-Website.md` for the
deletion backend, the manual request process, Google Play requirements, and the content review
checklist.

## Handling deletion requests

Requests arrive at the support inbox shown on the page (ming.life@foxmail.com). The page and the
policies promise completion within 5 days of a verifiable request:

1. Confirm the message was sent from the account's own email address. Never delete based on an
   address supplied in the message body alone, and never ask for a code or password.
2. Delete the Supabase Auth user (the database trigger removes the account's quota records).
3. Reply to confirm completion. The reply is the user's only receipt; no server record is kept.

## Editing

Each page is a self-contained HTML file; `styles.css` and `icon.svg` are shared. Every page
exists once per language, so edit both the English file and its `zh/` counterpart, and keep the
`<link rel="alternate" hreflang=…>` pairs pointing at each other. Links between pages are
relative, so the site works under the repository path and under a custom domain alike. The
`404.html` page uses absolute `/little_sign-site/` paths because GitHub serves it from any URL.

The support address and the 5-day window appear in the request pages and in the privacy and
support pages of both languages. Search for `ming.life@foxmail.com` and `5 days` / `5 天` when
changing either.

Preview locally with any static server, for example:

```sh
python3 -m http.server 3000     # http://localhost:3000/
```

Reading the site in a browser is the whole check; there is nothing to compile or lint.

## Deploy

GitHub Pages serves the `main` branch root directly (**Settings → Pages → Source: Deploy from a
branch**). Every push is live within about a minute. The `.nojekyll` file keeps GitHub from
running the Jekyll processor.

### Custom domain

To serve from a custom domain at `/`, add a `CNAME` file with the domain, update the canonical
and alternate `<link>` URLs in every page, and change the absolute paths in `404.html`.

## Before publishing the policies

The operator name and effective date are still blank. Each policy page carries a visible draft
notice and a `noindex` robots tag with a comment marking it. Fill in the operator name, set the
effective date, delete the notice and the tag in all six policy files, and confirm provider
retention arrangements before submitting the URLs to Play Console.
