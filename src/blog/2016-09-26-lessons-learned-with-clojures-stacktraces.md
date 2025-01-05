---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Lessons learned with Clojure's StackTraces"
pubDate: 2016-09-26
tags: ["clojure", "dev"]
---

## A hard day

I learned the following lessons today:

- Simplest is best
- Evaluate your assumptions
- Sometimes development is just **hard**

In a nutshell, our production app records UI errors and submits them to the server where they are pushed to the `error-handler`. Similarly, if an Exception is raised server side it is also pushed to the `error-handler`. However, the errors that had been captured were all ridiculously long stack traces with no references to any of my code.

It was clear that rendering (either printing out or serialising to EDN) was causing something to blow its stack, however the call-site just wasn't there!

The top of the stack trace:

```java
java.lang.StackOverflowError: null
 at java.util.regex.Pattern$GroupHead.match(Pattern.java:4658)
 at java.util.regex.Pattern$Branch.match(Pattern.java:4604)
 at java.util.regex.Pattern$Branch.match(Pattern.java:4602)
 at java.util.regex.Pattern$BranchConn.match(Pattern.java:4568)
 at java.util.regex.Pattern$GroupTail.match(Pattern.java:4717)
 at java.util.regex.Pattern$Curly.match0(Pattern.java:4279)
 at java.util.regex.Pattern$Curly.match(Pattern.java:4234)
 at java.util.regex.Pattern$GroupHead.match(Pattern.java:4658)
 at java.util.regex.Pattern$Branch.match(Pattern.java:4604)
 at java.util.regex.Pattern$Branch.match(Pattern.java:4602)
 at java.util.regex.Pattern$BmpCharProperty.match(Pattern.java:3798)
 at java.util.regex.Pattern$Start.match(Pattern.java:3461)
 at java.util.regex.Matcher.search(Matcher.java:1248)
 at java.util.regex.Matcher.find(Matcher.java:664)
 at java.util.Formatter.parse(Formatter.java:2549)
 at java.util.Formatter.format(Formatter.java:2501)
 at java.util.Formatter.format(Formatter.java:2455)
 at java.lang.String.format(String.java:2940)
 at clojure.core$format.invokeStatic(core.clj:5533)
 at clojure.core$print_tagged_object.invokeStatic(core_print.clj:106)
 at clojure.core$print_object.invokeStatic(core_print.clj:110)
 at clojure.core$fn__6044.invokeStatic(core_print.clj:113)
 at clojure.core$fn__6044.invoke(core_print.clj:113)
 at clojure.lang.MultiFn.invoke(MultiFn.java:233)
 at clojure.core$pr_on.invokeStatic(core.clj:3572)
 at clojure.core$pr_on.invoke(core.clj:3566)
 at clojure.core$print_map$fn__6094.invoke(core_print.clj:212)
 at clojure.core$print_sequential.invokeStatic(core_print.clj:59)
 at clojure.core$print_map.invokeStatic(core_print.clj:208)
 at clojure.core$fn__6097.invokeStatic(core_print.clj:217)
 at clojure.core$fn__6097.invoke(core_print.clj:217)
 at clojure.lang.MultiFn.invoke(MultiFn.java:233)
```

(\_spot the repetition?\_)

The bottom of the stack trace:

```java
...
 at clojure.core$pr.invoke(core.clj:3575)
 at clojure.lang.AFn.applyToHelper(AFn.java:154)
 at clojure.lang.RestFn.applyTo(RestFn.java:132)
 at clojure.core$apply.invokeStatic(core.clj:646)
 at clojure.core$pr_str.invokeStatic(core.clj:4580)
 at clojure.core$pr_str.doInvoke(core.clj:4580)
 at clojure.lang.RestFn.invoke(RestFn.java:408)
 at cider.nrepl.print_method$eval53163$fn__53164.invoke(print_method.clj:35)
 at clojure.lang.MultiFn.invoke(MultiFn.java:233)
 at
...
```

> that ellipsis is actually in the stack trace itself, which is a big clue that it isn't complete

