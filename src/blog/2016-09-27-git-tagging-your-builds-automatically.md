---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Git tagging your builds automatically"
pubDate: 2016-09-27
tags: ["git", "dev"]
---

I need to write a much longer post to explain my thoughts on 'versioning' and what constitutes a release with today's trends of continuous integration, but for now, a simple tip.

I wanted a way to distinguish each <span class="underline">build</span>, not each <span class="underline">release</span> but each <span class="underline">build</span>. There is one excellent source of truth for that which is your git repository.

Wouldn't it be great if each build contained a full git log of what went into it?.

## The magic

We use [circleci](circleci.com) (but it would be trivial to do with any decent continuous integration server) and before building we simply execute `git log --oneline --decorate --graph > resources/public/glog.txt`:

```yaml
machine:
  java:
    version: oraclejdk8

# Customize dependencies
dependencies:
  cache_directories:
    - "~/.m2"
  pre:
    - git fetch --tags

test:
  override:
    - git log --oneline --decorate --graph > resources/public/glog.txt
    - lein full-build-no-tests!
    - mkdir -p $CIRCLE_TEST_REPORTS/junit/
    - find . -type f -regex ".*/target/test-reports/.*xml" -exec cp {} $CIRCLE_TEST_REPORTS/junit/ \;
    - cp target/*.war $CIRCLE_ARTIFACTS
# this doesn't work so commented out
# in favour of an explicit =cp= in the test: post: stage
#general:
#  artifacts:
#    - "target/*.war"
```

<span class="underline">(`resources\public` is exposed from the root of the `lein war` `WAR` file)</span>

This is of course only one way of doing it, but it was the 'Simplest Thing That Can Possibly Work'. And sure, it corrupts the working directory because `resources\public` is under git version control, but it doesn't matter because `circleci` containers are disregarded after every build.

That's all for now - why not enjoy some [light entertainment :-)](https://www.youtube.com/watch?v=RUX2-N8cVMc).
