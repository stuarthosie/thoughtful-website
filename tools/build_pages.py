#!/usr/bin/env python3
"""Rebuild the four service pages from the home page.

Run from the repository root after editing index.html:

    python3 tools/build_pages.py

The header, footer, enquiry form and project write-ups are copied from
index.html, so they only ever need changing in one place. The wording that
is particular to each service page lives in PAGES below.
"""
import re, os

SITE = "https://thoughtfulconstruction.co.uk"
home = open("index.html").read()

def between(a, b, text=home):
    i = text.index(a); j = text.index(b, i) + len(b)
    return text[i:j]

head_links = between('<link rel="icon" href="/favicon.ico"', '<link rel="stylesheet" href="/style.css">')
header = between('<header class="top">', '</header>')
footer = between('<footer>', '</footer>')
enquire = between('<section class="enquire" id="enquire">', '</section>')
places = between('<ul class="places">', '</ul>')
projects = open("tools/projects.html").read()
jobs = ['<section class="job"' + part.split('</section>')[0] + '</section>'
        for part in projects.split('<section class="job"')[1:]]
JOB = {"treehouse": jobs[0], "bathroom": jobs[1], "deck": jobs[2], "groundworks": jobs[3]}
cards = re.findall(r'<article>.*?</article>', projects + home, flags=re.S)
def card(label):
    hits = [c for c in cards if label in c]
    assert len(hits) == 1, label
    return hits[0]

# On a service page the section links point back to the home page.
def local(html):
    html = html.replace('href="#top"', 'href="/"')
    return re.sub(r'href="#(?!enquire)', 'href="/#', html)

PAGES = [
 dict(slug="new-builds-and-renovation", type="New build or extension",
  title="New builds and renovation in Fowey and south Cornwall",
  desc="Timber-frame new builds and whole-house renovation around Fowey, including listed and period buildings. Designed and built by one team.",
  label="New builds and renovation", h1="New builds and whole-house renovation around Fowey.",
  lede="We design and build timber-frame buildings from the foundations up, and renovate period and listed houses from the floor structure to the finishes. One team runs the job from the first drawing to handover.",
  img=("tree-10.jpg", 1600, 1200, "Inside the Treehouse near Fowey, a timber-frame cabin designed and built by Thoughtful"),
  cap="The Treehouse, near Fowey",
  h2="What we take on", intro="Complete buildings and complete renovations, including the design.",
  ticks=[("Design and build", "We draw up straightforward projects ourselves. On complex ones we work in partnership with your architect and engineer, or bring in ones we trust."),
         ("New timber-frame buildings", "Foundations, frame, insulation, roof and cladding, with the interior fitted out by the same team."),
         ("Whole-house renovation", "Floors and structure repaired, rooms replanned, kitchens and bathrooms rebuilt."),
         ("Listed and period buildings", "We have worked on listed buildings. Changes that affect a listed building's character need consent before work starts, and we plan for that with you from the first visit."),
         ("Kitchens and cabinetry", "Made in birch plywood in our own workshop, to fit the room."),
         ("Consents set out at the start", "We tell you at the site visit what needs planning permission, Building Regulations approval or an engineer, and the quote says who deals with each.")],
  jobs=["treehouse"], cards=["Original floors"]),
 dict(slug="bathrooms", type="Bathroom",
  title="Bathroom renovation in Fowey and south Cornwall",
  desc="Bathrooms rebuilt from the joists up around Fowey: natural stone, microcement, walk-in showers and wet underfloor heating, in period and listed homes.",
  label="Bathrooms", h1="Bathrooms rebuilt properly, from the joists up.",
  lede="A good bathroom depends on what's underneath it. We strip the room back, put right the floor and the pipework, and finish in natural stone or microcement, with wet underfloor heating if you want it.",
  img=("bath-22.jpg", 1024, 768, "Finished bathroom in a period townhouse: walk-in shower with glass screen and brass rain head, stone floor, sash window"),
  cap="Bathroom, period townhouse, Bath",
  h2="What goes into one", intro="The parts you see, and the parts under the floor that decide how long it lasts.",
  ticks=[("The floor put right first", "Rotten joists and boards replaced, the rest strengthened and levelled before anything is tiled."),
         ("Drainage that works", "Wastes re-routed with proper falls. Where the old layout relied on a macerator, we run a new gravity waste to the soil pipe if the building allows it."),
         ("Walk-in showers", "Glass screens and concealed valves, with the pipework hidden in new stud walls."),
         ("Underfloor heating under stone", "Wet underfloor heating beneath natural stone, laid on a decoupling membrane."),
         ("Microcement", "Walls, showers and sunken baths finished in one continuous surface."),
         ("Certified electrics", "Electrical work is done by a registered electrician, and you get the certificate.")],
  jobs=["bathroom"], cards=["Microcement bathroom"]),
 dict(slug="decks-and-garden-rooms", type="Deck or garden room",
  title="Decks and garden rooms in Fowey and south Cornwall",
  desc="Raised timber decks on sloping gardens, balustrades, steps and insulated garden rooms around Fowey, built by Thoughtful Construction.",
  label="Decks and garden rooms", h1="Raised decks and garden rooms for sloping Cornish gardens.",
  lede="Most gardens round the estuary fall away from the house. We build raised decks that carry the floor level out towards the view, and garden rooms that are insulated, lined and lit for use all year.",
  img=("deck-14.jpg", 1024, 768, "Finished raised timber deck with balustrade, standing on posts beside a white rendered house in Fowey"),
  cap="Raised deck, Fowey",
  h2="What we build", intro="Timber structures outside the house, built to stand on a slope and in sea air.",
  ticks=[("Raised decks on slopes", "Posts on concrete pad footings and a braced frame beneath, with the deck level with your doors."),
         ("Balustrades and steps", "Newel posts, rails and steps made on site to suit the house."),
         ("Garden rooms", "Built new or fitted out: rigid insulation, a taped vapour layer, ply lining, flooring and lighting."),
         ("Planning checked first", "A deck more than 30cm above the ground needs planning permission. On a slope that is most of them, so we check before we quote."),
         ("One-off joinery", "Loft ladders, doors and fitted pieces made in our own workshop.")],
  jobs=["deck"], cards=["Garden room fit-out"]),
 dict(slug="groundworks-and-drainage", type="Groundworks or drainage",
  title="Groundworks and drainage in Fowey and south Cornwall",
  desc="Gabion and concrete retaining walls, sewage treatment plants, drainage and foundations on steep and awkward plots around Fowey.",
  label="Groundworks and drainage", h1="Retaining walls, drainage and treatment plants on steep plots.",
  lede="Before anything can be built on a slope, the ground has to be held back and the water dealt with. We run groundworks from the first cut to the finished wall, on sites a lorry can't easily reach.",
  img=("ground-06.jpg", 480, 360, "Finished tiered gabion retaining wall on a wooded slope near Fowey"),
  cap="Gabion retaining wall, near Fowey",
  h2="What we take on", intro="The work in the ground that everything else depends on.",
  ticks=[("Retaining walls", "Tiered gabion walls and shuttered reinforced concrete."),
         ("Sewage treatment plants", "Installed on a concrete base, with the pipe runs to and from them."),
         ("Regulations planned in", "New treatment plants need Building Regulations approval and have to meet the general binding rules for small sewage discharges. Both are priced in from the start."),
         ("Foundations and bases", "Pier foundations, bases and footings for timber-frame buildings."),
         ("Chambers and drainage runs", "Precast chamber rings set and pipe runs laid to fall."),
         ("Tight access", "Mini digger work on slopes, and concrete placed where a lorry can't reach easily.")],
  jobs=["groundworks"], cards=[]),
]

