---
layout: ../../layouts/MarkdownPostLayout.astro
title: "The power of an abstraction"
pubDate: 2016-11-08
tags: ["abstraction", "dev"]
---

I see a lot of code bases getting into a mess through an inappropriate use of abstraction. Like many things in the Software Engineering industry, it is a tool which is in wide-spread use, learned from poor examples and not particularly well understood.

For me, the best definition of an abstraction, and I apologise for not crediting whoever coined this phrase (_it may well have been me in my yuff :-) but I am pretty sure I read it somewhere_):

> an abstraction is a name that allows you to more meaningfully and accurately discuss something

That's it. A simple name. Although, if you have been around long enough you will realise that naming things is actually really hard.

Implicit in the above statement is the notion that an abstraction is a composite of detail. The abstraction is synonymous with all of the rules, behaviours, properties, interactions, lifecycles etc. of the thing it represents.

How does this differ from 'mere' categorisation? For me (which is my way of saying I am probably wrong), categorisation is a function of what you can see and touch _now_. Abstraction is about identifying a new _thing_. Categorisation is about things as they are, abstraction is about what might be.

Another perspective is that an abstraction is a citizen of the _ubiquitous language_.

## What is an abstraction not?

An abstraction is not simply the normalising of characteristics or properties. 'Everything to do with validation becomes IAmValidatable' is too blunt a hammer.

Also, abstraction is not everything represented by an Interface or protocol. Every abstraction doesn't require an Interface or protocol, some abstractions might not even be mentioned in your code (although if they aren't in the model itself then I might start asking questions).

By definitions, good abstractions aren't ambiguous. They mean one thing and only one thing.

## What does an abstraction buy us?

A well-formed abstraction is worth its weight in gold. A poor abstraction is less than worthless - it will almost certain lead to ambiguity and miscommunication down the line. The benefits:

- clarity and richness in the ubiquitous language
- reduction of ambiguity when talking about the abstraction
- reduction in the amount of detail needed when talking about what the abstraction represents

As you can see, abstractions are all about communication.

## A good name for an abstraction?

I kid you not when I tell you that the best name for an abstraction may well be 'wibble' or 'bloobies' or 'gwenters'. What is this language I am using? What secret sauce have I drunk? Aren't they all meaningless?

Yes. Absolutely. That is the point!

If I am trying to convey some complex information to you, and I can't quite put my finger on it but both you and I recognise the shape of it, the _worst_ thing we could do is come up with a label that implies more than we mean. In those situations yes, I have talked about 'wibbles' to a client. And yes, they also thought I was nuts until I explained the problem.

Later on, when the abstraction became clearer we came up with a wonderful abstraction - it was clear, concise, normalised (in that it didn't mean anything else) and was _slightly_ different to what we had been discussing earlier.

Some good examples of abstractions you might run into?

- transaction: clearly defined boundaries and semantics and represents something real and useful
- sequence: a small, well defined concept and is realised by many things (lists, vectors, dictionaries etc.)
- session: similar to transaction

The list is almost endless. The more you look the more you see abstractions.

## A bad name for an abstraction

The worst example of an abstraction (by which I mean an insufficiency in its value as a means of communication) I have seen is in the Healthcare Environment. 'Patient', as you might expect, is used a lot. The problem is that it has different and distinct _meanings_ in different contexts. The abstraction 'patient' means:

- a body: a set of demographics who the Healthcare system interacts with
- an appointment: "which patients do you have? I have a 10:30 and a 12:30"
- composite: the composite of appointments that a single 'body' has had

Now, careful! I am not saying that different perspectives of a domain concept is a bad thing. DDD absolutely advocates this. This isn't that. This is an example where the same term represents distinct concepts. Person and Appointment, or maybe Interaction would be better names. The Appointment/Interaction would have a link to Person, but they are clearly different things.

For clarity, DDD suggests that different bounded contexts will care about different aspects of the same thing. So accounting might care about the costs associated with the previous interactions of a Person and only require their unique identifier. The medical team might only care about the previous interactions to identify drug dependencies etc. They are all different parts of the same thing.

## Aren't abstractions all wishy washy and result in levels of indirection?

No, abstractions don't _have_ to be ephemeral. They _absolutely are **not**_ simply a level of indirection. If anything, an abstraction removes levels of (conceptual) indirection by bringing some notion closer to you.

That said, there is sometimes a gap between the concrete and the correct configuration of an abstraction. Consider a request for datasetX. If the server has a model of datasetX then there is no distance. However, if the server uses abstractions of 'data points' and 'relations' and 'criteria', and datasetX is a configuration of those abstractions wired together then yes, that is distance. But it _isn't_ distance between the concrete and the abstraction, it is the _configuration_ of the abstraction that represents the concrete.

## Great, so I can create abstractions

Of course you can, and almost certainly you already have. However, be ruthless. Ensure that at all times everybody has the same understanding of an abstraction otherwise it is worse than useless. Does it matter if everybody has the _wrong_ understanding? Of course, but consistency and clarity are the objective here, not licensing the semantic police to be pains in the backsides.

## Hang on, isn't this really about the ubiquitous language

Yes, it is really. The main point is that the name you come up with has to be part of the ubiquitous language and therefore inherits all the benefits. In 6 months time you may not know _why_ those 6 different rules are applicable here. If you realise it is because they are relevant for a 'Highly interactive customer' then it all makes sense (where 'Highly interactive customer' is the abstraction).

## Parting words

In summary, an abstraction is not a programming construct, it is a thinking and communicating construct. It is a citizen of the ubiquitous domain whose only purpose is to clarify meaning. An ambiguous abstraction is dangerous.
