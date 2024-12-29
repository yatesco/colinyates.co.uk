---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Bye bye OVH, Hello GitHub pages"
pubDate: 2015-09-05
tags: ["blog", "ovh", "github"]
---

> Be careful - this is an old post and may not work anymore!
> {.warning}

[OVH (UK)](http://ovh.co.uk) are great for cheap commodity hardware and
VPSes etc. Their [web hosting](https://www.ovh.co.uk/web-hosting/)
packages are fantastic as well. Their management interfaces, not so
much. In fact, to be blunt, they suck. And, to be blunt, so does their
customer support sometimes.

For example, I signed up for a web hosting package, it came through and
everything worked. Then I decided I really didn't need it and could get
away with the emailing package that comes with their domain names and I
could use [Github Pages](https://pages.github.com) to host this blog.
One email to customer support asking to cancel the hosting but keep the
domain names and email and hosting support was cancelled. Unfortunately
this meant their control panel no longer allowed access to my email
address(es) at that domain nor could I amend any DNS records.

# GitHub Pages

GitHub kindly allow you to create a 'magic' repository called
`<your-username>.gihub.io` which they will host and publish on the web
for you. For free! In addition, it also [natively understands
Jekyll](https://help.github.com/articles/using-jekyll-with-pages/).

Nice.

Simply commit your `jekyll` project to that repository, sans the `_site`
directory, twiddle your thumbs for a few seconds and then visit
`http://<your-username.github.io` and your website should appear!

## Who wants <http://>\<your-username\>.github.io?

Nobody I expect, that's why the awesome continues when you realise you
can add your own custom domain. To do this, add [a CNAME to your
repository](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/)
and update your domain's DNS servers to add an `ALIAS` or `CNAME` to
point to github.

# OVH DNS

As I said, OVH's new control panel wasn't letting me update my DNS
settings so I went to the old control panel and updated the `A` record
for colinyates.co.uk to point to github's IP address, as per
[here](https://help.github.com/articles/tips-for-configuring-an-a-record-with-your-dns-provider/):

<figure id="fig:ovh-dns">
<img src="../images/ovh-dns-settings.png" />
<figcaption>DNS settings for colinyates.co.uk</figcaption>
</figure>
