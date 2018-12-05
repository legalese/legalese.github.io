# I'd love to contribute to Legalese in some way!

Welcome! It's very nice of you to express such interest in us. This document will walk you through every step required to become a functioning contributor to the Legalese open-source effort.

Naturally, different people will be able to start at different points in the guide: if you find that you've done all the work in one step, feel free to skip to the next one (duh).

*NOTE*: It is still vitally important to read every step. There may have been something you missed, and we'd like all of you to be equally up to date and ready.

# Notation in this README - what do symbols/words mean?

- When there is a PLUS sign (`+`), it is an ADDITION sign: do BOTH this AND this. When something like `Command + Spacebar` comes up, it does not mean press the Command key, Plus Key and Spacebar Key. It means press the Command and Spacebar keys together.
- A REPOSITORY is a collection of code on GitHub that's organised into a distinct entity for a specific purpose. Think of it like a project or a collection of paperwork for a business deal.
- Text highlighted in `grey` is `code`. When there are instructions to type in something that is highlighted in `grey`, copy and paste exactly as it is typed. Do not omit spaces. When I say type in `git clone `, I mean type in `git clone ` _with the space at the end_.
- The instruction to RUN an instruction means to type that instruction into your Terminal, and press the Enter key. For example, the instruction to run `ls` tells you to type in `ls` in your Terminal, and to press the Enter key afterwards.

## 1. Get access to Legalese's work resources

### a. Set up a GitHub account

Most of our work is here, on GitHub. GitHub helps us keep track of who's done what, store different versions of our documents, and hosts the source code for our projects.

So you'll need an account to start contributing changes to our code!

