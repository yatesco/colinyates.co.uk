---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Modules within Emacs"
pubDate: 2017-10-15T16:25:00+01:00
tags: ["emacs", "tip"]
---

## The pitch

Do you maintain your own `.emacs.d` and worry that it is a single pile of complected and unmaintainable logic? Fancy a bit of spacemacs' layers?

Modules, modules and more modules for the win.

## Tooling

This approach requires a trivially small amount of elisp and a single plugin ([ivy, actually counsel, all of which is confusingly called swiper!](https://github.com/abo-abo/swiper)).

## The code

The code in its entirety (be **WARNED**, this is my first entry into Emacs' lisp):

```elisp
(defun cy/expand-to-module-file (module-name)
  (expand-file-name (concat "cy-" module-name ".el") "~/.emacs.d/elisp"))

(defun cy/edit-module (module-name)
  (find-file (cy/expand-to-module-file module-name)))

(defun cy/module-exists-p (module-name)
  (file-exists-p (cy/expand-to-module-file module-name)))

(defun cy/create-module (module-name)
  (let ((file (cy/expand-to-module-file module-name)))
    (write-region "" nil file)
    (find-file file)
    (evil-insert-state)
    (yas-expand-snippet (yas-lookup-snippet "header" nil 'lisp-mode))))

(defun cy/edit-or-create-module (module-name)
  (if (cy/module-exists-p module-name)
      (cy/edit-module module-name)
      (cy/create-module module-name)))

(defun cy/extract-module-name (filename)
  "Extract the module, assuming 'cy-<module>.el'"
  (substring filename 3 (- (length filename) 3)))

(defun cy/list-modules ()
  (let ((files (directory-files (expand-file-name "~/.emacs.d/elisp") nil "^cy-.*el$")))
    (mapcar 'cy/extract-module-name files)))

(with-eval-after-load "counsel"
  (defun cy/counsel-select-module ()
    "Forward to ~describe-function'."
    (interactive)
    (ivy-read "Select module "
	      (cy/list-modules)
	      :preselect (counsel-symbol-at-point)
	      :require-match nil
	      :sort t
	      :action 'cy/edit-or-create-module
	      :caller 'cy/counsel-select-module)))
```

> NOTE: by convention (which is hardcoded in!), modules are stored in `~/.emacs.d/elisp/` and are named `cy-<module-name>.el`.

The most interesting parts are:

- `cy/list-modules` which returns a list of module names
- `cy/counsel-select-module` which uses `ivy` (actually `counsel`) to present the list of known modules

## Using modules

To actually use these modules, add the module root (`~/.emacs.d/elisp`) to the Emacs' `load-path` in your `init.el`:

```elisp
(add-to-list 'load-path "~/.emacs.d/elisp")
```

Secondly, `require` the modules:

```elisp
(require 'cy-my-module)
```

And that's really all there is to it!

## A little more awesome source with `yas-snippet`

You will notice that `cy/create-module` invokes

```elisp
(yas-expand-snippet (yas-lookup-snippet "header" nil 'lisp-mode))
```

That invokes and starts the expansion process for the `header` snippet defined for the `lisp` modes. If you aren't already using `yas-snippets` then <span class="underline">please</span>, stop right now and check it out [here.](https://github.com/joaotavora/yasnippet)

## Summary

Building your own module plumbing in Emacs is trivial.

If you want to see this in action, feel free to checkout[ my dot files](https://github.com/yatesco/dotFiles) (specifically my [Emacs' configuration](https://github.com/yatesco/dotFiles/tree/master/dotFiles/emacs.d)). Pull requests for upgrades are more than welcome.

Peace.
