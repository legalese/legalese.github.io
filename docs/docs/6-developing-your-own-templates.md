---
title: "Tweaking an Existing Template"
layout: "docsidebar"
excerpt: ""
---
You, a **content developer**, tweak an existing template for your own use, using Github. This involves learning a little bit of XML. You publish your template publicly. You instruct Legalese to use your template.

Legalese has a large number of standard available templates. They are listed in the **Available Templates** tab of the spreadsheet. Every time you run `Generate PDFs`, Legalese reads this tab. If it didn't, Legalese wouldn't know where to load the templates that you specified under the CONFIGURATION section in your own Legalese spreadsheet.

So, how do you tell Legalese about those new templates?

Easy. These instructions assume you have created an XML template of your own devising and published it at some public URL. If you're working on a fork or a branch in Github, then this is easy! After you commit your changes and push to your origin branch, Github itself will serve your template publicly. 

1. Navigate using the Github UI to your branch and your file. View the raw source. Grab the URL.

2. Go to the **Available Templates** tab. Set the URL for your template.

3. Remember, your URL has to be accessible by anyone on the Net. Try loading that URL with an Incognito Mode window. If that doesn't work, Legalese won't be able to retrieve your template.

4. Fill in the name of your template and its title. See the other templates on how to fill in the information in the cells.

5. Set the To and CC fields to be the parties that will be signing the agreement.

6. Set `Nocache=1`. If you don't, your development cycle may be slowed, because by default Legalese caches all fetches for 5 minutes.

7. Back in your current terms spreadsheet, under CONFIGURATION, name your template under the Templates: config. make sure that the template name matches the one filled in earlier in the **Available Templates** tab.

8. Also in your current terms spreadsheet, all the way under the CONFIGURATION section, add these two lines and fill in your template information:
    * INCLUDE https://docs.google.com/spreadsheets/d/1rBuKOWSqRE7QgKgF6uVWR9www4LoLho4UjOCHPQplhw/edit#gid=981127052
    * AVAILABLE TEMPLATES

9. You can see an example at the bottom of the **Dev Hello World** tab.

10. Run `Generate PDFs` to see your template in action!
