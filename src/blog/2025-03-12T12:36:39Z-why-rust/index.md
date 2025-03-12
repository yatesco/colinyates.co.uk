---
layout: ../../layouts/MarkdownPostLayout.astro
title: Why Rust?
pubDate: 2025-03-12T12:36:39Z
tags:
  - rust
  - java
---

# What's this now?

Somebody asked me a while ago "Why Rust?" and I brain-dumped this stream-of-consciousness. Somebody else asked me today "why Rust?" so I thought I'd surface this.

> this is a few years old now, but I don't think anything has necessarily changed.
# Context

I lead a small development team for a company called QFI Consulting Ltd
(previously LLP). We are a management company who specialise in applying the
Theory of Constraints (TOC) to healthcare. QFI utilise a suite of software
called Pride and Joy.

My role is to bring Software Engineering to the Theory of Constraints and
provide software that does a range of functions:

- providing a "front line" tool which the nurses and doctors use to decide
  which patient to see next
- a user friendly Dashboard that allows the executive to see the short term
  demand on resources
- a analysis tool deeply based on the TOC theory allowing QFI and the client to
  identify short, medium, and long term analysis of the system as a whole

This is a role full of ambiguity, where the software often needs to handle two
conflicting paradigms at the same time (i.e. the client's local-optima based
paradigm and the TOC system's based/patient led paradigm).

# Concerns

My primary concern is delivering the right software quickly, and safely. The
lifetime of our software is both very long lived (the core is a Clojure based
engine that hasn't really changed for over 10 years), and very short
lived/incremental, as we identify the appropriate "thin layer" which bridges the
core and the client.

## Ambiguity

The biggest "day to day" challenge we face with the client is that they don't
really understand their own environment, and we regularly face:

- them: this behaves like X then Y
- us: always and forever?
- them: absolutely
- us: ....
- them: no, for realz
- us: ...iterate a solution with them...
- them: perfect!
- real life: this is great, except for ....
- them: oopsie, our bed

So refactoring, delivering prototypes quickly, productionising prototypes, are
all very important. Moving from a prototype to production means that our
prototypes have to be productionised within days. Our change process is:

- Customer or QFI analyst says "we need X"
- QFI apply TOC rigour to determine if it is valid
- Software Leadership (myself and the partners) discuss
- Prototype/iterate internally
- Prototype/iterate with the client
- Deliver

## Speed of delivery

And we move _fast_. The productivity of a highly skilled, small team is
phenomenal, and I'm very proud of the speed and rigour we've achieved.
Frequently, major software releases take 2 to 3 weeks, with the customer
feedback saying they expected/were quoted 6 months (where we replace an existing
feature in other software into Pride and Joy).

This mandates that we use our time efficiently, which is a key factor in
choosing Rust/JVM/go etc.

## Constraints

IT systems in Healthcare, throughout the world in our experience, are chaotic,
vastly underpowered, and full of bureaucracy. Our target platform is a single
(typically virtual) machine with 4 CPU (we usually get 2) and 16GB of ram
running Windows Server, a separate MSSQL server, and a separate integration
server which allows Pride and Joy to integrate with their existing PAS systems
over HL7 for example.

This means no Docker, Kubernetes, no "big" software like Kafka, Message Queues,
etc. _Everything_ is pretty much hand written.

# Technological landscape

At the moment we have:

- a single event log which underpins the entire architecture. _Every_ state
  change is captured as a Command and Event(s) pair. (Healthcare requires
  absolute knowledge)
- Clojure based TOC engine which underpins the main software suite
- ClojureScript based UI for the main application
- Clojure/ClojureScript based main analysis tool
- Rust "feeder" from the event stream -> analysis database
- Rust based Dashboard with Typescript/antd based UI
- Rust based internationalisation service
- Rust based authentication service
- A bunch of other rust services which do some pretty narly and commercially
  sensitive analysis
- Pre Sales tool based on TypeScript/Clojure
- and so on, and so on

# Technology review

## Clojure/ClojureScript

Clojure and ClojureScript as a full stack solution is a dream. For getting new
stuff done it is unparalleled. Development time is quick, no nasty JSON to worry
about (EDN is great), and runtime is fast enough/can be tweaked as appropriate.

The problem is tomorrow, or next month, or 6 months time when the lack of types
_really_ bites.

I genuinely do not understand how people manage large projects in Clojure
without getting bogged down in a gazillion tests to enforce the shape of data at
every step. We use Schema religiously, and it isn't enough.

## Go

No

## Java

I spent my first few decades with Java, I get it's limitations, but _getting
things up and running_ is seamless. Maven is a work of art, IntelliJ is "chef's
kiss", the type system is pretty weak but sufficient, there tends to be one way
to do things. Yes, it hogs memory (although GraalVM goes a long way to solving
that), but it is actually pretty quick at runtime.

Immutables/lombok/Apache or Guava's immutable collections etc. all go a long way
to solving the paper cuts.

The landscape is _vast_ and well proven.

It's the boring, but reliable, predictable, and sufficient answer to most server
side things. The move to microservices (e.g. micronaut, quarkus, helidon,
graalvm) etc. is interesting, but I suspect most people move from a monolith to
a distributed monolith :-).

Mutable-first, and `null` are painful, and multithreaded code is very risky,
but I know how to deal with that.

It's the safe choice as I can understand the code somebody wrote years ago.

## Kotlin

I dunno - it's just never appealed to me. I don't like the aesthetics of the
language, and it's immutability story isn't really there. I _should_ love it,
integration with the JVM landscape is seamless, syntax is succinct...I just
don't.

People love it, I don't get it.

Gradle is a monstrosity and should be burned.

## Scala

Love it. At least, I want to love it. FP on the JVM? I'm here for that.
Except...it all just seems a bit too bewildering. I need to pick things up and
run with it really quickly, and Cats/ZIO, whilst I appreciate the threory, just
never quite click.

It seems a never ending game of "hunt the missing implicit". Still, it's quick
to build, runtime is fast enough, incredibly robust and safe because Monads.

Recruiting for Scala? Not a chance.

I'm sure if I gave myself a solid month I'd get it, but I
just don't have that luxury, but even sticking to the new Scala 3 syntax, it's
easy enough to write code that looks like the cat threw up.

Immaturity of libraries _really_ hurts here as not all of them have adopted
Scala 3 yet.

## Rust

_On paper_, Rust feels like "just enough Scala FP" with "easy of Java's
mutability". I _adore_ the mutable/immutable split. It's seamless, it's elegant,
it's incredibly trivial to model.

I've written reams of Rust code in production, and I love it. Refactoring is
incredibly safe. The compiler is a better developer than I am, cargo is just
perfection.

It really does feel like a well designed development environment that addresses
the paper cuts of others.

But, it has significant drawbacks:

- lacks Java's APIs so each library implements things differently. tiberius,
  sqlx, sqldb all have bits I want but can't use
- async is nasty. There, I've said it. It's the leakiest abstraction ever
  designed. I did understand how the async logic actually works once, but I
  confess I've forgotten the mechanics now, but from a "consumer" it is brutal.

  I frequently find myself making previous non-async code async and then having
  to chase the call stack adding in asyncs. It all just feels like I'm adding
  syntax for the compiler.

  I'm almost tempted to just always use async, for convenience, which must
  signal something has gone wrong.

- lifetimes. I get them, I understand them, but frequently I run into something
  that stumps me in my tracks
- From/Into traits = brilliance and also the worst of Scala's implicits
- managing versions in a large workspace is painful. Why can't we do maven's
  "properties from parent pom"? It's the ideal solution to define versions in
  the workspace/Cargo.toml rather than workspace/libA/Cargo.toml. My workspace
  has about 25 crates. It's painful. **(solved in 2025 with Cargo workspaces version inheritence)**
- implementing multiple "impl X for struct" - would be nice if this could be
  done in a single impl block, ala Clojure's defrecord and proxying syntax.

I also find myself wondering if I'm still influenced by Java's OOP model as I
find myself often using traits as interfaces purely so I can unit test them,
which requires a lot of syntax and feels unnatural. I wonder if TDD is as
prevalent in Rust circles as I'm naturally inclined to do.

Hiring is also a nonstarter.

# Conclusion

I don't have one. I am literally staying awake at night tossing and turning
between Java's "boring but reliable" and Rust's "perfection then immense pain".

- I need to move fast. Rust allows me to build software really quickly and
  refactor safely. But I often need to do more glue, and the pain points, when
  you hit them are _painful_.
- Refactoring: Rust is great for this _except_ for the "now become async".
- Landscape: JVM wins hands down. Apache POI is hideous but it's literally
  better than nothing, which is what Rust offers
- picking code up from last year: unfair to Rust because it is still maturing
  so I'd say they are equal

TLDR: Rust achieves _most_ of its promise that "it is great, and could be the
one", but those surprises can hurt. Java promises adequacy, predictability, and
sufficiency, but it's not exciting _at all_.

I hope this helps - it is "stream of conscious" and I haven't proofread it, so
_please_ feel free to come back with anything.
