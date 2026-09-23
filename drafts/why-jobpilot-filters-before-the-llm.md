# Why my job-search agent throws away 90% of postings before the LLM sees them

<!-- Status: draft. Every fact below comes from the JobPilot code; the [TODO]s need your numbers. -->

Every morning at 6, JobPilot pulls open postings from six hiring platforms. On a
typical day there are around 16,500 of them. By 9 I get a digest with a handful
worth my time.

The obvious way to build this is to hand every posting to an LLM and ask "is this a
good fit?" I didn't, and the reasons turned out to be more about design than cost.

## Most postings aren't a judgement call

A senior staff role asking for 12 years, a job in a city I can't work from, a
posting from three months ago, one I've already applied to. None of these need a
model. They need an `if`.

So stage one is a plain function with no I/O: title rules, dealbreakers, years of
experience, location and remote eligibility, freshness, already-applied. It's free,
it's deterministic, and it drops about 90% of postings.

The part I'd recommend to anyone building a funnel like this: **every rejection
gets a named reason.** The screen produces a histogram, not just a count, so when
the digest feels thin I can see which rule is doing the work instead of guessing.

It has a known flaw I've left visible: title rules match substrings, so excluding
"intern" also excludes "internal tools engineer". [TODO: have you fixed this, or
decided it's worth it?]

## Similarity is a budget, not a verdict

What survives goes through local embeddings (bge-small, 384 dimensions, running
in-process, so free) and pgvector. It's tempting to treat a high cosine score as
"good match". It isn't. Topical overlap is not fit: a posting can be about exactly
my stack and still be wrong for me.

So the vector stage decides only one thing: which 60 postings are worth a model
call. It's a spend cap with an ordering.

## Then the model, and the right one

Scoring those 60 is high-volume rubric classification. That's Claude Haiku, at
about a fifth of the price of the larger model. At this volume that's the
difference between a daily run I can leave on and one I'd eventually switch off.
My resume and preferences are identical for every call, so they sit at the front
of the prompt and are cached.

Tailoring a resume is different. There are about 15 a day, and an overstated
resume can cost me an application. That's where Opus is worth paying for.

## Keeping the digest worth reading

WEAK and REJECT never make it into the digest. A digest full of noise trains you to
ignore it, and then it's useless even on the days it has something good.

Pay works the same way, on purpose asymmetrically: a stated salary below my floor
rejects, an AI estimate below it doesn't, and unknown pay passes. Structured salary
appears on only about 0.3% of Indian postings, so being strict about estimates
would throw out almost everything.

## What I'd tell someone building one

1. Put the cheapest check first and give every rejection a reason.
2. Use embeddings to decide what to spend on, not what's true.
3. Pick the model per step. Classification and writing are different jobs.
4. Design the output for the person reading it every morning.

[TODO: one real number from your own use, e.g. how many digest items you applied
to in a month, or how much a daily run costs.]
