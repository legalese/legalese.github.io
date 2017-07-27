---
title: "Setting up a Developer Environment"
excerpt: ""
---
This page describes the version 1.0 codebase, and comes from the original `README.org` on legalese-google-app.
To start hacking on the Google App internals, you need to set up a development environment.

## Clone a Company Spreadsheet<a id="sec-2-1" name="sec-2-1"></a>

First, clone the *[Legalese Demo Master](https://docs.google.com/spreadsheets/d/1rBuKOWSqRE7QgKgF6uVWR9www4LoLho4UjOCHPQplhw/edit#gid=790633300)* if you haven't already. (If you ran the tutorial, you should have cloned it.) To clone it, click on *File/Make a Copy*. Customize it with the name of some made up company. We will call your copy of the Demo Master a *Company Spreadsheet*.

## Clone the LegaleseMain library.<a id="sec-2-2" name="sec-2-2"></a>

Open the [LegaleseMain](https://script.google.com/a/legalese.io/d/1CaOAsbTSaLPxh2X2CBmSyKhgOw4lVs8f_YoIPDqQp_5YHnsMG2gOgNdD/edit?usp=drive_web) library. That's the [official production library](https://script.google.com/a/legalese.io/d/1CaOAsbTSaLPxh2X2CBmSyKhgOw4lVs8f_YoIPDqQp_5YHnsMG2gOgNdD/edit?usp=drive_web). You don't want to mess with that for development.

Go to *File/Make a Copy*. Now you have a `Copy of LegaleseMain`. That's the version you will edit.

Close the tab for the original LegaleseMain library.

In your copy of LegaleseMain, go to *File/Manage Versions*. Give your version a name like "init", then `Save New Version`.

Open *File/Project Properties*. Copy the "project key". It should look something like `M6YlbsVrWR18KeWvO Mc3708UQWaHMB8in`. If you are lazy you can try grabbing the document ID out of the URL bar but that's not officially supported.

## Point your cloned Company Spreadsheet at your cloned Copy of LegaleseMain.<a id="sec-2-3" name="sec-2-3"></a>

Each Company Spreadsheet has an associated Google Apps Script, which you can get to from *Tools/Script Editor*.

That *Company Script* comes from `code.js`. It doesn't do much; all the heavy lifting happens inside the LegaleseMain script.

Click on *Libraries/Resources*.

`Remove` the existing import of LegaleseMain.

Paste the project key into the `Find a Library` box at the bottom of the dialog. Press `select`.

Set the `identifier` to `legaleseMain`.

Turn on Development Mode.

Hit `Save`.

## Try running the cloned Incorporation tab.<a id="sec-2-4" name="sec-2-4"></a>

Go to your cloned Company Spreadsheet. Reload the browser tab, because the script changed.

Go to the Incorporation sheet. You can find it at the bottom row of tabs. Click on *Add-ons/Generate PDFs*. Google will ask you to authorize the app. Allow.

When the script finishes, an output link should appear in cell E6. Open that link. You should see a bunch of XMLs. Yay! Your cloned Company Spreadsheet is working well against your cloned LegaleseMain library. In a few minutes those XMLs should turn into PDFs.

## It Didn't Work.<a id="sec-2-5" name="sec-2-5"></a>

This section will accumulate Tips & Tricks for handling common failure scenarios along the way to setting up a development environment.

## Try Tweaking Your Cloned LegaleseMain library.<a id="sec-2-6" name="sec-2-6"></a>

With your development copy of the LegaleseMain library open, go to the `LegaleseMain.js` tab. In the vicinity of Line 88 you should see a commented out DoNothing. Uncomment it. Reload your Company Spreadsheet.

If you see the new DoNothing, and calling that function works, then you are now able to make bigger edits! Yay!

# HOWTO push a new version of the library to production<a id="sec-3" name="sec-3"></a>

## Make sure it works in development<a id="sec-3-1" name="sec-3-1"></a>

In your personal development environment you should be confident that your new library code works.

## Run the test suite on dev<a id="sec-3-2" name="sec-3-2"></a>

In the glorious future we will have a test suite that gives us this confidence.

## Paste the new version of your library code into the production [LegaleseMain](https://script.google.com/a/jfdi.asia/d/1CaOAsbTSaLPxh2X2CBmSyKhgOw4lVs8f_YoIPDqQp_5YHnsMG2gOgNdD/edit?usp=drive_web).<a id="sec-3-3" name="sec-3-3"></a>

If you do not have edit rights to this file, you may have to talk to Meng.

## Under *File/Manage Versions*, snapshot a new version<a id="sec-3-4" name="sec-3-4"></a>

Give it a descriptive name.

## Run the test suite on production<a id="sec-3-5" name="sec-3-5"></a>

Is a test suite available? if not, the Glorious Future has not yet arrived.

## If the test suite is not available, test manually using the tutorial.<a id="sec-3-6" name="sec-3-6"></a>

Test it by hand by running through the tutorial as a brand new user.

After cloning the Legalese Demo Master to run the tutorial, under Tools / Script Editor &#x2026; Resources / Libraries, import the latest version of the tutorial.

(You might not need to do this, especially if Development Mode is turned on, but it doesn't hurt.)

If the tutorial doesn't work using the latest version of the script, go back and fix it in dev.

## Update the Demo Master's library version<a id="sec-3-7" name="sec-3-7"></a>

If the tutorial does work using the latest version of the script, then:

In the [script for the production Legalese Demo Master](https://script.google.com/a/jfdi.asia/macros/d/MOvtp1yA4TI3Xrsv4up74DcUQWaHMB8in/edit?uiv=2&mid=ACjPJvF9VLsvHVoGr7KS_JoRwV78ZMohPaEVG9eADoZumpbHRQ5WTTzLPOstHU6pu-N5vaOywUgDQPNz5zHN4W0zYq-uhrFJjS6TBCRjn4oWzeu6mCI9ts4VBI6PW8wMXUUrf08D3bPO1c8), click on *Resources/Libraries* and update the library import to the latest version.

## You're done!<a id="sec-3-8" name="sec-3-8"></a>

# HOWTO debug your script<a id="sec-4" name="sec-4"></a>

If you're getting a red error message when you run a script, grab the logs before they disappear.

Open *Tools / Script Editor*.

In the script source interface, open *View/Logs*. Copy and paste those logs to a text file or email somewhere.

In the script source interface, open *View/Execution Transcript*. Copy and paste the execution transcript.

The logs are output by Logger.log calls. (In Legalese, `xxLog` wrappers are defined in each `.js` library; see the bottom of `util.js`.)

The execution transcript is output by the Google Apps Script system itself.

Usually, the cause of the red error message of death can be found at the bottom of either the logs or the execution transcript, because that's where Google Apps Script gave up.

If you're reporting a bug to a developer, using email or a Github issue, please include both the logs and the execution transcript as attachments in your bug report, and also include the last few lines of both in the body of your report.

## My error is inside an XML template!<a id="sec-4-1" name="sec-4-1"></a>

If the error message brings you to `templates.js`, to the line reading

    var filledHTML = newTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();

Then the error lies inside an XML template instead of a `.js` library. In that case, see [Google Apps on Debugging Templates](https://developers.google.com/apps-script/guides/html/templates#debugging_templates), and good luck on your adventure.

## The logs don't show me enough!<a id="sec-4-2" name="sec-4-2"></a>

Logs and execution transcripts get truncated; the buffer is only so big.

Go into `util.js` in your development version of `LegaleseMain`. You will find a `myLogConfig` object which determines the *Log Filter Level* for each module.

By default, the log filter level is 6. Any log lines with level 1, 2, 3, 4, 5, 6 will appear in the logs.

Inside your module, `xxLog` calls can pass an optional log level parameter. The default log level is 7.

Only unusual or important events are logged with a level below 7.

Routine events are logged with 8 or above.

If you want to debug a particular module, you probably want to view its log events, selectively and temporarily.

In `util.js`, change the log filter level for your desired module to 8. Don't do this in the Git repository; do this in your running instance of LegaleseMain, inside the `util.js` module.

Reduce the log filter level of the other modules accordingly to mute them.

# About the Company Spreadsheet<a id="sec-5" name="sec-5"></a>

A Legalese Company Spreadsheet contains one or more sheets, appearing as tabs:

-   Entities
-   Cap Table
-   Incorporation
-   Seed Round
-   More Rounds

If you cloned the Legalese Demo Master, you will have something that looks like this.

## The Bound Legalese Script<a id="sec-5-1" name="sec-5-1"></a>

In any Legalese Company Spreadsheet, if you go to **Tools / Script Editor**, you will see a bunch of code. This code references the LegaleseMain Library.

### In the future we will release Legalese as a Google Add-On proper.<a id="sec-5-1-1" name="sec-5-1-1"></a>

Then the script won't be bound.

## legaleseMain.js<a id="sec-5-2" name="sec-5-2"></a>

<https://script.google.com/a/jfdi.asia/d/1CaOAsbTSaLPxh2X2CBmSyKhgOw4lVs8f_YoIPDqQp_5YHnsMG2gOgNdD/edit?usp=drive_web>

Every time you update a component, you will need to copy that component from your local editor into the Google App.

## Library Version Management<a id="sec-5-3" name="sec-5-3"></a>

If you make a significant change, you will need to, under Manage Versions, save a new version of the LegaleseMain library.

Then you MUST go to the Legalese Demo Master and in its **Tools / Script Editor** update the lirbray version.

## legaleseSignature.js<a id="sec-5-4" name="sec-5-4"></a>

At present this only works for Meng's account to insert things into EchoSign. It contains his application keys and is therefore not really public.

## Makefile<a id="sec-5-5" name="sec-5-5"></a>

the Makefile inserts Meng's application keys into the actual built legaleseSignature.js.

# Parsing Spreadsheets<a id="sec-6" name="sec-6"></a>

Getting data from a spreadsheet into an internal Javascript representation is the job of a bunch of parsing modules.

## captable.js<a id="sec-6-1" name="sec-6-1"></a>

## readrows.js<a id="sec-6-2" name="sec-6-2"></a>

## templates.js<a id="sec-6-3" name="sec-6-3"></a>

# User Interface Sugar<a id="sec-7" name="sec-7"></a>

We make it easy for parties to fill in their details.

## form.js<a id="sec-7-1" name="sec-7-1"></a>

# The Controller<a id="sec-8" name="sec-8"></a>

End-users usually run commands like **Add-Ons / Legalese / Generate PDFs** directly from the relevant tab of the spreadsheet.

But an administrator who manages several deals or companies at the same time may find it easier to use the Controller interface.

In the Controller, all tabs are listed on a single spreadsheet.

When a command is run, and the current sheet is a controller sheet, the command operates on whatever row is selected. More than one row may be selected.

## controller.js<a id="sec-8-1" name="sec-8-1"></a>

# Utilities<a id="sec-9" name="sec-9"></a>

## util.js<a id="sec-9-1" name="sec-9-1"></a>

## format.js<a id="sec-9-2" name="sec-9-2"></a>

## lingua.js<a id="sec-9-3" name="sec-9-3"></a>

## owl.js<a id="sec-9-4" name="sec-9-4"></a>

# Unused or under development<a id="sec-10" name="sec-10"></a>

## dependencies.js<a id="sec-10-1" name="sec-10-1"></a>

## unused.js<a id="sec-10-2" name="sec-10-2"></a>

## drawCompany.s<a id="sec-10-3" name="sec-10-3"></a>

## svg.js<a id="sec-10-4" name="sec-10-4"></a>

## esop.js<a id="sec-10-5" name="sec-10-5"></a>