---
title: "A Real Nondisclosure Agreement"
excerpt: ""
---
[block:callout]
{
  "type": "success",
  "title": "After running this tutorial, you will have",
  "body": "* created a real NDA ready for execution"
}
[/block]
You, a **power user**, choose a real-world docset, and create a real-world agreement, taking advantage of the `INCLUDE` keyword to reuse the entities from a different tab.

1. Look at the row of tabs at the bottom of the spreadsheet.
2. You will see tabs with names like `NDA`, `Entities`, `Incorporation`, `Class F`, and `Seed Round`.
Let's start with a simple agreement: a nondisclosure.
3. Go to the `NDA` tab.
4. Note that one of the section headings is `INCLUDE Hello World`. That tells Legalese to load the `Entities` data from the Hello World tab.
5. Generate PDFs and wait a couple minutes for the PDF to show up.
6. This time, you should see that the PDF is now a nondisclosure agreement.
7. There are two kinds of NDAs: unilateral and bilateral. Change cell B9 to suit, and generate again, if necessary.
8. If you actually want to send a real NDA, update the Entities in Hello Word with real particulars, then repeat the steps from [Tutorial 3](doc:tutorial-3-send-for-signature).



[block:callout]
{
  "type": "info",
  "title": "What does the Counterparty line in the ROLES section mean?",
  "body": "The NDA template uses two parties: the Company, and the Counterparty. Cell B13 says `[Buyer]`, which means: every Buyer is a Counterparty, so Legalese defines Counterparties by substituting the Buyer from the _Hello World_ tab."
}
[/block]