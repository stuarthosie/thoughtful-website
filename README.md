# thoughtfulconstruction.co.uk

The Thoughtful Construction & Groundworks website.

- `index.html` is the home page. `style.css` and `site.js` are shared by every page. Photos are in `img/`.
- The four service pages (`bathrooms/`, `new-builds-and-renovation/`, `decks-and-garden-rooms/`, `groundworks-and-drainage/`) are generated from the home page and `tools/projects.html`, which holds the full project write-ups. After editing either, run `python3 tools/build_pages.py` to refresh them. The wording particular to each service page is at the top of that script.

Cloudflare Pages publishes whatever is on the `main` branch. No build step; the output folder is the repository root.

The phone number, email and Instagram name appear in the header, footer and enquiry section of `index.html`, and on the line starting `var CONTACT =` in `site.js`.

## Client reviews

The home page has a "What clients say" section (`id="reviews"`), laid out as Google-style review cards. It is copied by hand from the Google Business Profile and is not a live feed, so the score, count, names and stars must be kept the same as Google shows. It shows names, dates and stars only; the review wording is left on Google because the site does not name individuals in the firm. The comment above the section in `index.html` explains how to add a review or switch the section off. The review link for clients is https://g.page/r/CZiv4HWzdBLGEBM/review.
