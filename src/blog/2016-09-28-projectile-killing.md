---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Killing a projectile project"
pubDate: 2016-09-28
tags: ["spacemacs", "emacs", "projectile", "tip"]
---

[Projectile](https://github.com/bbatsov/projectile) is an excellent library for managing 'projects' (where a project is typically a git repository).

Today I found a new tip - `projectile-kill-buffers` which effectively removes the project from your current emacs session:

```man
projectile-kill-buffers is an interactive autoloaded compiled Lisp function in
‘projectile.el’.

It is bound to SPC p k, M-m p k, C-c p k, <menu-bar> <tools> <Projectile> <Kill
project buffers>.

(projectile-kill-buffers)

Kill all project buffers.

[back]

```

It is really useful if you are toggling between multiple projects and want to finish working on one of the projects. Simply visit a buffer with a file in that project and `SPC p k`, confirm and all of the buffers related to that project disappear.

NOTE: it doesn't actually remove the project from emacs's session as you can still `SPC p p` (`helm-projectile-switch-project`) to the project.

That's all for now folks.
