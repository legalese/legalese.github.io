---
title: "Why Computational Law, Part III: Computational Law Has Joined the Chat"
excerpt: "Moving from syntax to semantics to pragmatics—how a domain-specific language for law will transform contracts from legalese to provably correct, multi-lingual, self-executing code."
coverImage: "/assets/blog/content/entering-chat.png"
date: "2017-01-03T00:00:00.000Z"
author:
  name: "Legalese Team"
  picture: "/assets/logos/legalese-logo.png"
ogImage:
  url: "/assets/blog/content/entering-chat.png"
---

> "The day should come, when it will come I don't know, but the day should come, when you will be able to feed a set of facts to a machine that has cases, rules of law, and reasoning rules stored in it, and in which the machine can then lay out for you, step by step, the reasoning process by which you may be able to arrive at a conclusion."
> — Reed Lawlor at the *First National Law and Electronic Conference*, October 1960

---

## Our Original Motivation

*(or how we got the idea to represent contracts as code)*

Once upon a time, a programmer received an investment contract containing the following text:

> **1.2.1** If the investment for the purpose of the Series B Funding is valued at not more than $32.5 Million, then the investors in the Note shall be entitled to convert the Note into Shares at a fixed valuation of $27.5 million.
>
> **1.2.2** If the investment for the purpose of the Series B Funding is valued at less than $40 million but not below $32.5 million, investors in the Convertible Note will be entitled to convert the Note into Shares at a 15% discount over the valuation of the Series B Funding (for instance, if the series B Funding is at a valuation of $35 million, then the investors in the Note shall be entitled to convert at a valuation of 35M less 15% discount);
>
> **1.2.3** If the investment for the purpose of the Series B Funding is valued at not less than $40 million but less than $47.06 million, investors in the Convertible Note will be entitled to convert the Note into Shares at a 15% discount over the valuation of the Series B Funding (for instance, if the series B Funding is at a valuation of $47.06 million, then the investors in the Note shall be entitled to convert at a pre-money valuation of 40M i.e. $47.06 million less 15% discount);
>
> **1.2.4** If the investment for the purpose of the Series B Funding is valued at not less than $47.06 million but less than $80 million, investors in the Convertible Note will be entitled to convert the Note into Shares at a fixed pre-money valuation of $40 million;
>
> **1.2.5** If the investment for the purpose of the Series B Funding is valued at not less than $80M but less than $100M, investors in the Convertible Note will be entitled to convert the Note into Shares at a fixed pre-money valuation of $45M; and
>
> **1.2.6** If the investment for the purpose of the Series B Funding is valued at not less than $100 million, investors in the Convertible Note will be entitled to convert the Note into Shares at a fixed pre-money valuation of $50 million.

Ten minutes and a strong cup of tea later, the notes in the margin read:

```javascript
// why wasn't this just
if( seriesB < 32.5 ) { conversion = 27.5 }
else if( seriesB < 40 ) { conversion = seriesB * 0.85 }
else if( seriesB < 47.06 ) { conversion = seriesB * 0.85 } // then why the above line?
else if( seriesB < 80 ) { conversion = 40 }
else if(seriesB < 100 ) { conversion = 45 }
else { conversion = 50 }
```

---

## Software is eating the world

Today, software drives our trains, trades our shares, and maps our flight routes. Today, the world's largest [bookstore (Amazon)](http://www.therobinreport.com/amazon-from-earths-biggest-bookstore-to-the-biggest-store-on-earth/), [recruiting company (LinkedIn)](https://theundercoverrecruiter.com/linkedin-competitors/), [direct marketing platform (Facebook)](https://www.newyorker.com/news/john-cassidy/facebook-the-worlds-biggest-direct-marketing-company/), [taxi company (Uber)](https://techcrunch.com/2015/03/03/in-the-age-of-disintermediation-the-battle-is-all-for-the-customer-interface/), [video service (Netflix)](http://fortune.com/2017/11/09/ott-internet-video-netflix-hbo-hulu/), [accommodation provider (Airbnb)](https://eventige.com/how-airbnb-became-the-largest-hotel-chain-without-owning-a-single-hotel/) are all **software companies**.

**Yet the largest law firm is still a law firm** the same way it was 200 years ago.

Today's foremost technology investor [Marc Andreessen said "software is eating the world"](https://www.wsj.com/articles/SB10001424053111903480904576512250915629460). When Andreessen, a software engineer (he co-authored Mosaic and co-founded Netscape) says "*eats*" he probably had something very specific in mind: the "Turing'ification" of an industry is something that only a computer scientist can properly understand.

In Twitter conversation with us, in 2014, he mentioned Judicata and LegalZoom – then said "we're looking for a good one." What does that mean?