1. On [GitHub](https://github.com), click Sign Up. Use whichever email you'd like, and set a password and username.

2. The next page says 'Verify Account'. Click Create Account.

3. Choose the Free plan. Click Continue.

4. Answer the profile questions on the next page if you like.

5. You now have a GitHub account! Nice.

### b. Get access to Legalese's organisation.

1. Sign up, blah blah, see private repos.

# Cool, I can see what you guys did. How do I actually make changes?

Welcome to [Git](https://git-scm.com/)! It's a version control software (something like Word's track changes, but like a thousand times more powerful).

You'll need to have Git on your computer to work on our files.


## 2. Get Git

### For Mac users:

1. Open the Terminal program. It will be in your Applications folder. Alternatively, pressing Command + Spacebar will bring up Spotlight, and just type 'Terminal' in there, and press Enter.
2. This opens a _terminal prompt_, and you should see a flashing cursor in the new Terminal window.
3. Run `which git`.
4. You should see something like 
```
git is /usr/local/bin/git
```
5. Congratulations, you have Git. If you don't, you won't see any message like the above printed out, and instead your cursor will travel to the next line with no output.
  a. In this case, visit [Git](https://git-scm.com/), which should have a Download For Mac button somewhere near the bottom right. Follow the instructions from the installer.
  b. Quit your Terminal with Command + Q, and open it again. When you run `which git`, it should show you the message printed above.
   
### For Windows users:

1. [Git for Windows](https://gitforwindows.org/) is your best bet. Download it and install it.
2. For the purposes of the rest of this README, whenever there's a reference to a command run inside the Terminal, you'll do the same inside your Git Bash terminal.

## 3. Set up your SSH keys

SSH keys are basically personal identification bits of code that tell GitHub that yes, it is really you trying to make some changes to code on GitHub. You need to set up your SSH keys so that you can make changes to our code.

Visit these pages in order, and follow the instructions on them *EXHAUSTIVELY*. Do not skip any step.

Don't skip steps. I'm serious.

1. https://help.github.com/articles/checking-for-existing-ssh-keys/ - this will help you check whether you already have a key ready for use.
2. https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/ - if you don't, create one and add it to your key-agent. This is sort of like adding a visa stamp to your passport.
3. https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/ - add that key to your account.

Congratulations, you can now identify yourself with GitHub from the Terminal!

## 4. Get a text editor

You're not going to be working in Word: you'll need a text editor.

I recommend [Atom](https://atom.io/), because it's fuss free. Go download and install it.

## 5. Get whichever repository you're going to be working on

1. Navigate to the correct repository. As an example, we're going to use the repository that contains code for Legalese's website: [legalese.github.io](https://github.com/legalese/legalese.github.io).
2. On the right-hand-side of the screen, there should be a bright green button that says Clone or download. Click it.
3. A little popup should be displayed.
  a. Does the title say Clone with SSH? Copy the text in the field, which should look like this: `git@github.com:legalese/legalese.github.io.git`
  b. Does the title say Clone with HTTPS? The text in the field is not what we want. Click on Use SSH in the top right hand corner of the popup, and follow step 3a.
4. Go back to your Terminal window. Type `git clone `, and press Command + V to paste the copied text from step 3a. Press Enter.
5. There should be some 1337 goings-on in your Terminal that tells you something is cloning something. Enjoy the show, it's going to take a while for this repository (there's a lot of images). Feel free to alt-tab out and do something else.
6. After two minutes or so, go back to your Terminal window. There should be a `done` somewhere. If there isn't, `git` isn't done. If there is, you've just cloned (downloaded) our website code!
7. Open up Atom, or another text editor that you chose. Feel free to open the files and examine them: your `legalese.github.io` folder should be in your Home folder on Mac, or your User folder, on Windows.

## 6. Learn some Terminal commands

1. We're going to learn a new command here for the Terminal called `cd`. It lets you change your directory location in your Terminal, in very much the same way you navigate up and down your Dropbox folders in Finder or Windows Explorer.
2. We invoke `cd` with something called an _argument_: we tell `cd` where we want to go. In this case, we want to go into the folder that contains the Legalese website code you just cloned in step 5.
3. Since the name of the repository is `legalese.github.io`, `git` has by default cloned it into a directory called `legalese.github.io`. To get into that folder, we simply run `cd legalese.github.io`.
4. The second new command we will learn is `ls`. `ls` tells us what is in the folder we're currently in.
5. Run `ls`. We now see a list of files. Most of them end in `.html`, because that is the file format for webpages.
6. How do we go back up to the previous folder? We run `cd ..`. `..` means the parent folder of whichever folder you're in.

## 7. Make some changes

For contributors, we don't automatically accept all the changes you make: there's a review process called a _pull request_, where you submit some code for review before we absorb them.

How do you make a pull request?

1. To prevent changes you make from affecting our code before we accept it, we use the power of Git, and the idea of [branches](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging). Essentially you work on a separate version of the code and make changes there. When you submit a pull request, we can see the changes you've made, and if we approve it, we can merge your changes back into the `master` branch - the canon.
2. For contributors, you'll be working on the `contributors` branch. Go back to your Terminal window, and go back to your `legalese.github.io` folder.
  a. If you can't find it, run `cd`. Then run `ls`. These two steps made you go back to your root directory (which is the Home folder on Mac/User folder on Windows), which contains your `legalese.github.io` repository. Then run `cd legalese.github.io`. You're now in your local copy of the repository.
3. Run `git status`. It should say something like `on branch master`. This is holy canon. Do not make changes to the holy canon. Make changes to the `contributors` branch.
4. To switch branches, run `git checkout contributors`. `git checkout` tells git to switch branches to the argument coming afterward, which in our case will be `contributors`.
  a. Is there an error which tells you that Git can't find a branch called `contributors`? It's @jobchong's fault. Email him at jobchong@gmail.com, or message him on Slack. He will create the branch for you to work on. Feel free to snigger at his incompetence.
5. Once you've checked out `contributors`, you need to run `git pull`. This _pulls_ the latest changes to the code from GitHub.
6. Then run `git rebase master`. This bases the `contributors` branch on the `master` branch, which keeps it up to date on the latest holy canon.
7. Open up your text editor, and make whatever changes necessary. Save your changes.
8. We're now going to make a commit - essentially a note in the history of the repository that says, at this date, Contributor made this changes.
9. Go back to your Terminal window. Run `git add .`. This tells Git to notice all your changes and add them to the commit you're about to make.
10. Type `git commit -am `, and after that space type in your _commit message_. Keep it short and sweet and as descriptive as possible: for example, 'Corrected typos in the LegalTech Industry section'. Press Enter.
11. Run `git push origin contributors`. A `git push` tells Git to _push_ your changes to GitHub, so that other people can see them and include them in their work too.
  a. If this is your first time running `git push`, you need to run `git push -u origin contributors` instead.
12. Go to the `legalese.github.io` repository on the GitHub website. Click New pull request.
13. Click on the compare: box to the right, and select the contributors branch.
14. The title of the pull request should be automatically your commit message. Feel free to change it if you like. Add a description if it helps to describe what you did. On the right, select the relevant reviewers based on whoever gave you the task to do.
15. Click Create pull request. You're done! We'll review your changes and get back to you (if there's something we'd like you to change) or accept the pull request (if you did great).

# *IMPORTANT*

Your basic workflow every time you make changes is steps 4 to 14 above. You will execute every single step in sequence.

# You're basically done!
