---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Circle-ci and phantomjs"
pubDate: 2016-09-29
tags: ["dev", "clojure", "clojurescript"]
---

## Another quick tip.

I use the excellent [cljsbuild](https://github.com/emezeske/lein-cljsbuild) to compile and test our ClojureScript projects (and I can't believe how difficult it is to wire this stuff together in 2016!).
To support continuous integration I use [phantomjs](http://phantomjs.org) to provide the JavaScript environment.

Unfortunately circleci's environment doesn't have `phantomjs` v2 available to it and v1 has some troubling properties. It turns out, after much googling and dead ends, that it is pretty trivial to get `phantomjs` in your circleci environment, simply add:

```yaml
machine:
  pre:
    - sudo curl --output /usr/local/bin/phantomjs https://s3.amazonaws.com/circle-downloads/phantomjs-2.1.1
```

to your `circle.yml` - thanks [kimh@circleci](https://discuss.circleci.com/t/add-phantomjs-2-1-1-to-the-platform/1755/3).

## lein-cljsbuild

The documentation on [github](https://github.com/emezeske/lein-cljsbuild/blob/master/doc/TESTING.md) is sufficient and the [advanced project](https://github.com/emezeske/lein-cljsbuild/tree/master/example-projects/advanced) contains all you need.

However, in brief (and note, this isn't exactly the same as the advanced project):

`project.clj`:

```nil
(defproject <YOUR-COMPANY>/<YOUR-COMPANY>.util "0.4.1-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
	    :url  "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.8.0"]
		 [org.clojure/clojurescript "1.9.216"]
		 [org.clojure/tools.logging "0.3.1"]
		 [ch.qos.logback/logback-classic "1.1.7"]
		 [net.sourceforge.jtds/jtds "1.3.1"]
		 [com.mchange/c3p0 "0.9.5.2"]
		 [environ "1.1.0"]
		 [com.lucasbradstreet/instaparse-cljs "1.4.1.2"]
		 [prismatic/schema "1.1.3"]
		 [org.clojure/java.jdbc "0.4.2"]
		 [clj-time "0.12.0"]
		 [com.andrewmcveigh/cljs-time "0.4.0"]]

  :plugins [[lein-environ "1.1.0"]
	    [lein-wagon-ssh-external "0.1.0"]
	    [lein-cljsbuild "1.1.4"]]

  :cljsbuild {:test-commands
	      {"unit" ["phantomjs"
		       "phantom/unit-test.js"
		       "resources/private/html/unit-test.html"]}
	      :builds {
		       :prod
		       {:source-paths ["src"]
			:compiler     {:output-to     "resources/public/js/main.js"
				       :optimizations :advanced
				       :pretty-print  false}}
		       :test
		       {:source-paths ["src" "test" "test-cljs"]
			:compiler     {:output-to     "resources/private/js/unit-test.js"
				       :optimizations :advanced
				       :pretty-print  false}}}}
  ; Clean JS directories
  :clean-targets ^{:protect false} ["resources/private/js"
				    "resources/public/js"
				    :target-path]

  :aliases {"clj-tests!"           ["do" "test"]
	    "cljs-tests!"          ["do" ["cljsbuild" "test"]]
	    "all-tests!"           ["do" "clj-tests!," "cljs-tests!"]
	    "full-build-no-tests!" ["do" "clean"]
	    "full-build-cljs!"     ["do" "clean," "cljs-tests!"]
	    "full-build!"          ["do" "clean," "all-tests!"]
	    ;; TODO - circleci cannot access a MS SQL database so run as many tests as we can
	    "deploy!"              ["do" "full-build-cljs!"]})
```

`phantom/unit-test.js`:

```nil
var system = require('system');
var url,args;

if (phantom.version.major > 1) {
    args = system.args;
    if (args.length < 2) {
	system.stderr.write('Expected a target URL parameter.');
	phantom.exit(1);
    }
    url = args[1];
} else {
    args = phantom.args;
    if (args.length < 1) {
	system.stderr.write('Expected a target URL parameter.');
	phantom.exit(1);
    }
    url = args[0];
}

var page = require('webpage').create();

page.onConsoleMessage = function (message) {
    console.log("Test console: " + message);
};

console.log("Loading URL: " + url);

page.open(url, function (status) {
    if (status !== "success") {
	console.log('Failed to open ' + url);
	setTimeout(function() { // https://github.com/ariya/phantomjs/issues/12697
	    phantom.exit(1);
	}, 0);
    }

    page.evaluate(function() {
	<YOUR-COMPANY>.util.test.run();
    });

    setTimeout(function() { // https://github.com/ariya/phantomjs/issues/12697
	phantom.exit(0);
    }, 0);
});
```

`test-cljs/<YOUR-COMPANY>.util.test`:

```clojure
(ns <YOUR-COMPANY>.util.test
  (:require [clojure.test :as t]
	    [<YOUR-COMPANY>.util.common-test]
	    [<YOUR-COMPANY>.util.hierarchy-test]
	    [<YOUR-COMPANY>.util.parser.time-test]))

(enable-console-print!)

(defn ^:export run []
  (.log js/console "Testing <YOUR-COMPANY>.util")
  (t/run-all-tests #"<YOUR-COMPANY>.util.*-test"))
```
