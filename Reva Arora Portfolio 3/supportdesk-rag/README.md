# SupportDesk-RAG — Production IT Support RAG System

A single-file, browser-only demo of a **production-pattern Retrieval-Augmented Generation (RAG) system** built for enterprise IT support. No backend, no API keys, no build step — open `supportdesk_rag.html` in Chrome and it just works, using pre-loaded mock ticket/documentation data to simulate a real retrieval + generation pipeline.

## The problem

Enterprise IT support teams deal with:
- Repetitive questions ("How do I reset VPN?", "Where's the proxy config?")
- Knowledge scattered across Confluence, Slack, and old tickets
- New hires who can't find answers, and senior engineers who burn out repeating themselves
- Traditional keyword search that fails on semantic queries

## The approach

SupportDesk-RAG demonstrates the pattern I'd actually ship for this, not a toy chatbot:

- **5 LlamaIndex retrieval strategies** running in parallel — Vector, Keyword, Hybrid (Reciprocal Rank Fusion), Tree, and Summary indices — because different question types need different retrieval shapes.
- **A LangChain LCEL pipeline** — retrieve → rerank → generate → verify — with multi-turn memory.
- **A hard anti-hallucination guard**: the LLM may only answer from retrieved context. Every claim needs a citation; unsupported claims fail the guard and the query is either regenerated or escalated.
- **Two-layer evaluation**: retrieval quality (Precision@K, Mean Reciprocal Rank) *and* generation quality (RAGAS-style faithfulness, answer relevance, hallucination rate), plus a human-eval rubric.
- **Confidence-gated human handoff**: if retrieval precision drops below 0.5, the system tells the user honestly and routes to a human instead of guessing.

## What's in the app

- Live (mocked) chat interface with 3 pre-loaded example queries and confidence-scored, cited answers
- Expandable source citations with similarity scores
- Thumbs up/down feedback
- An interactive 7-step RAG pipeline explainer (click any step for technical detail)
- A right-hand evaluation dashboard (Chart.js): retrieval precision by index, MRR, hallucination rate, citation coverage, helpful/not-helpful donut chart
- An A/B toggle comparing a plain base model vs. the RAG system
- Four code tabs (Python multi-index setup, LangChain LCEL pipeline, evaluation harness, LangGraph agentic RAG with memory + human-in-the-loop), all with copy buttons
- A "Carousel Slides" tab with 6 ready-to-post LinkedIn slides

## Files

| File | Purpose |
|---|---|
| `supportdesk_rag.html` | The full application — everything is in this one file |
| `index.html` | Minimal portfolio landing page linking to the app |
| `README.md` | This file |

## Running it

No installation needed. Just open `supportdesk_rag.html` in a modern browser (Chrome recommended). All libraries (Tailwind, Chart.js, Prism.js) load from CDN; everything else is plain HTML/CSS/JavaScript.

## LinkedIn strategy

The HTML file has a ready-to-copy LinkedIn caption embedded as a comment at the very top of `supportdesk_rag.html`. Suggested posting approach:

1. **Post the caption** from the top of the file as your main post text — it leads with the hallucination problem, which is the most relatable pain point for anyone who's used a RAG demo.
2. **Attach the 6 carousel slides** from the "Carousel Slides" tab as a LinkedIn document/carousel post (screenshot each slide at 1:1, or recreate them as a PDF/PPT using the same content).
3. **Drive engagement** with the question baked into slide 6: *"what's your RAG hallucination rate?"* — this is a good comment-bait question for other ML/AI practitioners.
4. **Link back** to a hosted version of the app (e.g., GitHub Pages) or the GitHub repo itself so people can interact with the live demo, not just look at screenshots.
5. **Tag relevant hashtags**: `#RAG #AI #MachineLearning #DataScience #LangChain #LlamaIndex`
6. Best posting days for technical content are generally Tuesday–Thursday mornings (recruiter/engineer scrolling window) — consider scheduling around that if timing flexibility exists.

## Notes

- All ticket data, metrics, and evaluation numbers are simulated for demonstration purposes — this is a portfolio piece showing RAG architecture and UX patterns, not a live production system connected to a real ticket database.
