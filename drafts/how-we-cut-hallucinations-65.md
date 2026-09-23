# How we cut hallucinations by 65% on a legal knowledge base

<!--
Status: skeleton. This one is about client work, so it needs your details and a
check on what you're allowed to say. Keep it general: no client data, no internal
names beyond what's already public on the portfolio (LexRoss, legal research tool).
Everything in [TODO] is yours to fill; don't publish until each one is real.
-->

## The problem

[TODO: what the tool does in one or two sentences, and what a hallucination looked
like in practice: a made-up case citation? a clause from the wrong document? a
confident answer when nothing relevant existed?]

## How we measured it

This is the paragraph readers will trust or distrust the number by.

[TODO: what "65% fewer" is relative to. How many questions were in the test set,
who labelled them, what counted as a hallucination (unsupported claim? wrong
citation?), and baseline vs after.]

## What changed

The public version of the story, from the portfolio: RAG over PostgreSQL/pgvector,
hybrid dense + sparse search with metadata filtering, 40% lower query latency at
90% relevance. Fill in which of these moved the hallucination number the most:

- [TODO: chunking. How were documents split? By section or clause, fixed size,
  overlap?]
- [TODO: hybrid retrieval. Why dense alone wasn't enough; legal text is full of
  exact terms (statute numbers, party names) that embeddings blur.]
- [TODO: metadata filtering. Jurisdiction, date, document type?]
- [TODO: prompting. Answer only from context, cite sources, refuse when context is
  missing.]
- [TODO: anything that checked answers after generation.]

## What didn't work

[TODO: at least one thing you tried that didn't help. This is what makes the post
credible.]

## What I'd do next

[TODO, or adapt from the improvements on the portfolio's case-study pages:
reranking, a groundedness check per cited sentence, an eval that runs on every
change.]
