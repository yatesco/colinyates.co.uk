---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Managing dependant projects with lein"
pubDate: 2016-12-02
tags: ["lein", "clojure", "maven", "dev"]
---

I _strongly_ believe that ignorance is one of the most powerful tools we should employ when we build software. As a mechanism to enforce de-coupling it is great. What?! Huh?! No, I haven't lost the plot (any more than usual), I simply mean that I strive to build small components that are as ignorant as possible. The opposite of ignorance is knowledge and the more knowledge a component has the more coupled it is.

So, when it comes to Clojure I tend to have multiple lightweight projects, but unfortunately they can't be released publicly as they are all commercially sensitive. So how do I manage them?

Despite the mass of disconnected and incomplete material on the web it is actually straight forward (for [lein](http://leiningen.org/)) thanks to the fact `lein` talks `maven`. Maven uses [`wagons`](https://maven.apache.org/wagon/) as a transport abstraction to push and pull files around. So we simply need to find a `wagon` implementation that `lein` understands and hook it up.

There are various `wagon` implementations, and I figure most people would use Amazon's [S3](https://aws.amazon.com/s3/) and there [are](https://github.com/s3-wagon-private/s3-wagon-private) [plugins](https://github.com/pjstadig/lein-maven-s3-wagon) for that. Just to be contrary I want to use our private servers. Thankfully there is also an SSH [implementation](https://github.com/ToBeReplaced/lein-wagon-ssh-external) which works a treat.

Using it couldn't be simpler:

1. make sure any machine that needs to access the server (e.g. your local build machine and CI server) has access via SSH keys
2. in the project you want to deploy add the plugin to `:plugins` section of your `project.clj`
3. define your repository by adding it to your `:repositories` sequence in your `project.clj`

Now you can `lein deploy <your-repository>`.

In the project that needs to access the previously deployed project add the same `plugin` and `repository`.

As an example, if `project-a` needs to be deployed to the SSH server its `project.clj` might look like:

```clojure
(defproject my-company/project-a "0.4.1"
  :dependencies [
  ...
  ]

  :plugins [[lein-wagon-ssh-external "0.1.0"]]

  :repositories [["my-repo" {:url           "scp://some.valid.host/with/a/valid/path"
                             :username      "the-user-who-is-authenticated-by-your-key"
                             :sign-releases false}]]

  :aliases {
            ...
            "deploy!" ["do" "full-build-cljs!" ["deploy" "my-repo"]]
            })
```

(_NOTE: I didn't bother signing our internal releases, so I added `:sign-releases false`._)

To allow `project-b` to access `project-a`:

```clojure
(defproject my-company/project-b "0.1-SNAPSHOT"
  :dependencies [
   [my-company/project-a "0.4.1"]
  ]

  :plugins [[lein-wagon-ssh-external "0.1.0"]]

  :repositories [["my-repo" {:url      "scp://some.valid.host/with/a/valid/path"
                             :username "the-user-who-is-authenticated-by-your-key"}]])
```

Simple as that :-).
