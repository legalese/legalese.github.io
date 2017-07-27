---
title: "EchoSign integration"
excerpt: "mostly about third-pary keys"
---
Since EchoSign keys are private, one cannot hardcode them into `readrows.js` and put that on GitHub and Google Apps. Thus, one may build it locally and subsequently upload to Google Apps to ensure security. This page is sourced from `/build/README.org` in legalese-google-app.

Create an echosign-api-keys.json in `/build`, of the form

```javascript
   {
    "default" : { 
            clientId:"XXXXXXXXXXXXXX",
            clientSecret:"YYYYYYYYYYYYYYYYYYYYYYYYY",
            projectKey:"ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ" },
   }
```

When you run make in the parent folder, you should see a `code.gs` in here.

After you upload that as a script in your spreadsheet (Tools / Script editor) you can reload the spreadsheet and you should see new functionality under the Add-ons menu.