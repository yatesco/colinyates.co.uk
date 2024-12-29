---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Blogging with jekyll, hexo, emacs and org"
pubDate: 2015-08-26 20:32:00
tags: ["emacs", "jekyll", "org-mode", "blog"]
---

> Be careful - this is an old post and may not work anymore!
> {.warning}

This is really just a moan, move on - there are almost certainly better
things to do with your life.

Still here? Ok, you have been warned.

# Blogging, blogging, blogging

I rate [emacs](https://www.gnu.org/software/emacs/), it really can seem
to do anything, as long as you are happy to build your own editor on top
of it.

I also rate [org-mode](http://orgmode.org), which can also seem to do
anything, and [markdown](http://daringfireball.net/projects/markdown/)
which is a <u>much</u> saner way to create content that end up in HTMLs.
And of course [org-mode can publish
docs](http://orgmode.org/manual/Publishing.html).

A also decided that I didn't want to hand over my content, so a system
which generates a website I can upload to my server is another
requirement.

A quick google and [jekyll](http://jekyllrb.com) seems to be the number
one contender, it supports `markdown`, is a static site generator and
everybody seems to rave about it.

# Jekyll

Getting started with Jekyll is trivially easy, particularly on a Mac
where ruby is installed out of the box. From their start page:

```ruby
$ gem install jekyll
$ jekyll new my-awesome-site
$ cd my-awesome-site
$ /my-awesome-site $ jekyll serve
;; => Now browse to http://localhost:4000
```

And it really that easy. In fact, this blog (as of now) is using the
default theme - not bad is it? Blog posts require a trivial amount of
meta-data and it is even natively understood (indeed, even underpins)
[github pages](https://pages.github.com).

# Jekyll and not Hyde

So where is the pain?

Well, turns out that when hosted on `github pages` you can't use
plugins. Ok, fine, except some pretty fundamental capabilities aren't
supported out of the box:

- tagging
- tag clouds
- tag feeds
- archived pages
- search

and so on.

Jekyll does support [plugins](http://jekyllrb.com/docs/plugins/) but
they aren't enabled when using `github pages`. There are some pretty
neat people out there who have achieved some of the above capabilities
using [liquid](https://github.com/Shopify/liquid/wiki) which `jekyll`
uses for [templating](http://jekyllrb.com/docs/templates/), for example
[here are some](https://duckduckgo.com/?q%3Djekyll%2520liquid%2520tags).

The problem is I can't seem to get them to work. I also can't seem to
get any of the [plugin based
ones](https://duckduckgo.com/?q%3Djekyll%2520tag%2520plugin) to work
either.

Is it me? Probably :-), and I confess I haven't spent more than a couple
of hours on it, but why on <u>earth</u> isn't something as fundamental
as this supported out of the box?

# Emacs to the rescue

Moving on, at least I can look forward to using `emacs` and `org-mode`
to integrate with `jekyll`. Look, there are even [official
instructions](http://orgmode.org/worg/org-tutorials/org-jekyll.html).
Except that assumes you have already configured the beast that is
`org-mode publishing`.

Surely there must be an easier HOWTO? Well there [seems to be
lots](https://duckduckgo.com/?q%3Dorg%2520mode%2520jekyll) only none of
those seem to work either!

Again, is it me? Again, I only spent a few hours on this, but compared
to the 5 minutes I spent bootstrapping `jekyll` and creating my first
blog post, I am shocked that this stuff is so hard.

# Giving up?

At this point I was thinking that maybe I am not the candidate audience
as I simply want a blog to work, I don't particularly care <u>how</u>,
only that is `markdown` based and is statically generated. A quick bit
of [research](https://staticsitegenerators.net) showed there are plenty
in this space and a bit more research showed
<https://www.staticgen.com>.

The top 4 at the time I looked were:

- jekyll
- [GitBook](http://www.gitbook.com)
- [Octopress](http://octopress.org)
- [Hexo](http://hexo.io)

Well, I didn't want to depend on GitHub and Octopress is based on
jekyll. Off to Hexo.

# Hexo

[Hexo](https://hexo.io) is about as simple as jekyll to get started, and
out of the box it supports all the various gadgetry that I want.

Posts are written in `markdown` with a little big of ceremony at the
top, similar to jekyll.

But looking into a little bit more, things just didn't sit well. Nothing
specific, but it didn't <u>vibe</u> with me as much as jekyll.

# So where are we?

So, I am going to stick with jekyll and accept I might need to put some
more time in than expected. Fine, and it is definitely a nice problem to
have compared to the horrors of hosted blogging platforms (which shall
remain nameless).

Emacs? Yeah, I am typing this in `org mode` and will manually export it
to markdown and then copy and paste.

Yeah, I know.

Anyway, that is the end of my moan. Thanks for reading and hopefully the
rest of the posts on this blog will be a bit more educational and
upbeat, but please do be prepared for this blog to grow organically as I
get used to jekyll ;-).

Bye all.
