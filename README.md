# Little Sign website

Public companion site for the Little Sign app, served by GitHub Pages at
<https://minggamecn.github.io/little_sign-site/>. Plain HTML and CSS: no build step, no
JavaScript framework, no external services, nothing to install.

| Route | Page |
| --- | --- |
| `/`, `/zh/` | Homepage: app introduction and links to every companion page |
| `/delete-account/`, `/zh/delete-account/` | Account deletion request (email instructions with a prefilled `mailto:` link) |
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

## Files

```
index.html            Homepage, English (redirects Chinese-language browsers to zh/)
zh/index.html         Homepage, 简体中文
delete-account/      Account deletion request, English
zh/delete-account/   Account deletion request, 简体中文
assets/star.jpg       Original Star card artwork from the app
privacy/  terms/  support/         English policy pages (one index.html each)
zh/privacy/  zh/terms/  zh/support/  Chinese policy pages
styles.css            Shared stylesheet
icon.svg              Favicon
404.html              Bilingual not-found page (served by GitHub for any unknown URL)
.nojekyll             Tells GitHub Pages to serve the files as they are
```

## Handling deletion requests

Requests arrive at the support inbox shown on the page (ming.life@foxmail.com). The page and the
policies promise completion within 5 days of a verifiable request:

1. Confirm the message was sent from the account's own email address. Never delete based on an
   address supplied in the message body alone, and never ask for a code or password.
2. Delete the Supabase Auth user (the database trigger removes the account's quota records).
3. Reply to confirm completion. The reply is the user's only receipt; no server record is kept.

## Editing

Each page is a self-contained HTML file. Every page exists once per language, so edit both the
English file and its `zh/` counterpart, and keep the `<link rel="alternate" hreflang=…>` pairs
pointing at each other. Header, navigation and footer are repeated in every file; a navigation
change means the same small edit in all ten content pages.

Links between pages are relative, so the site works under the repository path and under a
custom domain alike. `404.html` is the exception: GitHub serves it from any URL, so it uses
absolute `/little_sign-site/` paths.

The English root page contains a three-line script that sends Chinese-language browsers to
`zh/`. The "English" link on the Chinese page carries `?lang=en`, which the script honours, so
a visitor can always switch back. English home links also carry `?lang=en`;
Chinese pages link back to the Chinese homepage. Other routes stay in the language selected. Delete the script if you prefer no automatic redirect.

The support address and the 5-day window appear in the request pages and in the privacy and
support pages of both languages. Search for `ming.life@foxmail.com` and `5 days` / `5 天` when
changing either.

Preview locally with any static server, for example:

```sh
python3 -m http.server 3000     # http://localhost:3000/
```

There is nothing to compile or lint. Check local links and anchors, language switches,
and navigation under the `/little_sign-site/` path. When reviewing layout, check a desktop
and narrow mobile viewport, plus enlarged text. Policy pages use a sticky contents sidebar
on desktop and a single column on mobile; the support email appears before the contents.
The 404 page must be previewed under `/little_sign-site/` because its links are absolute.

## Deploy

GitHub Pages serves the `main` branch root directly (**Settings → Pages → Source: Deploy from a
branch**, branch `main`, folder `/`). Every push is live within about a minute; the run appears
under the repository's Actions tab as "pages build and deployment".

### Custom domain

To serve from a custom domain at `/`, add a `CNAME` file containing the domain, update the
canonical and alternate `<link>` URLs at the top of every page, and change the absolute paths in
`404.html`.

## Before publishing the policies

The privacy policy and terms still need an operator name and effective date. Those four
pages are marked as drafts; both support pages retain a review notice and `noindex` until
the policy review is complete. The displayed update date is separate from the effective date. To finish them:

1. Replace `[Operator name — to be added]` in the English privacy and terms pages and
   `[运营者名称 — 待填写]` in the Chinese ones with the operator name used on the store listing.
   The support pages do not name the operator.
2. Add the effective date next to the "Last updated" / "更新日期" line in the privacy and terms pages.
3. Delete the `<aside class="draft-notice">` block and the `<meta name="robots" content="noindex,
   follow">` tag (marked with a comment) from all six policy files.
4. Confirm the provider retention wording against the actual Supabase and DeepSeek arrangements.

Then enter the privacy and deletion URLs in Play Console. Use
`https://minggamecn.github.io/little_sign-site/delete-account/` for account deletion
(or `/zh/delete-account/` for Chinese). The former deletion URLs `/` and `/zh/`
now show the homepage with a clearly labeled deletion link. Update any store
listing or app configuration that should open the deletion instructions directly.
