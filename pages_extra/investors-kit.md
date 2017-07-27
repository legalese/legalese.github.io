
[block:html]
{
  "html": "<fancyblockquote>\n&ldquo;These are really smart people,&rdquo; said one lawyer who works with startups. &ldquo;They believe in world-domination of the engineering class; everything can be reduced to an algorithm, and legal documents are not going to be spared.&rdquo;\n  <div class=\"source\"><a target=\"_blank\" href=\"http://techcrunch.com/2015/01/10/documents-just-want-to-be-free/\">TechCrunch, January 2015</a></div>\n</fancyblockquote>"
}
[/block]

# Insight: Contracts Want To Be Code
Recent advances in machine learning have enabled a crop of LegalTech startups that
productize computational linguistics and natural language processing (NLP): examples include Lex Machina and Ross Intelligence.

In May, at FutureLaw 2016, hosted by Stanford’s Center for Legal Informatics, a panel session pointed out that NLP was only one approach: the other is contract formalization and computation. This confirmed our intuition and our approach. Rather than trying to extract semantics from English contracts (at FutureLaw we counted five players in that space), we go the other way: we consider contracts to be programs. First we express their semantics in a formal language, then we compile into English.

Now it’s a problem in software engineering! There are a lot of people who know how to solve problems in software engineering. We programmers have arsenals of tools and techniques that lawyers can’t even begin to comprehend!

Getting technical for a moment: Legalese’s tech stack rests on a domain-specific language optimized for expressing obligations, permissions, and prohibitions. We call it L4. We write a compiler for L4. The compiler is able to compile statements written in L4 into English-language contracts. The compiler’s static analyzer can automatically detect conflicts within and between contracts. We write “reference libraries” of “programs” in L4, which turn into investment agreements, shareholders agreements, directors’ resolutions, members’ resolutions, ESOP contracts, and so on. We augment the compiler to output to Ethereum, thus providing the world’s first formally verified programs to run on the blockchain – a feature valuable in the financial world. We extend the compiler to output other natural languages, to provide multi-lingual contracts – a feature valuable for cross-border transactions. We write a scenario visualizer so you can see what a contract means and does, not just what it says. We write a runtime monitor that evaluates contract traces and business events for conformance and, in the case of breach, blame assignment.

That’s a lot of IP. This is a deep tech startup productizing computer science, not a consumer tech startup hacking out a music-sharing app for teenagers. It’ll take time and a lot of thinking. We’re working to develop a partnership with NUS, NTU, and I2R to deliver some of the above components, with funding from NRF.

Note that the intended customer is an end-user. Not a lawyer. Not a law firm. Our “full stack” vision is so compelling that already we have one lawyer (quit her day job) and several law students (learning to program) on our team.


# So ... why Legalese?
Gosh. That's a lot of [Prior Art](/v1.0/page/prior-art-and-alternatives)  Law firms serving startups. Startups eating law firms. Is there really a reason to launch yet another effort?

Well, yes. Two reasons, actually.
1. Almost all the prior art is aimed at the US market. Americans enjoy the second-largest economy in the world. One language, one currency, one legal jurisdiction (assuming Delaware). But if you don't live in the US, you're on the outside looking in. There are startups in Singapore and entrepreneurs in Europe who need tools like these. But American myopia means they'll need to fend for themselves. Hence Legalese.

2. Being hackers, we take a righteously opensource attitude to software development. We're not against startups. Indeed, our first agreements are aimed at serving startups. Indeed, we will soon launch Legalese as a service startup, following in the footsteps of Github. We'll monetize on premium features: a Template Editor, a PDF generator, a Template Store. But the core codebase is opensource, and any hacker who wants to create their own agreements, or submit pull requests over existing agreements, is welcome to do so.


# The Vision
These articles survey the LegalTech space and point to the long-term vision of Legalese:

* [Breaking The Law &emdash; Financial Times](http://www.ft.com/cms/s/0/c3a9347e-fdb4-11e5-b5f5-070dca6d0a0d.html#axzz45iKAu8vS), Michael Skapinker, April 11, 2016.
* [What if we developed legal contracts like we developed software applications?](https://medium.com/@ConsenSys/what-if-we-developed-legal-contracts-like-we-developed-software-applications-1b5bc8fbb915#.uoiiqx9ku) &emdash; Guest post by Joe Dewey, April 6, 2016.
* [Bessemer reviews their LegalTech portfolio](http://www.lawtechnologytoday.org/2014/12/smart-startups/) December 16, 2014.
* [Six Reasons the Legal Industry is Ripe for Startup Invasion](http://tech.co/legal-industry-startup-invasion-2013-03) March, 2013.
* [2016 Report on the State of the Legal Market](https://peermonitor.thomsonreuters.com/wp-content/uploads/2016/01/2016_PM_GT_Final-Report.pdf) shows the legal industry in the crosshairs
* [Coindesk describes Barclay's work with Corda](http://www.coindesk.com/barclays-smart-contracts-templates-demo-r3-corda/) and links to some slides about [Smart Contract Templates](https://www.scribd.com/doc/310534422/Smart-Contract-Templates-1).
* [Four Futures of Legal Automation](http://www.uclalawreview.org/four-futures-legal-automation/), UCLA Law Review.


# Our First App: Investment Agreements
Defensible IP lives at the bottom of the stack, but revenue lives at the top. Adobe’s first product was PostScript. Today it makes money selling apps that ultimately use the same core technology, but are directly user-facing apps.

What applications will we sell?

Our first app is a SaaS web app that helps entrepreneurs configure and engross all the paperwork required for an angel or seed round – not just term sheets but shareholders agreements, corporate resolutions and amendments, rights notices, and other prerequisites like ESOPs and vesting. All these documents are compiled automatically from high-level, structured expressions.
 
As the category leader we aim to support at least 50% of startup investments happening south of Series A. How many are there? 30,000 to 100,000 each year, globally, depending how you count. Let’s assume those numbers remain high, as more and more startups are founded.

If 25,000 investments per year run through our system, and we are able to charge $100 per deal, we make $2.5M per year – enough to break-even a small company of about 20 full-time employees. 

That’s not counting the opensource contributors who will do the bulk of the work of internationalization and localization: we envision a generation of legal developers who will do with legal contracts what web developers have done for web sites. Many of these legal developers may be trained lawyers opting out of the law-firm partner track, who have picked up programming and learned L4.

That gives us the breathing room to explore new application areas.


# Contributor Licence Agreements
Contributor Licence Agreements are critical to the legal integrity of any opensource project. Most importantly, they describe the copyright and patent licences contributors create and assign to the managers of the project. They come in two main flavours: firstly for the individual contributor, and secondly for the corporate contributor to ensure that copyright and patent claims in employment agreements do not get in the way of contributions to the project.

## Existing Contributor Licence Agreements
* [Google Individual Contributor's Licence Agreement](https://cla.developers.google.com/about/google-individual)
* [Apache Individual Contributor's Licence Agreement](https://www.apache.org/licenses/icla.txt)
* [Openstack Individual Contributor's Licence Agreement](https://review.openstack.org/static/cla.html)

As you can see, most of them are pretty similar. The corporate version for most of these agreements adds an additional clause where the company represents that certain employees are authorised to submit contributions to the project.

## Helpful tools to create Contributor Licence Agreements
* [Build an Agreement based on existing examples, e.g. the GPL or Creative Commons licence.](http://contributoragreements.org/chooser/)
* [A similar tool, again building from existing examples.](http://selector.harmonyagreements.org/)