def esc(t): return t.replace("&", "&amp;")

urls = [SITE + "/"]
for P in PAGES:
    url = "%s/%s/" % (SITE, P["slug"]); urls.append(url)
    f, w, h, alt = P["img"]
    ticks = "\n".join('      <li><b>%s</b><span>%s</span></li>' % t for t in P["ticks"])
    more = ""
    if P["cards"]:
        more = ('<section class="small">\n  <div class="wrap">\n    <h2>Related work</h2>\n    <div class="small-grid">\n      '
                + "\n      ".join(card(c) for c in P["cards"]) + '\n    </div>\n  </div>\n</section>\n')
    form = enquire.replace('<form id="enq" novalidate>', '<form id="enq" novalidate data-type="%s">' % P["type"])
    assert form != enquire
    html = f'''<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(P["title"])} | Thoughtful Construction</title>
<meta name="description" content="{esc(P["desc"])}">
<meta property="og:title" content="{esc(P["title"])}">
<meta property="og:description" content="{esc(P["desc"])}">
<meta property="og:image" content="{SITE}/img/{f}">
<meta property="og:type" content="website">
<meta property="og:url" content="{url}">
<link rel="canonical" href="{url}">
{head_links}
</head>
<body>
{local(header)}

<main id="top">
<section class="hero">
  <div class="wrap">
    <p class="label crumb"><a href="/">Thoughtful</a><span>{esc(P["label"])}</span></p>
    <h1>{P["h1"]}</h1>
    <div class="sub">
      <p class="lede">{P["lede"]}</p>
      <div class="actions"><a class="btn" href="#enquire">Tell us about your project</a><a class="btn ghost" href="tel:+447933005029">Call 07933 005029</a></div>
    </div>
    <figure{' class="small"' if w < 1000 else ''}>
      <img src="/img/{f}" width="{w}" height="{h}" alt="{alt}">
      <figcaption>{P["cap"]}, built by Thoughtful</figcaption>
    </figure>
  </div>
</section>

<section class="plain">
  <div class="wrap two">
    <div class="stack">
      <p class="label">{esc(P["label"])}</p>
      <h2>{P["h2"]}</h2>
      <p>{P["intro"]}</p>
      <div class="stack" style="margin-top:14px;gap:.7rem">
        <span class="label">Where we work</span>
        {places}
      </div>
      <p><a href="/#process">How a job runs, from first message to handover</a></p>
    </div>
    <ul class="ticks">
{ticks}
    </ul>
  </div>
</section>

{chr(10).join(local(JOB[j]) for j in P["jobs"])}
{local(more)}
{local(form)}
</main>

{local(footer)}
<script src="/site.js"></script>
</body>
</html>
'''
    os.makedirs(P["slug"], exist_ok=True)
    open(P["slug"] + "/index.html", "w").write(html)
    print("wrote", P["slug"] + "/index.html")

open("sitemap.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + "".join("  <url><loc>%s</loc></url>\n" % u for u in urls) + "</urlset>\n")
open("robots.txt", "w").write("User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n" % SITE)
