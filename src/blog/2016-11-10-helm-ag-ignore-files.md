---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Restricting helm and ag to certain files"
pubDate: 2016-11-10
tags: ["emacs", "spacemacs", "tip", "dev", "helm", "ag"]
---

[ag](https://github.com/ggreer/the_silver_searcher) is great and searches through your code base in the blink of an eye. Coupled with [helm](https://github.com/syohex/emacs-helm-ag) it makes for a great experience finding things. If run in a `git` project then it helpfully ignores those in your `.gitignore` file.

However, in most projects I have files with different extensions, maybe some `.md` for documentation, some `.html` for published documentation, `.clj`, `.cljs`, `.cljc`, `.js` etc. I often know in which files the thing I am searching for lives, but I hadn't figured out a way to restrict `ag`.

That isn't quite right - you can restrict `ag` at the command line with `-G<backslash>.<ext>` so `ag -G<backslash>.cljs DEBT` will find the (unfortunately many) instances of code that I consider technical debt.

(_NOTE: Unfortunately I can't figure out how to escape the backslash (\\) in code blocks so the literal text is "ag -G\\.cljs"_)

This works great, but in spacemacs these sorts of configuration switches are typically mapped to keys.

Reading the really useful spacemacs FAQ [tells you](https://github.com/syl20bnr/spacemacs/blob/master/doc/FAQ.org#use-helm-ag-to-search-only-in-files-of-a-certain-type) that what you type in the helm input is passed straight through to `ag`.

So, next time I need to feel depressed I can search (`SPC s p`) for "DEBT" or, if I only want to feel generally low then I can search for `-G<backslash>.clj DEBT` :-)

Have a great day all.