Find-a-lawyer marketplaces, download-a-template sites, and e-discovery search engines may be nibbling at the edges of the traditional legal profession, but they aren't eating it, not the way Uber is eating the taxi industry, or the way Netflix is eating TV.

**Today's document automation software is mostly a more full-featured version of Microsoft Word**. Although Legalese sees its roots in document automation, we have our sights set higher and deeper: on deep-tech, computer-science-driven software that will transform the legal industry (not just the legal profession), serving not just lawyers but end users directly as well.

---

## Solution: Computational Legal

*Moving from **syntax** (the structure, form of language) → **semantics** (the actual meanings attached to the words) → **pragmatics** (the context and its effect on outcomes)*

Imagine:

- Contracts in English, Spanish, French, German, Mandarin Chinese, etc – each translation **provably identical** to the others
- Contracts amenable to [testing](https://en.wikipedia.org/wiki/Software_testing) and [formal methods](https://www.quantamagazine.org/20160920-formal-verification-creates-hacker-proof-code/): [static analysis](http://spinroot.com/static/) can prove that a contract is internally consistent, free of contradiction, and complete
- Contracts that self-execute in software, integrated with business processes, interacting with other contracts
- Contracts that easily afford illustrations, use cases, and scenarios, for end-users to reason concretely over

This vision has been expressed by [Nick Szabo (2002)](http://szabo.best.vwh.net/contractlanguage.html), by [Harry Surden (2012)](http://papers.ssrn.com/sol3/papers.cfm?abstract_id=2216866), by [Flood & Goodenough (2014)](https://financialresearch.gov/working-papers/files/OFRwp-2015-04_Contract-as-Automaton-The-Computational-Representation-of-Financial-Agreements.pdf), by [Camilleri, Paganelli, & Schneider (2014)](https://arxiv.org/abs/1406.5691), by [Prisacariu & Schneider (2007)](https://link.springer.com/chapter/10.1007%2F978-3-540-72952-5_11).

Gotta respect the prior art; there's *a lot* of it. In fact, legal informatics goes back at least [70 years](/posts/2017-01-02-prior-art-legal-informatics).

---

## L4: a domain-specific language (DSL) for law

When we borrow Andreessen's adage and say "*software is eating law*", we mean software eating law in a rather specific way: it gets [Turing'd](http://kk.org/thetechnium/2008/03/turingd/), by way of a domain-specific language. (Lawyers, don't worry; [you'll keep your jobs](http://hodgen.com/questions-are-harder-than-answers/), *sorta*)

A domain-specific **programming** language (DSL) for legal means a language that is **designed to capture legal semantics and logic**; a deep-tech computer science approach to law. The DSL does for the [modal calculus](https://en.wikipedia.org/wiki/Modal_%CE%BC-calculus) what [functional languages](https://wiki.haskell.org/Functional_programming) do for the [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus).

The one we're designing and implementing is called **L4**.

Simply put, a DSL means that all legal (and quasi-legal) documents and laws will have a **common denominator for entire suites of future functionality**. The history of computer science informs the future of legal: we can translate entire families of concepts, such as compilation, dependency management, multi-lingual code, linters, code libraries, fuzz testing, unit & integration testing, and even agile development and opensource software communities of practice.

Accompanied by static analysers capable of formal verification, a DSL will enable us to prove, to the extent mathematically possible, that the contracts written in the language are correct, consistent, and compliant with legislative constraints.

The idea of building a DSL for an entire domain is not new; companies like Adobe, Intuit, Autodesk, Cadence – category-owners of their respective fields all started with their own domain specific languages / standards.

As Frederik Pohl might put it, *a good futurist predicts the car; a great futurist predicts the traffic jam.* If the car is a formal language for contracts and agreements (maybe even legislation), then a taxi service might be smart contracts integrated with cryptocurrencies and wholly automated business processes, exposed through legally binding APIs. The traffic jam? Maybe that's a DDOS in the form of micro-contract spam, a welter of frivolous lawsuits, or a zero-day exploit of an error enshrined in some old piece of paperwork that didn't get patched with the latest service pack.

The battery of tools which computer scientists and programmers currently have at their disposal (of which lawyers don't even have an inkling) can be applied to the field of legal. Legalese asserts what [tomorrow's lawyers](https://www.amazon.com/Tomorrows-Lawyers-Introduction-Your-Future/dp/019966806X/) do will look a lot like what today's programmers do: drawing on opensource libraries, they will configure code for clients that compiles to readable contracts – maybe English, maybe Ethereum/Hyperledger.

From that future, we will look back on today's lawyers, drafting agreements in Microsoft Word and checking references by hand, as impossibly quaint, like hand embroidery.

---

*This is Part III of our series on Why Computational Law. See [Part I: The Problem with Legal](/posts/2017-01-01-the-problem-with-legal) and [Part II: 70 Years of Legal Informatics](/posts/2017-01-02-prior-art-legal-informatics).*
