---
title: "Google Apps and GitHub"
layout: "docsidebar"
excerpt: ""
---
Spreadsheet interface and template filling is done in Google Apps. This page is sourced from `DEVELOPMENT.org` on legalese-google-app.

# Development Cycle<a id="sec-1" name="sec-1"></a>

How does one develop a Google App? What does the dev environment look like? How to interoperate with Git and Github?

There doesn't appear to be a super-elegant way to connect Google Apps Script with Github. Google expects developers to work in their own web IDE: script.google.com. But it feels right to keep Apps Scripts under some kind of distributed version control system, like Github. And that paradigm expects you to have a local clone of the repo on your laptop.

http://stackoverflow.com/questions/12712593/should-google-app-scripts-be-stored-in-version-control-like-github

That paradigm is well developed - if you're familiar with Git, you know how to organize feature branches, merge and rebase, and collaborate with other developers at the level of the commit. The Legalese project has settled on the following practices:

## Every Developer Should Have Their Own Copy of a Spreadsheet<a id="sec-1-1" name="sec-1-1"></a>

Click File / Make a Copy.

## Every Developer Therefore Has Their Own Container-bound Script.<a id="sec-1-2" name="sec-1-2"></a>

Click Tools / Script Editor.

## Every Developer Should Have A Local Git Clone of the Repo.<a id="sec-1-3" name="sec-1-3"></a>

### Developers Work On (Public) Feature Branches Together.<a id="sec-1-3-1" name="sec-1-3-1"></a>

If one or more devs are working on a feature, they should make a branch to represent work on that feature.

They can both work on local checkouts of that branch. All the usual drama about [merge and rebase](https://www.atlassian.com/git/tutorials/merging-vs-rebasing/) becomes relevant.

## A Developer Might Prefer the Web IDE<a id="sec-1-4" name="sec-1-4"></a>

If a Developer doesn't mind the awkwardness of editing in the script editor, she could just do that.

But every time she wants to commit changes into Git, she would have to copy from the script editor and paste into a local editor, then commit those changes to Github.

Or, I suppose, she could paste those changes directly into Github's Web UI. All web, all the time! No need for local emacs! You can do this on a Chromebook!

But you can't do this on a plane, lol.

## A Developer Might Prefer a Local IDE<a id="sec-1-5" name="sec-1-5"></a>

Some people are addicted to Emacs and can't get off it.

In Ye Olde Days of mainframe computers, developers would write their code on physical paper punch cards, bring those cards to the computer center in a shoebox, and submit them to be run. The next day, they would come back, and their jobs would have run overnight, and they would be handed back the shoebox together with a large ream of paper representing the printout. Thus was born the edit-compile-run-debug loop, and it would take days or weeks to build the simplest thing.

In the 1990s we got interactive terminals, desktop workstations, laptops, and locally hosted development environments. The idea of the [read-eval-print loop](https://en.wikipedia.org/wiki/Read%25E2%2580%2593eval%25E2%2580%2593print_loop) came about with interactive scripting languages. Everything got faster.

Unfortunately, with the Cloud, we now have regressed a little. Because the Google Apps thingy runs in the cloud, there is, alas, no way for us to run a local dev version of the Google Apps engine. So, every time we want to run something, we have to do the equivalent of bringing a shoebox to the data center, which is to say we have to copy and paste from our local editors to the Google Apps Script `code.gs` window.

That's not so bad, all things considered. Back in Ye Olde Days, we had to trudge to the mainframe center in the snow, uphill both ways.

So, if you are old school, want to keep it [trill](http://www.urbandictionary.com/define.php?term=Trill), and absolutely insist on developing on your own [Novena](https://en.wikipedia.org/wiki/Novena_(computing_platform&#41;) laptop, then you can do it this way, and you will be [On Fleek](https://www.youtube.com/watch?v=sLffURje0Zo).

## Copy and Paste is the Acme of Software Development<a id="sec-1-6" name="sec-1-6"></a>

So, after fifty years of software development practice, we still have to carry boxes of source code through the snow. The only question is uphill or downhill. Oh well.

There are ways around this but they begin to get excessively hacky, like syncing emacs realtime with Google Apps Script in the background.

# Illustration<a id="sec-2" name="sec-2"></a>

So, if two devs, Alice and Bob, are working on a feature branch together (called "svg"), the repo would have a master and an svg branch.

Alice and Bob would each check out the svg branch on their respective laptops.

Alice and Bob would each copy the dev spreadsheet. Let us hope that these copies stay the same and do not diverge, or there will be mysterious bugs and many exclamations of "but it works fine for me!" These bugs will be traced to the fact that the spreadsheets are different in subtle and nearly invisible ways.

Alice makes an edit. She tests it by copy/pasting to her Script Editor. It works. She is pleased. She commits the edit. She yells over the cubicle wall, or Slack, to Bob, that she has made vast improvements to his eternal shame.

Bob, not believing this, runs a git pull and obtains her latest commit. He runs a merge so his working tree absorbs Alice's commit. He observes that her work is, indeed, of superior quality. He is motivated to match her "Sixteen Dragon" style with a "Laughing Tiger" of his own.

He makes edits, pastes them in to his Script Editor, and observes that they work. He commits his changes and runs a push.

This model is basically the same as what is described at (http://nvie.com/posts/a-successful-git-branching-model/)

After they are satisfied with the new "svg" feature branch, they decide to halt development and send a pull request to Cordelia, who maintains the master branch. Cordelia accepts all their changes and merges the changes into the master.

If Cordelia is on vacation or doesn't exist, then Alice and Bob may decide on their own to merge changes back into master.

But a pull request is the correct way to submit changes to master, because that's when a code-review step can happen.
