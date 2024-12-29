---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Cancelling an online.net server"
pubDate: 2016-10-16
tags: ["online.net", "servers", "infrastructure"]
---

I have found [Online.net](https://online.net) great in terms of provisioning time, capability of their UI, customer service etc.

_(I have also found some not-so-nice things: setup-costs, cannot use your own Windows license, unclear documentation on whether your server can access the RPN etc. but let's not spoil a nice day :-))_

Anyway, I needed to grab a server to dump my private [XenServer](http://xenserver.org) (brilliant) cloud when I moved it from [OVH](http://ovh.co.uk) (er, not so brilliant). Now the migration has finished I needed to cancel the server....ur...how? A web search has a number of reponses but most of them point to the old UI.

Turns out it ISN'T in any obvious place, you know, like next to your list of servers or on the server page itself, but is (cunningly :-() hidden away in your 'Billing' section.

So....logon to your console and click on the little down arrow next to your username in the top right:

![the console](/img/cancel-online-server/01-console.png)

then click on the down arrow:

![the console](/img/cancel-online-server/02-click-on-name.png)

click on 'Services' in the drop down:

![the console](/img/cancel-online-server/03-list-of-services.png)

pick 'Details' next to the server in question:

![the console](/img/cancel-online-server/04-terminate-button.png)

click on the 'Terminate' button:

![the console](/img/cancel-online-server/05-terminate-confirm.png)

and provide a reason:

![the console](/img/cancel-online-server/06-termination-explanation.png)

That's it.
