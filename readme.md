# How does this site work?

[Jekyll](https://jekyllrb.com/docs/step-by-step/01-setup/) will set you up.

## What happened to the navbars?

In most of the `*.html` files you should see these lines at the top: 

	---
	layout: default
	---
	
This indicates `default.html`, which contains the default layout (which consists mostly of the top and bottom navigation bars. This file is the one to change if you want those things to look differently.

## How do I actually generate the HTML?

Navigate to the root directory and run `jekyll build -w`. This will make jekyll mash your templates together and watch for further changes.

If you return to your terminal after saving some changes you've made, you should see something like

	Regenerating: 1 file(s) changed at 2018-10-17 23:53:35
                    #readme.md#
                    ...done in 0.126117 seconds.

The output of this build process is `_site`. Open the HTML files in that directory to see your completed output.

## Do I need to run the build command to check in my changes?

Nope. Just make your changes in the HTML files and push as usual.
