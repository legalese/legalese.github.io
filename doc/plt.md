# Hello potential PLT collaborator!

Rumour has it that _you_, a PL researcher/developer, are interested in _joint research_ with [Legalese](https://legalese.com) in developing a _programming language_ for specifying legal contracts.  This can be thought of as "Verilog/VHDL for Contracts".  Possible outputs from research collaborations are: peer-reviewed academic papers, technical reports, and/or prototype implementations.

How does it involve PLT?  Well, there's already several [logical grammars](#logics-for-contracts) for contracts.  And PLT is needed to unify these grammars into something that could be used for real world contracts---starting with financial and investment agreements.  This can result in popular papers in AI/logic/legal/PLT journals.

## Can this be done?

The legal industry is a suitable domain for implementing a domain-specific programming language because:
* [JSON is not enough](https://medium.com/@Legalese/code-is-law-is-code-4492c864f33f)
* [Read a contract](http://legalese.com/v1.0/page/future#section-original-motivation)---it reads like a program.  Because it is one.
* Programmers/lawyers with a high-level language will [be vastly more productive](https://www.technologyreview.com/s/536356/toolkits-for-the-mind/) than those writing assembly.
* The existing standards are so low---lawyers currently write assembly (legal english) by hand, without any compiler/checker at all!
* [Even lawyers think engineers do it better](https://dl.dropboxusercontent.com/u/3308162/darmstadter%20precision's%20counterfeit%2025758526.pdf)

### What makes this PLT *research* over mere engineering?
* ```>Vi/meng: your assistance is requested here.```

## Why would we want to do this?
The most scientific answer is, "[Because it's awesome](https://www.smbc-comics.com/?id=2088)."  But there's also several business/social reasons why this is a great idea.  Most notably:

* It provides an entrance ramp to the fancy smart-contract future.
* Amazing things become possible like [Globalization 2.0](http://internetofagreements.com/files/WorldGovernmentSummit-Dubai2017.pdf) or regulatory oracles.
* Access to justice for the majority of the population that simply have trouble affording a lawyer.
* Robots will be able to make contracts with other robots.
* Immanentizing STEM-culture hegemony over legal culture.



## The problem
Goal: **We wish to create a DSL that allows programmers specify simple contracts**.  Proposed properties for a contract DSL are:
1. Amenable to Formal Verification techniques.
   Particularly, these three properties for faciliating formal verification:
   * [Strongly typed](https://en.wikipedia.org/wiki/Strong_and_weak_typing)
   * A Turing-incomplete [decidable language](https://en.wikipedia.org/wiki/Recursive_language)
   * Probably a [total functional language](https://en.m.wikipedia.org/wiki/Total_functional_programming)
   * Incorporating some aspects of [CTL*](https://en.wikipedia.org/wiki/CTL*)

2. Initially, an _[embedded DSL](https://cacm.acm.org/magazines/2011/7/109910-dsl-for-the-uninitiated/fulltext)_ of Haskell.
   - Why not something like Coq or Idris?  We personally love academic languages, but we are aiming for mass market adoption to conquer legal drafting the same way Verilog/VHDL conquered circuit design.  We tentatively believe that something Haskell-like is probably the most academic thing that a mass-market will tolerate.  If, empirically speaking, the market will tolerate a language more academic than Haskell, we are in favour of it.



3. Polymorphism (for better developer experience)

Then at some undetermined day in the future...
* Eager-evaluation / "call-by-value" (simpler mental model for devs)
* Dependent Types.

## What do we want the DSL to do that [prior DSLs](#current-high-level-languages-hlls-for-contracts) cannot?
* ```Vi/meng: fill me in!```

## What should the DSL make easy to do?
When designing a DSL, there's always a question of what capabilities to make front and center---i.e., what are the [common design patterns](https://en.wikipedia.org/wiki/Pattern_Languages_of_Programs) in financial contracts?  In short, we don't know yet.  But we suspect their answers can be gotten from distilling [this tome](https://www.amazon.com/gp/product/1614388032?ie=UTF8).
* `Alexis/vi: Fill me in with common design patterns`


## What we have thus far
We tentatively call our prospective language, "L4", but we don't yet have a lot to show.  [Meng Wong](https://www.linkedin.com/in/mengwong/) is currently leading the design of L4, he is easily reached at [collective@legalese.com](mailto:collective@legalese.com).

So far his work is:
* [L4 compiler](https://github.com/legalese/legalese-compiler/) on github
* Monster burger food eating contract in [English](https://github.com/legalese/legalese-compiler/blob/master/sandbox6/monsterburger/README.org#gauntlets-version), [CSL](https://github.com/legalese/legalese-compiler/blob/master/sandbox6/monsterburger/burger1.csl), and now [L4](https://github.com/legalese/legalese-compiler/blob/master/sandbox6/monsterburger/burger1.l4)!

![prototype grammar](https://dl.dropboxusercontent.com/u/3308162/legalese--L4spec.png "the spec")





## Common contract bugs
We don't need to worry about common bugs just yet.  For now just having *any* grammar of contracts would be an immense step forward.

# Prior work
## Logics for contracts
* [Deontic Logic](https://plato.stanford.edu/entries/logic-deontic/)
* [Modal μ calculus](https://en.wikipedia.org/wiki/Modal_%CE%BC-calculus), especially [CTL*](https://en.wikipedia.org/wiki/CTL*)
* [Trace Based Contract Model](https://drive.google.com/open?id=0BxOaYa8pqqSwbl9GMWtwVU5HSFU) (see Chapter 2)
* [Logic in the Theory and Practice of Lawmaking](https://dl.dropboxusercontent.com/u/3308162/Logic%20in%20the%20Theory%20and%20Practice%20of%20Lawmaking.pdf)

## Current High-level-languages (HLLs) for Contracts
* **CSL/CSL+** from [Contract Formalization and Modular Implementation of Domain-Specific Languages](https://drive.google.com/open?id=0BxOaYa8pqqSwbl9GMWtwVU5HSFU)
* **C-O diagrams** from [Analysing normative contracts: On the semantic gap between natural and formal languages](https://gupea.ub.gu.se/bitstream/2077/40725/1/gupea_2077_40725_1.pdf)
* **[Contract Description Language](https://www.lexifi.com/product/technology/contract-description-language)** from Lexify.
* [LegalRuleML](https://www.oasis-open.org/committees/legalruleml/) is an open standard for expressing legal rules (such as legislation) in XML.
* [Contract as Automaton The Computational Representation of Financial Agreements](http://financialresearch.gov/working-papers/files/OFRwp-2015-04_Contract-as-Automaton-The-Computational-Representation-of-Financial-Agreements.pdf)

## On formal verification of contracts
* [Model Checking Contracts -- a Case Study](http://lara.epfl.ch/w/_media/contractlanguage.pdf) also with [slides](http://www.cse.chalmers.se/~gersch/slides-talks/slides-ATVA-07.pdf).
* [FormaLex](http://publicaciones.dc.uba.ar/Publications/2011/GMS11/gms_flacos-2011-tr.pdf), [followup 2017](https://drive.google.com/open?id=0BxOaYa8pqqSwT01LUGdDMjdMRXc).


# Appendix

## Likely partners
* Stanford's [Computable Contracts](http://compk.stanford.edu) group
* [Stephen Chong](http://people.seas.harvard.edu/~chong/) at Hahvahd
* [Data61's Digital Legislation Vision](http://digital-legislation.net/)

## This is cool and all, but how are we going to "compile" to legal English?

There exists a lovely framework for generating multi-lingual natural language from formal grammars.  It's called [GrammaticalFramework](http://grammaticalframework.org).  The plan is to build a dictionary of translation of the smallest "atomic" units of logic to legal, then compose these fragments into larger texts.  This is on hold until we have a suitable DSL.
* [Google Tech Talk](https://www.youtube.com/watch?v=x1LFbDQhbso)
* [GrammaticalFramework SummerSchool](http://school.grammaticalframework.org/2017/) on 14th–25th August 2017
* Book: [Programming with Multilingual Grammars](http://www.grammaticalframework.org/gf-book/)

---

![quote](https://files.readme.io/rTnk3TbHTD2SgvbgRKUj_horiz-quote-black-11.png "the quote")

