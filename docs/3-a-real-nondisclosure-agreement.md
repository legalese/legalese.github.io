---
title: "A Real Nondisclosure Agreement"
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
  <li>created a real NDA ready for execution</li>
  </ul>
  </div>
  </div>
  
You, a **power user**, choose a real-world docset, and create a real-world agreement, taking advantage of the `INCLUDE` keyword to reuse the entities from a different tab.

1. Look at the row of tabs at the bottom of the spreadsheet.

2. You will see tabs with names like `NDA`, `Entities`, `Incorporation`, `Class F`, and `Seed Round`.
Let's start with a simple agreement: a nondisclosure.

3. Go to the `NDA` tab.

4. Note that one of the section headings is `INCLUDE Hello World`. That tells Legalese to load the `Entities` data from the Hello World tab.

5. Generate PDFs and wait a couple minutes for the PDF to show up.

6. This time, you should see that the PDF is now a nondisclosure agreement.

7. There are two kinds of NDAs: unilateral and bilateral. Change cell B9 to suit, and generate again, if necessary.

8. If you actually want to send a real NDA, update the Entities in Hello Word with real particulars, then repeat the steps from [Tutorial 3]({{ site.baseurl }}{% link docs/2-send-for-signature.md %}).

<div class="block-callout block-show-callout  type-info block-show-callout  type-info ng-valid" type="section.type" ng-model="section.data">
  <h3>
      <i class="fa fa-info-circle on" title="Info"></i>
          <i class="fa fa-exclamation-circle " title="Warning"></i>
	      <i class="fa fa-exclamation-triangle " title="Danger"></i>
	          <i class="fa fa-check-square " title="Success"></i>

    <span class="ng-binding">What does the Counterparty line in the ROLES section mean?</span>
      </h3>

  <div marked="data.body" class="ng-isolate-scope"><p>The NDA template uses two parties: the Company, and the Counterparty. Cell B13 says <code>[Buyer]</code>, which means: every Buyer is a Counterparty, so Legalese defines Counterparties by substituting the Buyer from the <em>Hello World</em> tab.</p>
  </div>
  </div>
