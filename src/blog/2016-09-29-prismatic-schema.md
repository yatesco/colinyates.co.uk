---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Deprecated warnings from plumatic schema"
pubDate: 2016-09-29
tags: ["clojure", "clojurescript", "cljs", "prismatic", "plumatic", "schema"]
---

If you aren't already using [plumatic's schema](https://github.com/plumatic/schema) then I **strongly** recommend you do.

_(when did they stop being 'Prismatic' and become 'Plumatic'? Oh well)_

The reason why will have to be another blog post, this is simply to say that is you are using `both` or `either` then you will get a bunch of `deprecated` warnings.

The simple, not really thinking about it solution is to use `constrained` instead of `both` and `conditional` instead of `either`.

Examples:

```clojure
(s/both [s/Int] (s/pred seq))
=>
(s/constrained seq [s/Int])
```

and

```clojure
(def ToggleA {:toggle (s/eq :a) :value s/Int})
(def ToggleB {:toggle (s/eq :b) :other-field s/Int})
(s/either ToggleA ToggleB)
=>
(s/conditional #(= :a (:toggle %)) ToggleA #(= :b (:toggle %)) ToggleB)
=>
(s/conditional #(= :a (:toggle %)) ToggleA :else ToggleB)
```

Hope that helps.
