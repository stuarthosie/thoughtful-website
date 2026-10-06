# thoughtfulconstruction.co.uk

The Thoughtful Construction & Groundworks website.

- `index.html` is the home page. `style.css` and `site.js` are shared by every page. Photos are in `img/`.
- The four service pages (`bathrooms/`, `new-builds-and-renovation/`, `decks-and-garden-rooms/`, `groundworks-and-drainage/`) are generated from the home page. After editing `index.html`, run `python3 tools/build_pages.py` to refresh them. The wording particular to each service page is at the top of that script.

Cloudflare Pages publishes whatever is on the `main` branch. No build step; the output folder is the repository root.

The phone number, email and Instagram name appear in the header, footer and enquiry section of `index.html`, and on the line starting `var CONTACT =` in `site.js`.
