---
title: "Send for Signature"
layout: "docsidebar"
excerpt: ""
---
<div class="block-callout block-show-callout  type-success block-show-callout  type-success ng-valid" type="section.type" ng-model="section.data">
  <h3>
      <i class="fa fa-info-circle " title="Info"></i>
          <i class="fa fa-exclamation-circle " title="Warning"></i>
	      <i class="fa fa-exclamation-triangle " title="Danger"></i>
	          <i class="fa fa-check-square on" title="Success"></i>

    <span class="ng-binding">After running this tutorial, you will have</span>
      </h3>

  <div marked="data.body" class="ng-isolate-scope"><ul>
  <li>set up an e-signature back-end</li>
  <li>sent a PDF for signature.</li>
  </ul>
  </div>
  </div>
  
You, a **power user**, inject the _Hello World_ PDF into an e-signature service which emails it to you for signing.

Open the Google Drive folder that contains the _Hello World_ PDF.
1. The folder is named `My Legalese Tutorial Hello World`.
(If you don't know how to find the folder, begin by going back to the yellow spreadsheet.)
(If you don't know how to find the yellow spreadsheet, search your Google Drive for _My Legalese Tutorial_.)
(If you don't want to search, start at `My Drive` and open `Legalese Root`. Everything that Legalese does is in there. We created this folder for you automatically.)

2. Select the _Hello World_ PDF.

3. Right-click the PDF (or hit `a` if you're a keyboard geek).

4. Open With: `E-Sign with EchoSign`.
    If you don't see the `EchoSign` option, click `Connect More Apps` to add it.

5. Enter the To: and Cc: addresses based on what's shown in the README file. The order matters. If you're using EchoSign, you'll notice that the signature blocks are already in the right place.

6. Go ahead and send for signature!


<div class="block-callout block-show-callout  type-info block-show-callout  type-info ng-valid" type="section.type" ng-model="section.data">
  <h3>
      <i class="fa fa-info-circle on" title="Info"></i>
          <i class="fa fa-exclamation-circle " title="Warning"></i>
	      <i class="fa fa-exclamation-triangle " title="Danger"></i>
	          <i class="fa fa-check-square " title="Success"></i>

    <span class="ng-binding">When the signature service asks me for the signers' email addresses, what should I say?</span>
      </h3>

  <div marked="data.body" class="ng-isolate-scope"><p>Open up the README file and enter the email addresses shown in the To: line.</p>
  </div>
  </div>

<div class="block-callout block-show-callout  type-info block-show-callout  type-info ng-valid" type="section.type" ng-model="section.data">
  <h3>
      <i class="fa fa-info-circle on" title="Info"></i>
          <i class="fa fa-exclamation-circle " title="Warning"></i>
	      <i class="fa fa-exclamation-triangle " title="Danger"></i>
	          <i class="fa fa-check-square " title="Success"></i>

    <span class="ng-binding">What if I prefer DocuSign / HelloSign / some other e-signature backend?</span>
      </h3>

  <div marked="data.body" class="ng-isolate-scope"><p>That's fine; you can certainly do that. The advantage of EchoSign is that the PDFs contain embedded Signature Blocks which EchoSign knows how to read. If you use some other signature service, you will need to manually place the signature blocks.</p>
  </div>
  </div>