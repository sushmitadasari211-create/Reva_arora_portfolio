# HybridSearch AI — Semantic + Lexical Product Search Engine

**SPLADE + BGE-Large + Qdrant + Reciprocal Rank Fusion over Amazon ESCI**

A live, fully interactive, single-file browser demo that shows *why* hybrid search
(dense + sparse + Reciprocal Rank Fusion) beats either method alone — and lets you
prove it yourself by typing queries and dragging a slider.

Open `hybridsearch.html` in any modern browser (Chrome recommended). No install,
no server, no API key — everything runs client-side in plain HTML/CSS/JavaScript,
with Chart.js and Prism.js pulled in from a free public CDN purely for the bar
chart and code syntax highlighting.

---

## What it demonstrates

Standard e-commerce search breaks in two opposite directions:

1. **Keyword/sparse search (BM25/SPLADE)** — finds exact matches ("Sony WH-1000XM5")
   but fails on semantic queries ("wireless headphones for focus") and synonyms.
2. **Dense/semantic search (BGE-Large)** — understands meaning and intent, but
   fails on exact product codes, SKUs, and brand names.
3. **Hybrid search (Reciprocal Rank Fusion)** — combines both. In production
   systems (Qdrant, Pinecone, Amazon, and others), this typically improves
   nDCG@10 by ~15–20% over either method alone.

The app makes that difference **visible** with three side-by-side result
columns (Dense / Sparse / Hybrid), live evaluation metrics, a step-by-step RRF
visualizer, and an alpha slider that lets you watch the hybrid ranking
re-fuse in real time.

## Try these 5 built-in scenarios

Click any of the pill buttons under the search bar, or type these exactly:

| Query | What it proves |
|---|---|
| `wireless noise cancelling headphones` | Dense excels — pure semantic intent |
| `WH-1000XM5 Sony headphones` | Sparse excels — Sony ranks #1 sparse, #3 dense, **#1 hybrid** |
| `shoes for runners with flat feet` | Dense excels — "flat feet" never appears in any listing |
| `budget coffee maker under $50` | Hybrid excels — price constraint + semantic intent |
| `USB-C laptop 16GB 512GB SSD` | Sparse excels — exact spec matching beats generic semantic similarity |

You can also type any free-text query; the app falls back to a deterministic
keyword + pseudo-embedding scorer so results are never empty, though the five
scenarios above are the hand-tuned "textbook" examples.

## Tabs

- **🔎 Search** — the main interactive demo (3-column results, metrics, query
  analysis, RRF step visualizer).
- **📊 Benchmarks** — a Chart.js grouped bar chart comparing Dense/Sparse/Hybrid
  nDCG@10 across 5 query archetypes.
- **🐍 Python Implementation** — 5 real, copy-pasteable code sections: Qdrant
  hybrid collection setup, SPLADE encoding, BGE-Large encoding, the RRF
  `query_points` call, and nDCG/MRR evaluation code.
- **🏗️ System Architecture** — a CSS flow diagram of the full pipeline.
- **📱 LinkedIn Carousel** — 6 ready-to-screenshot slides for a LinkedIn post.

## Tech notes

- Single self-contained HTML file — no build step, no framework.
- All "search results" are pre-scripted (for the 5 scenarios) or computed with
  simple deterministic JS math (for free-text queries) — nothing is a real ML
  model. This is a **simulation** built to visualize how a real BGE-Large +
  SPLADE + Qdrant + RRF stack behaves, not a live inference engine.
- RRF formula used: `score(d) = (1-α)·1/(k+rank_dense) + α·1/(k+rank_sparse)`,
  with `k = 2` and `α` controlled by the slider (α=0 → dense-only weighting,
  α=1 → sparse-only weighting, α=0.5 → balanced).

---

## LinkedIn strategy

**Goal:** position this as a portfolio piece that proves hands-on understanding
of production hybrid-search architecture (the kind of system used at Qdrant,
Pinecone, and major e-commerce search teams) — not just "I used an LLM."

### Posting plan

1. **Post the 6-slide carousel** (from the "LinkedIn Carousel" tab — screenshot
   each slide) as the primary post. Carousels get more dwell time and reach on
   LinkedIn than a single image or plain text post.
2. **Use the caption embedded at the very top of `hybridsearch.html`** (as an
   HTML comment) as your post copy — it's already written and ready to paste.
3. **Link the live demo** in the first comment (LinkedIn's algorithm
   deprioritizes posts with outbound links in the body text) or use the "your
   link here" placeholder in slide 6 if you host it somewhere shareable.
4. **Ask a genuine question** in the closing line ("What's your current search
   stack?") — posts that end with a question get meaningfully more comments,
   and comments are the strongest reach signal on LinkedIn.
5. **Reply to every comment** in the first 60–90 minutes after posting — early
   engagement velocity is what LinkedIn's ranking rewards most.
6. **Tag relevant hashtags sparingly** (3–5, already included in slide 6):
   `#VectorSearch #HybridSearch #Qdrant #SPLADE #BGE #NLP #MachineLearning #DataScience #AI`
7. **Follow up a few days later** with a short "here's what people asked me"
   post if the first one gets traction — this is a proven way to get a second
   wave of reach out of one project.

### Where to host the live link (optional, when you're ready)

`hybridsearch.html` is a single static file, so it can be hosted for free on
GitHub Pages, Netlify, or Vercel with zero backend — just drag-and-drop the
file. That step is optional and not required to post the carousel itself.
