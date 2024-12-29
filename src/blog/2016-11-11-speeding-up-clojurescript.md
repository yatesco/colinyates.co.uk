---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Adding go-faster stripes to ClojureScript compilation"
pubDate: 2016-11-11
tags: ["dev", "tip", "clojurescript", "cljs", "cljsbuild"]
---

If you are using [ClojureScript](https://github.com/clojure/clojurescript) (and if not, why not? :-)) then I **strongly** recommend you enable [parallel build](https://github.com/clojure/clojurescript/wiki/Compiler-Options#parallel-build).

I mistakenly thought this meant that it would run separate _builds_ in parallel, but no, it is far cleverer and more useful than that, it builds a single build in parallel.

(_Also, to be crystal clear, this isn't going to do anything to your \_runtime_ performance, only the _build_ time.\_)

## Awesome sauce - speed me up!

It is as simple as adding it to your `compiler` options in your `cljsbuild` config:

```clojure
:cljsbuild {:test-commands
              ;; Test command for running the unit tests in "test-cljs" (see below).
              ;; $ lein cljsbuild test
              ;; NOTE: this does not call health/bootstrap as that causes errors, hence cljs-dev and cljs-prod
              {"unit" ["phantomjs"
                       "phantom/unit-test.js"
                       "resources/private/html/unit-test.html"]}
              :builds
              {:test {:source-paths ["src/clj" "src/clj-prod" "src/cljc" "src/cljs" "src/cljs-prod"]
                      :compiler     {:parallel-build true
                                     :output-to      "resources/private/js/unit-test.js"
                                     :output-dir     "resources/private/js/out"
                                     :optimizations  :whitespace
                                     :pretty-print   true}}
               :dev  {:source-paths ["src/clj" "src/clj-prod" "src/cljc" "src/cljs" "src/cljs-prod"]
                      :figwheel     {:on-jsload      "health.bootstrap/run-render"
                                     :websocket-host :js-client-host}
                      :compiler     {:main                 health.core
                                     :parallel-build       true
                                     :output-to            "resources/public/compiled/js/app.js"
                                     :output-dir           "resources/public/compiled/js/out"
                                     :asset-path           "compiled/js/out"
                                     :source-map-timestamp true}}
               :prod {:source-paths ["src/clj" "src/clj-prod" "src/cljc" "src/cljs" "src/cljs-prod"]
                      :compiler     {:main           health.core
                                     :parallel-build true
                                     :output-to      "resources/public/compiled/js/app.js"
                                     :optimizations  :advanced
                                     ;; for debugging
                                     :pretty-print   true
                                     :pseudo-names   true
                                     ;; for debugging
                                     }}}}
```

(_NOTE: I only added it to the `:dev` build but I guess you could add it to each build if you wanted to_)

Anecdotally (meaning I can't be bothered to time it properly) it sped up my build by about 300% - yep, that much. Restarting the REPL in the lovely CIDER is no longer an excuse to go and grab some coffee.

Have a great day!
