---
title: "Three Founders Incorporate a Company"
layout: "docsidebar"
excerpt: ""
---
Three frogs have been working on a business together. After successful customer discovery and prototype development, they are now on the cusp of either recognizing revenue or taking investment. So it's time to form a company.

## What paperwork is involved?
These are the documents produced by Legalese's Singapore Incorporation workflow. In the future, Legalese will offer incorporation workflows for every jurisdiction in the world, so you can form a Delaware corporation, a BVI / Cayman vehicle, etc. For now, we use the Singapore example, because that's where the frogs happen to live.

## Clone the Google Spreadsheet
The [1: Tutorial]({{ site.baseurl }}{% link docs/1-hello-world.md %})  talks about how to do this for real. For now, just scroll through to see what happens.

## Configure The Company
Describe the frogs in the `Entities` tab. You will need all their deets. Now would be a good time to scan the founders' passports and proof of address, and save them into Google Drive, because your corporate secretary will ask to see these documents. (Tip: before you hire a corporate secretary, first ask how comfortable they are with using Google Drive and other intimidating computer technologies.)

## Generate Documents
Click `Add-ons / Legalese / Generate PDFs`.

By default, Legalese will boot up a corporation with a few extra features over and above what a typical corporate secretary will give you.

These differences are true across jurisdictions. At present Legalese produces Singapore companies but soon will produce U.S. companies too. For now, if you need a U.S. company incorporated, you should use something like [Clerky](http://www.clerky.com/).


## What documents are created?

Assuming you're in Singapore jurisdiction, you get:
1. **Memorandum and Articles of Association**. Legalese's default Articles of Association extends the standard government-provided regulations with a few extra features.

2. **Preemptive Rights for New Issues of Shares**.  If the Company wants to issue new shares (or securities convertible to shares) to new investors, it has to first offer existing shareholders pro rata rights to purchase those shares. (_Rights of first refusal_ are likewise defined for when a shareholder wants to transfer shares to somebody else.)
3. **Definition of a Change of Control Event**. This covers a trade sale / acquisition or other in which 50% of the controlling shares of company change hands. This may trigger liquidation preferences for some securities.

As you read the next few sections it might help to think about "ordinary", or "common", as the default object class for shares; they have basic attributes like voting rights and price per share. A particular ordinary share of common stock is an instance of a class, constructed by a procedure called _issue_ and _allotment_. "Preferred" classes of shares extend the default class with new properties and methods.

4. **Class definition for Series YC-AA Shares.** The Articles define a class of preferred shares called Series YC-AA Shares. These are logically equivalent to Y Combinator's Series AA shares, just adapted for the local jurisdiction. Properties include broad-based weighted-average anti-dilution, non-participating preferred, with a liquidation preference defined by the subscription agreement. These shares are convertible and non-redeemable.

5. **Class definition for Class F Shares.** The Articles define a class of preferred shares called F Shares. These were originally designed by JFDI. They are the mechanism by which your startup can implement founder vesting and employee stock ownership plans. These shares are redeemable and convertible. By default, they start out being redeemable (by the Company) and not convertible (by the Holder). As the shares vest, they stop being redeemable and start being convertible to ordinary shares, at the option of the Holder.

    These preferred share classes are defined, waiting around for you to use them, but you don't have to instantiate them until you're ready. When will you be ready? In the case of AA shares, when you have a new investor who wants to do an equity round. In the case of F shares, when you have founders and set up a vesting scheme. It's never too early to set up a vesting scheme, or to reserve an ESOP pool.

    To instantiate shares, you need a subscription agreement. Legalese provides that. More about that in the next demo.

6. **Shareholders' Agreement.**  Legalese asks the founders to sign a shareholders' agreement, which defines drags and tags, a share valuation policy, reserved matters, and a few required actions for the founders like buying insurance.

7. **Volunteer Agreement.**  Legalese asks the founders to sign a volunteer agreement, containing a non-compete, confidentiality, and assignment of Intellectual Property:

8. **Director Consents.**  Form 45 is required by the government

9. **First Directors' Resolutions.**  The promoters initialize the company with a set of resolutions.

## All these PDFs need your review.
Every time you `Generate PDFs`, Legalese creates a new folder under `Legalese Root` in your Google Drive. If you ever feel the urge to clean up, you can just delete everything under Legalese Root, and start over. You can even delete Legalese Root itself.

Each time Legalese generates documents, they go into a new folder, timestamped with the current time.

Under that folder you will see a bunch of PDFs. Review those docs.

## Circulate for Signature
Open the PDF using the EchoSign Add-On and send it for signature. Look in the README file for the list of email addresses to copy and paste into EchoSign's form. They are in the correct order to match the signature blocks.

The PDF is EchoSign-ready, which means it's been marked up with signature blocks in the appropriate places. You can route the PDF through DocuSign or HelloSign as well, but they probably won't Do The Right Thing with the EchoSign signature boxes.
