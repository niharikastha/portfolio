# Stopping an LLM from inventing facts on my resume

<!-- Status: draft. Based on tailoring/provenance.guard.ts in JobPilot. -->

A tailored resume that adds a skill I don't have is worse than no tailoring at all.
It gets past the filter and then falls apart in the interview. So JobPilot's
tailoring step has one rule: the model can reword and reorder, but it can't add.

"Please don't invent anything" in a prompt isn't enforcement. Here's what is.

## Layer 1: leave nowhere to put an invention

The model doesn't return a resume. It returns a list of `{ atomId, text }` pairs,
rewrites of bullets that already exist, keyed by their ID. There is no field for a
new bullet, so a new bullet can't be expressed. Constraining the output shape
removes a whole class of failure without checking anything.

## Layer 2: check every rewrite against its source

A pure function compares each rewrite with the bullet it came from:

- **Numbers.** If the source says 65% and the rewrite says 85%, it's rejected. Any
  number that isn't supported by the source is rejected.
- **Technologies.** A technology in the rewrite that isn't in the source (checked
  against a tech dictionary) is rejected.
- **Employers.** A changed company name is rejected.

## Fail closed

If any rewrite fails, the whole tailored variant is thrown away and the base resume
is used. Not "drop the bad bullet and keep the rest": a partially trusted resume is
still an untrusted resume. The report is kept even on a pass, so I can see what
was checked.

## What it can't catch

I think this section matters most, so here it is plainly:

- A technology the dictionary has never heard of can slip through.
- Overstatement without numbers, like "led" instead of "contributed to", is
  invisible to it.

That's why a human confirms before anything is submitted. The guard makes the
common failures impossible; the human covers what's left.

[TODO: an example of a rewrite it caught, if you have one from a real run.]
