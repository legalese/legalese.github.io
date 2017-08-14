---
title: "Where is Legalese Headed?"
layout: "default"
excerpt: ""
---

<fancyblockquote>
… before full DAOs, the blocking and tackling of encoding simple business contracts could be a good next step for smart contracts.
<div class="source"><a href="https://twitter.com/balajis/status/750170009138192384">Balaji S. Srinivasan</a></div>
  </fancyblockquote>

We're building the Computational Legal tech stack. At the bottom, we're contributing languages and compilers. At the top, we're making apps.

* v1 and v2 handle all paperwork needed for seed investments. v1 is ready – see [Documentation]({{ site.baseurl }}{% link docs/getting-started.md %}). v2 will launch early 2017.
* v3 is in research stage. We're building L4, a Turing-complete language which satisfies the formalism requirements of [Hvitved 2012](https://drive.google.com/open?id=0BxOaYa8pqqSwbl9GMWtwVU5HSFU).

# Background and Context
* Quora asks, [Would the legal system even benefit from a programming language?](https://www.quora.com/Would-the-legal-system-benefit-from-using-a-programming-language)"  The answers average to a "No."  We take this as [evidence of a golden opportunity](http://www.businessinsider.com/peter-thiel-on-secrets-2014-11?IR=T&r=US&IR=T).
* Hacker News takes up Legal Tech: see ["Github for Lawyers"](https://news.ycombinator.com/item?id=13446275) together with [our response on Medium](https://medium.com/@Legalese/code-is-law-is-code-4492c864f33f).
* People have done formal contract grammars before.  E.g., Lexifi developed [a formal grammar for simple financial contracts](https://www.lexifi.com/product/technology/contract-description-language).  We see this and say, *"Right on.  Let's do it bigger!"*  And we're in luck, as there have been [academic surveys of formal languages for more generic contracts](https://pdfs.semanticscholar.org/5002/76c957028a65503c4b13214515c07abd5d93.pdf).  These are our building blocks.

# Original Motivation

How did we get the idea to represent contracts as code?  Once upon a time, a programmer received an investment contract containing the following text:

<blockquote>
<div class="oldtimey">  
<p>If the investment for the purpose of the Series B Funding is valued at not more than $32.5 Million, then the investors in the Note shall be entitled to convert the Note into Shares at a fixed valuation of $27.5 million.</p>
<p>If the investment for the purpose of the Series B Funding is valued at less than $40 million but not below $32.5 million, investors in the Convertible Note will be entitled to convert the Note into Shares at a 15% discount over the valuation of the Series B Funding (for instance, if the series B Funding is at a valuation of $35 million, then the investors in the Note shall be entitled to convert at a valuation of 35M less 15% discount);</p>
<p>If the investment for the purpose of the Series B Funding is valued at not less than $40 million but less than $47.06 million, investors in the Convertible Note will be entitled to convert the Note into Shares at a 15% discount over the valuation of the Series B Funding (for instance, if the series B Funding is at a valuation of $47.06 million, then the investors in the Note shall be entitled to convert at a pre-money valuation of 40M i.e. $47.06 million less 15% discount);</p>
<p>If the investment for the purpose of the Series B Funding is valued at not less than $47.06 million but less than $80 million, investors in the Convertible Note will be entitled to convert the Note into Shares at a fixed pre-money valuation of $40 million;</p>
<p>If the investment for the purpose of the Series B Funding is valued at not less than $80M but less than $100M, investors in the Convertible Note will be entitled to convert the Note into Shares at a fixed pre-money valuation of $45M; and</p>
<p>If the investment for the purpose of the Series B Funding is valued at not less than $100 million, investors in the Convertible Note will be entitled to convert the Note into Shares at a fixed pre-money valuation of $50 million.</p>
</div>
</blockquote>

Ten minutes and a strong cup of tea later, the notes in the margin read:

```
// why wasn't this just
if     ( seriesB < 32.5 )  { conversion = 27.5 }
else if( seriesB < 40 )    { conversion = seriesB * 0.85 }
else if( seriesB < 47.06 ) { conversion = seriesB * 0.85 } // then why the above line?
else if( seriesB < 80 )    { conversion = 40 }
else if( seriesB < 100 )   { conversion = 45 }
else                       { conversion = 50 }
```

What if contracts could be written in a formal language first, and then compiled to natural language? A simple but powerful idea.  Imagine contracts in English, Spanish, French, German, Chinese – each translation provably identical to the others. Contracts amenable to [testing](https://en.wikipedia.org/wiki/Software_testing) and [formal methods](https://www.quantamagazine.org/20160920-formal-verification-creates-hacker-proof-code/): [static analysis](http://spinroot.com/static/) can prove that a contract is internally consistent, free of contradiction, and complete. Contracts that self-execute in software, integrated with business processes, interacting with other contracts. Contracts that easily afford illustrations, use cases, and scenarios, for end-users to reason concretely over. This vision has been expressed by [Nick Szabo (2002)](http://szabo.best.vwh.net/contractlanguage.html), by [Harry Surden (2012)](http://papers.ssrn.com/sol3/papers.cfm?abstract_id=2216866), by [Flood & Goodenough (2014)](https://financialresearch.gov/working-papers/files/OFRwp-2015-04_Contract-as-Automaton-The-Computational-Representation-of-Financial-Agreements.pdf), by [Camilleri, Paganelli, & Schneider (2014)](https://arxiv.org/abs/1406.5691), by [Prisacariu & Schneider (2007)](https://link.springer.com/chapter/10.1007%2F978-3-540-72952-5_11).

# Even lawyers feel the pain

Howard Darmstadter's [Precision's Counterfeit: The Failures of Complex Documents, and Some Suggested Remedies](http://www.jstor.org/stable/25758526), published in the American Bar Association's *Business Lawyer* journal in 2010, reads like both a clarion call – "there's got to be a better way!" – and a grope in the dark – "one possible idea: don't repeat yourself" – by someone who, being a lawyer not a programmer, has no exposure to the disciplines and possibilities of software engineering and language design. Indeed, he talks about debugging contracts as programs; he talks about testing; he talks about using mathematical notation, even flowcharts, to improve clarity. But as a lawyer he doesn't know where to go next with these ideas. Lawyers don't get CLE credits for reading [Steve McConnell](https://www.amazon.com/Steve-McConnell/e/B000APETRK/). Lawyers haven't heard of [language-oriented programming](https://en.wikipedia.org/wiki/Language-oriented_programming) or [UML](https://en.wikipedia.org/wiki/Unified_Modeling_Language)/[BPML](https://en.wikipedia.org/wiki/Business_Process_Modeling_Language), whose history has much to teach. Yet contracts are, effectively, business process specifications, where they skip over the high-level modelling and go straight to writing a low-level runtime by hand … using a collaboration methodology that could only be described as *pair programming by correspondence*, the way [chess used to be played](https://en.wikipedia.org/wiki/World_Correspondence_Chess_Championship) during the Cold War.

So, even lawyers are begging for this stuff. Who better to give it to them than us computer scientists? After all, we already invented [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself); we have a moral obligation to help them avoid reinventing our wheels.

Besides, programmers know very well the XY problem: "newbies ask how to do Y, when they really want to achieve X, but Y was the first thing that came to mind." Darmstadter describes the problem without knowing its name when he suggests that contracts should try to specify *why* before implementing *how*. Darmstadter alludes to [literate programming](https://en.wikipedia.org/wiki/Literate_programming), again without knowing its name, when he suggests that maybe contracts should include comments, or remarks, to help clarify the intent of a piece of code. The paper is a fun (and cringe-inducing) read.

Some legal thinkers *have* explored correspondences between law and software. These explorations are fruitful: in 2006 Henry Smith considered [Modularity in Contracts: Boilerplate and Information Flow](http://digitalcommons.law.yale.edu/cgi/viewcontent.cgi?article=4050&context=fss_papers). In 2016 Primavera de Filippi and Samer Hassan wrote [From code is law to law is code](http://www.firstmonday.org/ojs/index.php/fm/article/view/7113).

Explorations into other correspondences will prove equally fruitful.

BigLawKM has an essay touching on some of these points: [Smart Contracts and the Role of Lawyers](http://biglawkm.com/2016/10/25/smart-contracts-and-the-role-of-lawyers-part-3-about-lawyering-transactions-on-blockchains/). More practically, thelawlab sketches the future study of law in [The MIT School of Law? A Perspective on Legal Education in the 21st Century](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2513397).

<div class="block-callout block-show-callout  type-info block-show-callout  type-info ng-valid" type="section.type" ng-model="section.data">
  <h3>
    <i class="fa fa-info-circle on" title="Info"></i>
    <i class="fa fa-exclamation-circle " title="Warning"></i>
    <i class="fa fa-exclamation-triangle " title="Danger"></i>
    <i class="fa fa-check-square " title="Success"></i>

    <span class="ng-binding">Premises and Postulates</span>
  </h3>

  <div marked="data.body" class="ng-isolate-scope"><ol>
<li value="1">Consider what programmers do when they write programs.  Consider what lawyers do when they write contracts.</li>
<li value="2">Each world is rich with its own body of practice and disciplines of thought.  And the similarities are striking!</li>
<li value="3">What would it take to wrestle these worlds into conjunction?</li>
</ol>
</div>
</div>

# How is this useful?

## Example: conversion of debt

A startup raises Series A – yay! A stack of convertible notes had been signed a couple years ago, during the seed round. How do the notes convert to equity? What's the conversion price? How many shares will be issued?

In the old days, a lawyer would read each agreement to answer those questions.

With Legalese, the convertible notes contain event handlers. Assuming the Series A is already parameterized in L4, we hand the Series A to the convertible note, and the callbacks automatically compute the share price and produce all the paperwork to effect the conversion.

## Example: Vesting Redemption

A founder leaves a startup during the vesting period. The company has the right to buy back a number of unvested shares. How many? And at what price? And at what date? What does the cap table look like before and after?

In the old days, a lawyer would read the vesting agreement to answer those questions.

With Legalese, the vesting agreement contains event handlers. We call the appropriate callback with details of the departure, and Legalese generates all the paperwork needed to confirm the resignation.

# What Legalese Will Never Do
* Legalese excludes the "computational legal argumentation" field well surveyed by [Prakken & Sartor (2001)](http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.29.1461). Defeasibility is essential to law, lest the law turn monstrous. However, it renders deductive logic [futile](https://newrepublic.com/article/106441/scalia-garner-reading-the-law-textual-originalism). We admire their [prodigious display of brainpower](http://www.sciencedirect.com/science/article/pii/S0004370207000677), wish them [good luck](http://ejlt.org/article/view/13), and retreat to the easier, more deterministic, less controversial end of the spectrum.
* Legalese is not a tool that "allows non-programmers to program." This is a fallacy. See [Essay by Zompist about Programming Languages](https://zompist.wordpress.com/2014/08/31/ask-zompist-programming-languages/) and Paul Ford's magnum opus, [What is Code?](http://www.bloomberg.com/graphics/2015-paul-ford-what-is-code/) An expert who can write legal code in the Legalese DSL, by that act becomes a programmer, just as any magic-user who can combine [two existing pieces of magic](http://www.amazon.com/Nature-Technology-What-How-Evolves-ebook/dp/B002ISDCKW/) to create an original third becomes, even in the smallest degree, a sorcerer.
* Legalese is absolutely not [an expert system that gives legal advice](http://snip.ly/KjEi?utm_content=buffer1569f&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer#https://bol.bna.com/automating-legal-advice-ai-and-expert-systems/).
* Legalese does not fight to get existing legal materials online. That's the job of the [Free Law Project](https://library.columbia.edu/content/dam/librarywebsecure/behind_the_scenes/web_resource_collection/Carver%20-%20Columbia_Web_Archiving_Free_Law_Project.pdf), [Public.Resource.Org](https://public.resource.org/), [FALM](http://www.falm.info/), [OpenLaws](https://www.openlaws.com), and the [LIIs](https://www.law.cornell.edu/world).
* [Legal Ontologies](http://content.iospress.com/articles/semantic-web/sw224) are a huge area of research which we would like to reuse, not reinvent.
* [Ross Intelligence](http://www.rossintelligence.com/) harnesses Watson to do cool things. We don't do deep learning, machine learning, or natural language processing to try to understand natural language contracts.

# Turing-Complete Contracts
The Legalese team has started work on L4, a (yet another) DSL for expressing regulations and contracts. This is a research project. Software eats law in a specific way: it gets [Turing'd](http://kk.org/thetechnium/2008/03/turingd/), by way of a domain-specific language. (Lawyers, don't worry; [you'll keep your jobs](http://hodgen.com/questions-are-harder-than-answers/).)

The goal? To enable a lawyer – better yet, a non-lawyer – to draft a contract more concisely and clearly than they could in a natural language, by writing what looks like computer code. The drafter gets to take advantage of all sorts of ideas from computer science: variables, functions, third-party libraries, syntax and type checking, unit testing, completeness, and consistency. And the drafting community can get ideas from software engineering, like collaborative version control and opensource community support practices. The contract can be tested by fuzzing against future scenarios of breaches, possible legal challenges, and simulated courtrooms.

As Frederik Pohl might put it, *a good futurist predicts the car; a great futurist predicts the traffic jam.* If the car is a formal language for contracts and agreements (maybe even legislation), then a taxi service might be smart contracts integrated with cryptocurrencies and wholly automated business processes, exposed through legally binding APIs. The traffic jam? Maybe that's a DDOS in the form of micro-contract spam, a welter of frivolous lawsuits, or a zero-day exploit of an error enshrined in some old piece of paperwork that didn't get patched with the latest service pack.

Some initiatives are aligned with this vision:
* Stanford's [Computable Contracts Initiative](http://compk.stanford.edu/)
* KWM Law has [good thought leadership](http://www.kwm.com/en/au/knowledge/insights/10-things-you-need-to-know-smart-contracts-20160630) and even a Github repository showcasing [a pseudocode version](https://github.com/KingandWoodMallesonsAU/Project-DnA) of a DSL.
* [ContractCode](http://contractcode.io/)'s Go library has similar ideas, as does [Lexon](https://claryon.github.io/lexon/).
* The [Internet of Agreements](http://internetofagreements.com/) also dovetails with our vision.

# The Business Challenge

Very clever people have thought long and hard about a world in which computers execute contracts, where programs transfer money to people and people transfer money to programs, where decentralized cryptocurrencies disrupt banks and financial institutions. Very clever people will be involved in the effort to build a bridge between formal and natural languages. Many man-years will go into developing a Github/Wikipedia of legal templates that are freely available for all to use.

Legalese is clever in a different way. The business challenge of getting from the 20th-century status quo to the 21st-century promised land requires the ability to scout and climb a monotonically increasing path through multidimensional "value-proposition" space toward the global optimax. This is as much a logistical and business challenge as a computational linguistics challenge. That's why we've chosen to start with spreadsheets: we optimize for the power user while building a painless onboarding pathway for first-timers.

You know how some extreme runners run fifty marathons in fifty consecutive days? Actually running the marathons is one kind of challenge. Arranging the flights, travel, and accommodation so the runner gets from finish line in one city to starting line in another, is a different kind of challenge. Developing a domain-specific language, or a library in which to model contracts, is the former kind of challenge. Making Legalese succeed as a business is the latter kind.

## Natural Language Generation
Text planning and interaction effects are critical to contract generation. One part of a contract may affect another. Sometimes these interactions are simple, and can be represented by a DAG. Sometimes these interactions are, superficially and conventionally, cyclic, and need to be decomposed with some clarity. Metaprogramming helps to correctly represent these interactions.  [CoGenText](http://www.cogentex.com/research/index.html) is an example of an NLG company. See also [GrammaticalFramework](http://remu.grammaticalframework.org/) and [Attempto English](https://en.wikipedia.org/wiki/Attempto_Controlled_English).

## Social Implications of Agile Contracts

(Written as a response to a [thread on HN](https://news.ycombinator.com/item?id=13448195).)

Today's model of contracting is fire-and-regret: spec out as much as you can of the next five or ten years, and when the world changes, litigate.  That's not very agile.  And unfortunately for the non-agiles, Hart and Holstrom won the 2016 Nobel in Economics for [pointing out the futility of the idea of a complete contract](http://www.economist.com/blogs/freeexchange/2016/10/science-deal).


What's the alternative? Hirschman remarked that your [voice sounds loudest when you are closest to exit](https://en.wikipedia.org/wiki/Exit,_Voice,_and_Loyalty).  What if every contract had a maximum term of one year, one month, one day?  What if we treated contracts as an iterated stream instead of an immutable invariant? For example, think about how "no-contract" phone plans have made the telco market more competitive, to the benefit of the consumer.  Power imbalances might be reduced precisely because nobody's locked in: it's a lot easier to break up when you're just dating. After the marriage you might let yourself go.

Software is eating law, but "law is code" is only the first step. Just as the historic transition from proprietary to opensource informs ideas like "Github for law", the historic transition from waterfall to agile will find its analog in the legal and business domains by changing the way we develop and deploy contracts, ultimately driving changes in economic relations.  

Think about how agile development means less software project failure, and less software project failure means less litigation between client and outsourced development vendor.  That's just one example. If better tools and languages mean that we can better transform our intent into specification, we might be forced to be clearer about what we actually do and don't agree on, we might be more honest in our dealings, there might be an actual "meeting of minds", and when things don't turn out the way we expect, rather than blaming the other party, which seems dysfunctional, we embrace change together, and agree to consciously work on the relationship, to improve the next iteration of the contract … which is due to be revised and renewed anyway, next month, not next decade.

<fancyblockquote>
Amber fast-forwards through the dynamic chunks of the README—boring legal UML diagrams, mostly—soaking up the gist of the plan. Yemen is one of the few countries to implement traditional Sunni shari'a law and a limited liability company scam at the same time. Owning slaves is legal—the fiction is that the owner has an option hedged on the indentured laborer's future output, with interest payments that grow faster than the unfortunate victim can pay them off—and companies are legal entities. If Amber sells herself into slavery to this company, she will become a slave and the company will be legally liable for her actions and upkeep. The rest of the legal instrument—about ninety percent of it, in fact—is a set of self-modifying corporate mechanisms coded in a variety of jurisdictions that permit Turing-complete company constitutions, and which act as an ownership shell for the slavery contract. At the far end of the corporate shell game is a trust fund of which Amber is the prime beneficiary and shareholder. When she reaches the age of majority, she'll acquire total control over all the companies in the network and can dissolve her slave contract; until then, the trust fund (which she essentially owns) oversees the company that owns her (and keeps it safe from hostile takeover bids). Oh, and the company network is primed by an extraordinary general meeting that instructed it to move the trust's assets to Paris immediately. A one-way airline ticket is enclosed.
<div class="source">Accelerando, Charlie Stross</div>
</fancyblockquote>