Like all good engineers, after some navel gazing and talking to the duck I decided to call for [help](https://groups.google.com/d/topic/clojure/H4s5a6enftA/discussion).

The great part was that I couldn't reproduce it locally....except I remember in the dim and distant past I saw a very similar stack trace when deploying the application with `DEBUG` logging. I recall that it was wrapped up with the excellent [component](https://github.com/stuartsierra/component) library, specifically during instantiation.

So, two different effects, onto the cause...

### A minor diversion

I had been meaning to rethink the `component` library due to two major pain-points:

- if a component crashes then it typically kills your system so a `(reset)` is necessary
- sometimes `(reset)` doesn't work, particularly if you have `protocols` hanging around

And a third minor point - I felt that the component library wasn't great when you had sub-systems. Ideally I would want to include my sub-system component (map) into an outer map but there was no support for nesting. The best you could do was lexical scoping, e.g. `{:inner/a ....}` which would be referenced by the outer system map.

And for completeness, I didn't actually have that much state but I did have an awful lot of `services`, each of which was defined as a record.

Ultimately, I decided that a simply `start` method which explicitly started the system in the correct order was sufficient.

A few hours hackery later and there was no sign of the `component` library, and instead of 100s of lines of boilerplate spread out of a number of `.system.clj` files I had a single `system.clj` file complete with type safe dependency injection.

I was very pleasantly surprised at how much complexity it removed - the most dangerous sort of complexity that sneaks in sideways so it never feels painful at any one time, but looking at the system as a whole you realise how much complexity there is.

Oh, and `(reset)` works fine now and if one of the services fails then no-worries, it all just works :-).

Anyway, back to the cause of the humongous stack trace.

## Stack traces

At first I was stumped as to what could be causing it. Thanks to two very friendly fellow Clojure devs I realised that actually what I was seeing was an incomplete picture, specifically I wasn't seeing the entire <span class="underline">depth</span> of the tree (thanks Ragnar Dahlen).

And indeed, Java has a `MaxJavaStackTraceDepth` property which dictates how many stack frames to include in a stack trace and is set to 1024 by default.

Unfortunately setting this to a larger value, or actually `-1` which disables the threshold didn't make any difference. Mainly because I couldn't reproduce it in the first place! But even if it did I wouldn't have been satisfied - it was simply pushing the problem further away, not removing it.

Thinking it through a bit more I realised that the `error-handler` serialises the entire state of the system and reports that alongside the error. Now, this <span class="underline">should</span> be safe to do so as there is very little cached on the server. However, the UI `error-handler` pushes its state to the server, and the UI state can be potentially huge...

So, a similar stack trace when serialising huge data structures in the `error-handler` and a huge stack trace when starting the `component system`. I see a theme....

And yep, tracing through the (now discarded) `component tree` I could see that in `DEBUG` mode I am mindlessly printing out something that could be unbounded.

The actual part of the code, if you are still reading :-), was in the `message handler` which contains a list of 'message handlers.' The `message handler` expects the handlers to be:

```clojure
(defprotocol IHandleMessages
  (id [this])
  (can-handle? [this message])
  (handle-message [this message opts]))
```

and when a `handler` was registered the `message handler` would `DEBUG` the `handler`. Changing that `DEBUG` to `(api/id handler)` should be sufficient.

Again though, without being able to reproduce this it was all just a best-guess.

## On a better note

[Spacemacs'](http://spacemacs.org) ability to convert the result of a `helm grep` into an editable buffer which you can then edit made removing the many `[com.stuartsierra.component :as component]` trivial :-). Gotta love spacemacs and [helm](https://tuhdo.github.io/helm-intro.html).

Oh, and [Cursive](https://cursive-ide.com)'s excellent 'unused' code detection is worth its weight in gold.

## Conclusion

So what have I learnt?

- sometimes you don't need to follow the herd, and even simple libraries can cause incidental complexity
- if you are seeing a nonsensical stack trace then no, Clojure isn't stupid, something else is getting involved
- not being able to reproduce a problem in production is terrifying
- consider whether your collaborator can be unbounded before mindlessly rendering it to the console or EDN

I wonder what joys tomorrow will bring...
