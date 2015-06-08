# Traditional Document Assembler

Given a template, fill the template with variables.

We need to do this in two steps, actually:

The master template is marked up for import into InDesign. In other words, the tags correspond to InDesign styles. That allows us to generate PDFs that look really good.

We maintain XSLT transformations that convert the InDesign-friendly template into an HTML version. This HTML version has less sophisticated markup. It is used for autoconversion into a Google Docs document.

So, the flow looks something like this:

1. compiler produces the InDesign-friendly master template.

2. XSLT converts the InDesign version to an HTML version.

3. the template filler fills in the HTML version, e.g. using Google Apps Script's HTMLTemplate.

4. the template filler fills in the InDesign version, also using the HTMLTemplate. Because that template engine can fill arbitrary text, not just HTML!

5. the HTML version gets filled and autouploaded into Google Docs, followed by some style cleanup.

6. the InDesign version gets filled and pushed through InDesign, maybe InDesign Server, and turned into a bloody handsome PDF.

7. the PDF gets uploaded to Adobe Echosign for signature.
