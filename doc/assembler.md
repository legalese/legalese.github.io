# Traditional Document Assembler

Given a template, fill the template with variables, and convert it to one or more output formats.

Templates may start life in a variety of input formats.

As of Oct 2015, templates start life as Google Apps Script XML documents. There is no external DTD. We made up the XML schema mostly according to InDesign's import requirements.

Actually, the source templates are one step before XML. They contain markup that looks like `<?!= data.xmlRoot() ?>`. Those strings are evaluated by Google Apps's [native HTML templating engine](https://developers.google.com/apps-script/guides/html/templates) which we repurposed for use with XML. That's how variables and text fragments are expanded.

Once the template has been filled, it's ready for import into InDesign. Most of the tags in the XML correspond to InDesign paragraph and character styles. InDesign allowss us to generate PDFs that look really good.

# Future Formats

In the future it would be nice to offer more template formats than just XML. Because lawdevs may prefer a WYSIWYG editor to build templates -- raw XML may be too much to ask.

In the future it would be nice to offer more output formats than just INDD and PDF. Because InDesign's PDFs look really good, but aren't editable.

For additional output formats, the obvious candidates are [Word](https://github.com/legalese-io/legalese-io.github.io/issues/28) and [Google Docs](https://github.com/legalese-io/legalese-io.github.io/issues/29).

# Future Input Formats

Can we use Word and Google Docs as input formats as well? Or do we want to construct our own editing UI for lawdevs to edit templates? What do existing document automation web interfaces look like?

## Work On Output Formats

It might be possible to build XSLT transformations that convert the InDesign-friendly template into other output formats. In early 2015 Meng wrote some code to mark-down the XML template into HTML for parallel filling.

The flow looked something like this:

1. compiler produces the InDesign-friendly master template.
2. XSLT converts the InDesign version to an HTML version.
3. the template filler fills in the HTML version, e.g. using Google Apps Script's HTMLTemplate.
4. the template filler fills in the InDesign version, also using the HTMLTemplate. Because that template engine can fill arbitrary text, not just HTML!
5. the HTML version gets filled and autouploaded into Google Docs, followed by some style cleanup.
6. the InDesign version gets filled and pushed through InDesign, maybe InDesign Server, and turned into a bloody handsome PDF.
7. the PDF gets uploaded to Adobe Echosign for signature.

That feature got deprecated pretty quick because it felt icky to do the XML->HTML conversion at the template level; Meng felt that the XML->HTML conversion should happen after the templates were filled, not before.
