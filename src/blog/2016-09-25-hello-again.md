---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Blogging, hello, *again*!"
pubDate: 2016-09-25
tags: ["redemption", "broken promises"]
---

## A fresh start

So, er yeah. I haven't really blogged for a _long_ time - this time it will be different. I promise.

Hmm, I am already sceptical. It is well known that 'trying harder' never works, so what is different this time? Well, I have some objectives which are [SMART](https://en.wikipedia.org/wiki/SMART_criteria):

- **S**pecific
- **M**easurable
- **A**greed upon
- **R**ealistic
- **T**ime-based

In a democracy of 1 it is pretty easy to meet the 'Agreed upon' criteria. So, what is my goal? To publish one 'meaty' blog post a week. By 'meaty' I mean a reaction to some non-trivial event in real life, probably work related.

What sorts of things will I ramble on about? Primarily technical I think, specifically around the Functional Programming and Enterprise landscape.

I care very passionately about Software Engineering and critical thinking as oppose to doing it `because Google`. That will almost certainly creep in throughout the blog.

## Jekyll, so long

My previous blog was built using the excellent [jekyll](https://jekyllrb.com). The handful of posts can be found [on github](https://github.com/yatesco/yatesco.github.io). I fully intended to use it, but having upgraded to MacOS Sierra, installing jekyll was an exercise in pain.

`jekyll` itself had moved to using `bundler` which I don't object to at all. The thing I _do_ object to though is a gazillion `gem install`s, failing on the somewhat infamous [Nokogiri](http://www.nokogiri.org/tutorials/installing_nokogiri.html).

Their [GitHub](https://github.com/sparklemotion/nokogiri) issues list contains a number of helpful pointers when using `brew`, but unfortunately I am using [macports](https://www.macports.org) and after 3 hours or so of trying different incantations I gave up.

## Cryogen

I had noticed [Cryogen](http://cryogenweb.org) before but `jekyll` was sufficient at the time, now I thought it deserved another look. And I am glad I did. Features?:

- tags
- feeds
- markdown (or that funny AsciiDoc ;-)
- ridiculously trivial `disqus` [integration](http://cryogenweb.org/docs/configuration.html)
- Clojure (which I use full time at work)
- lein

Some not-so-great bits:

- the site is generated (following convention) in `resources\public` so actually deploying the site requires an extra step or two. The solution can be as simple as having one git repo for the source and one for `resources\public` which `GitHub Pages` then serves.
- the web site is generated automatically but you still need to refresh the web browser. I might investigate the most excellent [figwheel](https://github.com/bhauman/lein-figwheel) to see if that can be integrated
- it doesn't support `org-mode`. I can hardly hold it to account for that, and given `org-mode`'s excellent export modes it should be trivial to sort it out.
- the default theme means `literal` and [links](https://www.google.co.uk/search?q=happy+cat&client=safari&rls=en&tbm=isch&tbo=u&source=univ&sa=X&ved=0ahUKEwj--dfIpKvPAhXqDcAKHY01BaAQsAQIHQ&biw=1324&bih=902) aren't easily distinguished.

An alternative to GitHub Pages is to host your own static server and `rsync` it across, which is what I am doing.

Actually, because my `yak shaver` was feeling particularly sharp I decided to use [circleci](https://circleci.com) to deploy it which was as [trivial](https://github.com/yatesco/blog-cryogen/blob/master/circle.yml) as:

```
deployment:
  push_to_server:
    branch: master
    commands:
      - rsync -avz resources/public/ coliny@colinyates.co.uk:html/
```

_make sure to create a new key pair for your remote server, `ssh-copy-id` to your remote server and then add the private key to your `circleci` project_

As the ever-growing engineer I notice a few upgrades to my process:

- rather than commit the entire `resources\public` I could just commit the `resources\templates` directory and have `circleci` run `lein run` before deployment
- having the `rsync` call in `circle.yml` feels a bit yucky. Better to have a commited script which `circleci` calls.

Anyways, it was relatively harmless and the blog is off to a flying start.

### The Future!

Watch this space ;-).
