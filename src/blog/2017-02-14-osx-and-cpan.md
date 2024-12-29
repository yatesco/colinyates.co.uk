---
layout: ../../layouts/MarkdownPostLayout.astro
title: "mpd, ncmpcdd, perl, CPAN and song ratings on OSX"
pubDate: 2017-02-14 09:00:00
tags: ["cli", "music", "tools", "osx", "perl"]
---

Hi there, been a while - so, buzzword bingo anyone ;-).

Having grown tired of the weight and cost of a GUI I am returning to my lighter-weight roots as much as possible. I can't quite reproduce the fantastic experience of [i3](https://i3wm.org) on the mac but using terminal based apps is a good first step.

So, after experimenting with the excellent [cmus](http://cmus.github.io) I was sold on the convenience of terminal based music players (did I mention how fast these things are?!). However, `cmus`, whilst excellent had a few things that didn't quite gel with me:

- slightly inconsistent keyboard mappings
- no way to navigate via tags
- no way to rate songs and therefore noway to build dynamic play lists

The other great contender is [mpd](https://www.musicpd.org) which is a music player daemon/server with a whole [shedload of clients](http://mpd.wikia.com/wiki/Clients). The most popular one seems to be [ncmpcpp](http://rybczak.net/ncmpcpp/).

Installing it was a breeze, follow [this](https://timothy.sh/article/install-mpd-ncmpcpp-on-osx-yosemite/) although ignore the instruction to create `mpd.db` otherwise `mpd` will complain of a corrupted DB.

After installing `mpd` and `ncmpcpp` it is time to use them. By far the best reference I have found for `ncmpcpp` is [this cheat sheet](https://pkgbuild.com/~jelle/ncmpcpp/).

So, great, except `ncmpcpp` doesn't rate songs. The main contender for that seems to be a Perl module ("app?"): https://metacpan.org/release/Audio-MPD. I confess, despite over 20 years of professional software engineering I have managed to not touch Perl ;-). So, what do you do with a Perl thingy?

Turns out:

- CPAN is the `maven` of the Perl world
- `cpan install <module>` installs that library so Perl 'apps' can access it
- a Perl 'app' is really just a shell script that uses the `perl` interpreter

With this knowledge, getting hold of `mpd-dump-ratings` and `mpd-rate` is as simple as:

1. configure `cpan` on your mac if you haven't already by executing `cpan`
2. clone the [github repo](https://github.com/jquelin/audio-mpd) locally
3. `cpan install AUDIO:MPD` (analog of `mvn install`) installs the `MPD` library locally
4. run it again as it failed for me the first time :-)
5. in the `bin` directory of the github repo you cloned you can find `mpd-dump-ratings`,`mpd-dynamic` and `mpd-rate`

So, have a read through the documentation and link those 3 scripts to your local `~/bin` directory (or whatever directory you have in your $PATH for just such a thing).

I am almost certainly doing something wrong and non-idiomatic and upgrades are, as ever, welcome.

That's all for now folks - see you in another few months ;-).
