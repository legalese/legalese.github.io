---
title: "Thirty Years of Legal Informatics"
layout: "default"
excerpt: ""
---

The legal informatics industry is older than most web developers working today.

<fancyblockquote>
Everything &ldquo;THEDAO&rdquo; tried to be, it could have been correctly and in full compliance with the law. For this reason, what blockchain companies should be trying to do is take complex financial, business, and governance processes and turn them into machine-readable protocols that also tick all of the human requirements, legal or otherwise. A bit of code that does all those things is what a smart contract actually is.
  <div class="source"><a target="_blank" href="http://web.archive.org/web/20170312080506/https://prestonbyrne.com/2016/06/20/failing-fast-vs-failing-unnecessarily/">Failing Fast vs Failing Unnecessarily, Preston Byrne</a></div>
</fancyblockquote>

# Why the Status Quo causes pain

<div class="li-inline">
  <ul>
    <li><a href="https://qz.com/932004/the-oxford-comma-a-maine-court-settled-the-grammar-debate-over-serial-commas-with-a-ruling-on-overtime-pay-for-dairy-truck-drivers/">Oxford comma determines a labor dispute</a></li>
    <li><a href="https://www.nytimes.com/2006/10/25/business/worldbusiness/25comma.html">A comma that costs a million dollars</a></li>
    <li><a href="http://www.jstor.org/stable/25758526">Even lawyers know there's got to be a better way</a></li>
  </ul>
</div>

So something has to change.  [Programmers to the rescue](http://medium.com/@Legalese/code-is-law-is-code-4492c864f33f).  But most web developers are used to playing with tech that's only been around a years, even months. Quick hacks are good enough – after all, what's the worst that could happen? Reload the page, if it didn't work, it'll be obvious.

Contracts are different. Once executed, they don't change. Parties can turn hostile  – [as TheDAO discovered](http://pastebin.com/CcGUBgDG). So "move fast and break things" does not apply. Respect the prior art. There's a lot of it.

# Formalizing Contracts

<div class="li-inline">
	<ul>
		<li>
			<a href="https://drive.google.com/open?id=0BxOaYa8pqqSwbl9GMWtwVU5HSFU">Contract Formalisation and Modular Implementation of Domain-Specific Languages</a>, Tom Hvitved's 2012 PhD Thesis, is a key inspiration for Legalese. The first chapter offers a comprehensive survey of prior art in contract formalization.
		</li>
		<li>
			<a href="http://lawreview.law.ucdavis.edu/issues/46/2/Articles/46-2_Surden.pdf">Harry Surden's Computable Contracts, 2012</a>
		</li>
		<li>
			<a href="http://www.fon.hum.uva.nl/rob/Courses/InformationInSpeech/CDROM/Literature/LOTwinterschool2006/szabo.best.vwh.net/idea.html">Nick Szabo, Smart Contracts, 1997</a>
		</li>
		<li>
			<a href="http://compk.stanford.edu/">Stanford's Computable Contracts Initiative</a>
		</li>
		<li>
			<a href="http://iang.org/papers/ricardian_contract.html">The Ricardian Contract</a>, 2004, relates legal language with executable code via parameterization
		</li>
		<li>
			<a href="http://arxiv.org/abs/1608.00771">Smart Contract Templates by Christopher D. Clack, Vikram A. Bakshi, Lee Braine, 2016</a> describes goals very similar to ours
		</li>
		<li>
			<a href="http://arxiv.org/pdf/cs/0106005.pdf">The Representation of Legal Contracts by Daskalopulu &amp; Sergot</a>
		</li>
		<li>
			<a href="https://spiral.imperial.ac.uk/bitstream/10044/1/529/1/Using%20the%20event%20calculus.pdf">Using the Event Calculus for Tracking the Normative State of Contracts</a>
		</li>
		<li>
			<a href="http://www.cse.chalmers.se/~gersch/icail09.pdf">Abstract Specification of Legal Contracts, Prisacariu &amp; Schneider</a>
		</li>
		<li>
			<a href="http://www.cse.chalmers.se/~gersch/slides-talks/slides-CL-ModelChecking.pdf">Towards a Formal Language for Electronic Contracts</a> describes CL
		</li>
		<li>
			<a href="http://folk.uio.no/gerardo/ifm2009.pdf">Challenges in the Specification of Full Contracts</a>
		</li>
		<li>
			<a href="https://gupea.ub.gu.se/bitstream/2077/40725/1/gupea_2077_40725_1.pdf">Analysing Normative Contracts</a> by <a href="http://www.cse.chalmers.se/~cajohn/academic.html">John J. Camilleri</a>
		</li>
		<li>
			<a href="http://www.cse.chalmers.se/~gersch/my-publications.html">Many other publications by Gerardo Schneider</a> in association with the <a href="http://cosodis.project.ifi.uio.no/">COSoDIS</a> project, using CL for <a href="http://www.cs.um.edu.mt/svrg/Tools/CLTool/Papers/ictac2009.pdf">automatic conflict detection</a>
		</li>
		<li>
			<a href="http://remu.grammaticalframework.org/contracts/diagrams/">c-o diagrams</a>/
		</li>
		<li>
			<a href="https://www.financialresearch.gov/working-papers/files/OFRwp-2015-04_Contract-as-Automaton-The-Computational-Representation-of-Financial-Agreements.pdf">Contract as Automaton</a> by Flood and Goodenough
		</li>
		<li>
			<a href="http://hdl.handle.net/10443/1814">Abubkr Abdelsadiq (2013) at Newcastle</a> published a toolkit for model checking contracts, using SPIN / Promela rather than Uppaal
		</li>
		<li>Regarding model checking, see also FormaLex linked elsewhere on this page. They published about formalizing the Argentinean Customer Protection Act, in 2017.
		</li>
		<li>
			<a href="http://www.ai.rug.nl/~verheij/AI4J/papers/AI4J_paper_9_agarwal.pdf">Toward Machine-Understandable Contracts</a>, 2016, by Sudhir Agarwal1, Kevin Xu, John Moghtader at Stanford, defines CDL, Contract Definition Language (implemented in Prolog), part of work at <a href="http://compk.stanford.edu/">the Stanford Computable Contracts initiative</a>
		</li>
		<li>
			<a href="https://link.springer.com/chapter/10.1007%2F978-3-319-07443-6_18">These Are Your Rights</a>: A Natural Language Processing Approach to Automated RDF Licenses Generation
		</li>
		<li>
			<a href="http://ieeexplore.ieee.org/document/7774648/">A Domain-Specific Language for Normative Texts with Timing Constraints</a>
		</li>
		<li>
			<a href="https://www.researchgate.net/publication/311651290_Reasoning_about_Partial_Contracts">Reasoning about Partial Contracts</a>
		</li>
		<li>
			<a href="http://rbsla.ruleml.org/docs/37910209.pdf">ContractLog</a>
		</li>
		<li>
			<a href="https://en.wikipedia.org/wiki/Attempto_Controlled_English">Attempto Controlled English</a> is an example of a formal/natural hybrid language which could be a compiler target.
		</li>
		<li>
			<a href="https://en.wikipedia.org/wiki/Semantics_of_Business_Vocabulary_and_Business_Rules">Semantics of Business Vocabulary and Business Rules</a> is a hybrid formal/natural language for business operation and compliance which could also be a compiler target.
		</li>
		<li>
			<a href="http://richard.myweb.cs.uwindsor.ca/PUBLICATIONS/NLI_LFP_SURVEY_DRAFT.pdf">Realization of Natural Language Interfaces Using Lazy Functional Programming</a>
		</li>
		<li>
			<a href="http://wiki.ruleml.org/index.php/RuleML_Home">RuleML</a> e.g. <a href="https://pdfs.semanticscholar.org/ebca/1f32ac887a975b60552920b9b1be619a87a2.pdf">Modelling Contracts Using RuleML</a>
		</li>
		<li>
			<a href="https://www.w3.org/community/odrl/">ORDL</a>
		</li>
		<li>
			<a href="http://www.omg.org/spec/DMN/">DMN: Decision Model and Notation</a>
		</li>
		<li>
			<a href="https://docs.camunda.org/manual/7.4/reference/dmn11/feel/">FEEL: Friendly Enough Expression Language</a>
		</li>
		<li>
			<a href="http://ceur-ws.org/Vol-1417/paper8.pdf">RuleLog</a>
		</li>
		<li>
			<a href="https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=legalruleml">LegalRuleML</a> is an OASIS Technical Committee.
		</li>
		<li>
			<a href="https://www.w3.org/community/odrl/">ODRL</a>
		</li>
		<li>
			<a href="https://www.w3.org/2016/poe/wiki/Main_Page">W3C POE WG</a>
		</li>
		<li>
			<a href="https://iptc.org/standards/rightsml/">RightsML</a>
		</li>
		<li>
			<a href="http://www.estrellaproject.org/">The Estrella Project</a> attempted to "develop and validate an open, standards-based platform allowing public administrations to develop and deploy comprehensive legal knowledge management solutions."
		</li>
		<li>
			<a href="https://github.com/RinkeHoekstra/lkif-core">LKIF</a>, an OWL, came out of Estrella.
		</li>
		<li>
			<a href="https://link.springer.com/chapter/10.1007/978-3-642-24690-6_2">Formal Methods as a Link between Software Code and Legal Rules</a>
		</li>
	</ul>
</div>

# Other efforts

<div class="li-inline">
	<ul>
		<li>
			<a href="http://www.ibtimes.co.uk/barclays-smart-contract-templates-heralds-first-ever-public-demo-r3s-corda-platform-1555329">CLACK at UCL</a> (<a href="http://clacklang.org/">clacklang.org</a>), which may inform <a href="http://www.ibtimes.co.uk/r3-extends-collaboration-smart-contract-templates-summit-1570121">R3's work</a> (see <a href="static1.squarespace.com/static/55f73743e4b051cfcc0b02cf/t/5784f5dbebbd1aba2d3e400e/1468331499513/R3+Smart+Contract+Templates+Summit+_FINAL.pdf">slides</a>)
		</li>
		<li>
			<a href="https://www.lexifi.com/product/technology/contract-description-language">Lexifi's MLFi was one of the earliest commercializations of financial contract formalization</a>
		</li>
		<li>
			<a href="https://medium.com/@ConsenSys/what-if-we-developed-legal-contracts-like-we-developed-software-applications-1b5bc8fbb915#.uoiiqx9ku">Joe Dewey's essay</a> on <a href="http://contractcode.io//">ContractCode</a>, April 6, 2016
		</li>
		<li>
			<a href="http://commonform.github.io/">CommonForm</a>
		</li>
		<li>
			<a href="https://medium.com/@PaxDirectory/codex-a-legal-scripting-language-e3723cc76662#.neyprdp7o">Codex</a> by Pax is a scripting language for Ethereum; <a href="http://bitlegal.io/2016/03/03/codex-a-new-smart-contracts-language/">in concert with Pax Directory</a>
		</li>
		<li>
			<a href="http://www.restatement.org/">Restatement</a> by Jason Boehmig, Tim Hwang, and Paul Sawaya. (<a href="https://blog.law.cornell.edu/voxpop/2014/06/03/rough-consensus-running-standards-the-restatement-project/">intro essay</a>; see also <a href="https://github.com/legalese-io/legalese-io.github.io/blob/master/doc/modeling.org#background-reading">Modeling - Background Reading</a>)
		</li>
		<li>
			<a href="http://www.commonaccord.org/">CommonAccord</a> has some <a href="https://docs.google.com/document/d/1jm9t61JnqLqsV50cD9Mzwyu8cXWRmVFaI2XK-UaFggk/pub">early thinking</a> online.
		</li>
		<li>
			<a href="http://law.mit.edu/">Law.MIT.edu</a> takes a social-science approach to examining law: see <a href="https://www.youtube.com/watch?v=G2_1I9aUwgs">Dazza's video</a>.
		</li>
		<li>
			<a href="http://www.governatori.net/research/pubs/defeasible.html">Guido Governatori</a> has published extensively on defeasible logic.
		</li>
		<li>There is a W3C Working Group on <a href="https://www.w3.org/2016/poe/wiki/Main_Page">Permissions and Obligations Expression</a> which has published an <a href="https://www.w3.org/TR/vocab-odrl/">ODRL Vocabulary and Expression</a> draft standard.
		</li>
		<li>This is close to <a href="http://wiki.ruleml.org/index.php/RuleML_Home">RuleML</a> and <a href="https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=legalruleml">LegalRuleML</a>.
		</li>
		<li></li>
		<li>The urge to formalize goes back at least as far as <a href="https://en.wikipedia.org/wiki/Alphabet_of_human_thought">Leibniz</a>.
		</li>
		<li>
			<a href="https://www.law.ox.ac.uk/business-law-blog/blog/2016/07/smart-contracts-bridging-gap-between-expectation-and-reality">Bridging the gap between expectation and reality</a> compares smart vs traditional contracts.
		</li>
	</ul>
</div>

# Formalizing Law
The idea of developing calculi for the legal world goes back to at least the 1980s, when the [British Nationality Act was encoded in Prolog](http://opim.wharton.upenn.edu/~sok/papers/s/p370-sergot.pdf). See also [FormaLex](http://publicaciones.dc.uba.ar/Publications/2011/GMS11/gms_flacos-2011-tr.pdf) for an LTL-compatible deontic approach. A recent (2015) survey can be found in [Logic in the Theory and Practice of Lawmaking](http://www.springer.com/gp/book/9783319195742).

The following can be read as a quick introduction to corporate structures and legal agreements for the working programmer.

## Modeling Entities
1. A corporation or a company may be completely represented as a data structure. More precisely: those aspects of a corporation which have to do with its nature as a legal entity may be captured by a data structure comprising state information. Over time, the state changes: as a corporation acquires directors, investors, employees, ESOPs, and other contractual counterparties, the data structure evolves. Such state changes to the data structure are analogous to git commits or to database transactions.
2. Each major change in the evolution of a corporation may be modeled with the language of git releases and tags. Each intended change may be modeled with the language of issues and milestones. What, in git, we call a remote origin master corresponds to, in corporate law, a [state registry of corporate details](http://www.acra.gov.sg/).
3. Alternatively, these changes can be modeled with a bitemporal database—ACID CRUD. Either way, formal structure can apply.
4. Changes to the corporate data structure are formalized in shareholders' and directors' resolutions, and by executed contracts. Putting signatures on paper is *execution*.
Legalese talks about corporations. Similar modeling is also needed for trusts, non-profits, etc.

## Modeling Execution (as in signing)
1. Automated legal reasoning is a hard problem. Corp sec is possibly the easiest practical domain of application.
2. Corporate paperwork often requires signatures on multiple documents. Related documents may be modeled by a directed acyclic graph: if a prerequisite document is not signed, its dependents are invalid.
3. The DAG may be computed algorithmically. The paperwork may be generated automatically.
With the advent of electronic and digital signatures, the execution of such paperwork may be managed online. Reminders may be sent automatically. If execution is in progress, the state of the dependency graph may be examined in fine detail by parties at any time.
4. Execution may require the observation of certain formalities which shade into the content and structure of the contract. For example, a novation needs to have *n_orig + n_new* parties involved. A deed needs to be phrased in a particular archaic way (the [&ldquo;Stevie Wonder phrasing&rdquo;](https://www.youtube.com/watch?v=inXC_lab-34)) to be valid.
5. A particular document may be a collection of resolutions, or a contract.

* [Knowledge-Based Systems and Legal Applications](https://play.google.com/store/books/details?id=ST2jBQAAQBAJ&rdid=book-ST2jBQAAQBAJ&rdot=1&source=gbs_vpt_read&pcampaignid=books_booksearch_viewport)
* [Stash](https://stashcrypto.com/) has self-executing smart contracts
* [Ethereum](https://ethereum.org/) is obviously all over this.

<div class="block-callout block-show-callout  type-warning block-show-callout  type-warning ng-valid" type="section.type" ng-model="section.data">
  <h3>
      <i class="fa fa-info-circle " title="Info"></i>
          <i class="fa fa-exclamation-circle on" title="Warning"></i>
	      <i class="fa fa-exclamation-triangle " title="Danger"></i>
	          <i class="fa fa-check-square " title="Success"></i>

    <span class="ng-binding">Of course law firms think clarity and end-user empowerment are terrible ideas</span>
      </h3>

  <div marked="data.body" class="ng-isolate-scope"><p>You would too, if you had a busy contract drafting practice on the one hand, and an even busier dispute resolution practice on the other, both billed by the hour!</p>
  </div>
  </div>
  
## Modeling Contracts: Drafting
While execution is concerned with the relations between contracts, and does not look into the body of a contract beyond the parties and the **signatures**, drafting is concerned with the content of contracts.

1. Natural-language contracts often look like somebody trying to program without knowing any programming languages.
2. To a programmer, the [structure of a contract](http://www.weagree.com/book/124-Structure+and+presentation+of+contracts.html) reveals familiar ideas. The *preamble* is a high-level [comment block](https://en.wikipedia.org/wiki/Comment_(computer_programming) that may declare [assertions](https://en.wikipedia.org/wiki/Assertion_(software_development)). The *definitions* section declares [variables](https://en.wikipedia.org/wiki/Variable_(computer_science)) and [constants](https://en.wikipedia.org/wiki/Constant_(computer_programming)). The *conditions precedent* define, well, [preconditions](https://en.wikipedia.org/wiki/Precondition). The *main clauses* describe the [happy path](https://en.wikipedia.org/wiki/Happy_path). The *breach/damages* clauses handle exceptions. The *term* clause defines a timeout. And so on.
3. Few contracts use basic [structured programming](https://en.wikipedia.org/wiki/Structured_programming) idioms. Most complex contracts read like [spaghetti code](https://en.wikipedia.org/wiki/Spaghetti_code)–[object/machine code](https://en.wikipedia.org/wiki/Object_code) whose control flow jumps all over the place, from one clause reference to another.
4. Some contracts are (inadvertently or deliberately) [obfuscated](https://en.wikipedia.org/wiki/Obfuscation_(software)).
5. [Imprecisions](http://www.musicindie.com/news/1284) abound. [Bugs](http://www.adamsdrafting.com/the-contract-drafting-error-that-gave-tommy-lee-jones-an-extra-10-million/) result.
6. The idea of drafting agreements in a [high-level language](https://en.wikipedia.org/wiki/High-level_programming_language) is not new: in many situations, parties negotiate a term sheet; once agreement is reached, they hand it to a lawyer to expand into definitive documentation, which the parties sign without reading; the long-form version is only read when it is being executed in the context of conflict resolution.
7. If a contract could be written with the rigor of a software program, it would be amenable to [formal methods](https://en.wikipedia.org/wiki/Formal_methods) and other value-adds, like graphing and [scenario visualization](https://techcrunch.com/2016/08/10/algolia-wants-to-bring-transparency-to-service-level-agreements).
8. A *Legalese contract*–one written in a high-level language–could be compiled to a natural language. Obviously, the situation calls for a compiler, perhaps paired with a [domain-specific language](https://en.wikipedia.org/wiki/Domain-specific_language).
9. Such a compiler would [produce natural language contracts](https://en.wikipedia.org/wiki/Natural_language_generation) that were backward-compatible with the legacy industry. Such backward-compatibility is valuable for lawyers, judges, and laypeople who aren't able to read the high-level DSL.
10. A Legalese contract could be compiled to *multiple* natural languages. Each version would be provably identical. This would be valuable in [multilingual environments](http://europa.eu/pol/mult/index_en.htm).
11. A Legalese contract could be forward-compatible with the newfangled gewgaws coming down the pike, like Ethereum.
12. Whenever you talk about semantics, ontologies come up. See [Olog](https://en.wikipedia.org/wiki/Olog), [LKIF](https://github.com/RinkeHoekstra/lkif-core), and [FIBO](https://social-biz.org/2013/10/18/how-fibo-will-clean-up-finance/)

## Modeling Social Practice
What if lawyers started working more like programmers?

<fancyblockquote>
Software engineering teams often need to integrate new team members, fix bugs, and refactor existing code, which are all tasks that require a deep understanding of code written by others who are often no longer available to provide support or clarification. These requirements suggest that the tools used by software engineers to track progress, monitor potential vulnerabilities, or simply gain an understanding of an existing software codebase may be useful for serving the same functions when applied to legal code.
<div class="source"><a href="http://digitalcommons.law.umaryland.edu/cgi/viewcontent.cgi?article=1246&context=jbtl">Law is Code, 2015</a></div>
</fancyblockquote>

1. Opensource dynamics might lead to the development of reusable, public, clause libraries, published under an MIT, BSD, GPL, or CC license.
2. Legal templates and precedents [might end up on Github](http://www.legal500.com/assets/pages/gc/summer-2015/business-thinking-github.html#sthash.3soEUMps.PmE2Gozv.dpbs).
3. End-users might bypass the priesthood of lawyers, and draft their own contracts.
4. Corporate secretaries could go the way of the [switchboard operator](http://www.boredpanda.com/extinct-jobs/) or [tax preparer](http://m.cfoinnovation.com/story/8229/future-work-death-accountant-and-auditor).
5. Confidence in the codebase could arise from the bazaar model of contract development ("[given enough eyeballs, all bugs are shallow](https://en.wikipedia.org/wiki/Linus%27s_Law#By_Eric_Raymond)"), from reputation systems, and other transparent, crowd-sourced mechanisms.

See Also
* <a href="https://blog.abevoelker.com/gitlaw-github-for-laws-and-legal-documents-a-tourniquet-for-american-liberty/">github for laws</a></li>



## Modeling Regulations
1. As the richly interpretable saying goes, "Law is Code". ([MIT 1](https://mitsloan.mit.edu/shared/ods/documents/Lo_2014_LawIsCode.pdf&PubID=11133), [MIT 2](http://courses.csail.mit.edu/iap/lawiscode/)) and, conversely, [Code is Law](http://harvardmagazine.com/2000/01/code-is-law-html).
2. Legislative and regulatory constraints may be modeled using a declarative language.
3. Contracts and execution relations may be [automatically produced](https://en.wikipedia.org/wiki/Automatic_programming) as satisfactions of constraints.
4. [Oracle Policy Automation](http://www.oracle.com/us/products/applications/oracle-policy-automation/policy-automation/overview/index.html) does this commercially. [Carl Malamud](https://en.wikipedia.org/wiki/Carl_Malamud) and [Thomas Bruce](https://www.linkedin.com/in/tombruce/) might argue that this should be done in an open way.
5. Xcential's [LegisPro](http://xcential.com/legispro/) helps legislators get their words out in XML.

<div class="li-inline">
	<ul>
		<li>
			<a href="http://www.let.rug.nl/basile/papers/WynerEtAlCCBoxerJURIX2012.pdf">An Empirical Approach to the Semantic Representation of Laws</a>
		</li>
		<li>
			<a href="http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.461.4022&rep=rep1&type=pdf">On Rule Extraction from Regulations</a>
		</li>
		<li>
			<a href="http://opim.wharton.upenn.edu/~sok/papers/s/p370-sergot.pdf">The British Nationality Act as a Logic Program</a>
		</li>
		<li>
			<a href="http://wyner.info/research/Papers/2012/WynerOnBench-CaponEtAl1987.pdf">Logic Programming for Large Scale Applications in Law</a>
		</li>
		<li>
			<a href="http://www.lrec-conf.org/proceedings/lrec2010/workshops/W23.pdf">LREC2010 Workshop Proceedings</a>
		</li>
		<li>Conferences include <a href="http://jurix.nl/">JURIX</a> and <a href="http://www.kl.i.is.nagoya-u.ac.jp/jurisin2016/">JURIS Informatics</a>
		</li>
		<li>
			<a href="http://dblp.uni-trier.de/db/conf/jurix/jurix2016.html">JURIX 2016</a>
		</li>
		<li>
			<a href="http://www.ai.rug.nl/~verheij/AI4J/">Artificial Intelligence for Justice</a>
		</li>
		<li>
			<a href="http://www.iaail.org/">ICAIL (IAAIL)</a>
		</li>
		<li>
			<a href="https://www.youtube.com/watch?v=XQgqFr6JuTE">FutureLaw 2014: Forging an Open Legal Document Ecosystem</a>
		</li>
		<li>
			<a href="https://www.youtube.com/watch?v=KBI8_tv2VDM&list=PL48E61C121CAD0E1B&index=46">FutureLaw 2013: Computational Law and Contracts</a>
		</li>
		<li>
			<a href="https://www.youtube.com/watch?v=KLAE_SKMeAY">Harry Surden, Computable Contracts, 2011</a>
		</li>
		<li>
			<a href="https://www.youtube.com/watch?v=efr9VctcMe8">New Breakthroughs in Computational Law, 2013</a>
		</li>
		<li>
			<a href="https://www.youtube.com/watch?v=peU756mYfjQ">FutureLaw | The State of the Art of Legal Technology Circa 2015</a>
		</li>
		<li>
			<a href="https://github.com/mpoulshock/HammurabiProject">Hammurabi Project</a> hosts its DSL in Wolfram Language (Mathematica). An <a href="https://github.com/mpoulshock/hammurabi">earlier version</a> developed a DSL called Akkadian.
		</li>
		<li>You've heard of <a href="https://en.wikipedia.org/wiki/XBRL">XBRL</a>, now the SEC wants <a href="http://lambda-the-ultimate.org/node/3922">Python</a>.
		</li>
		<li>Also <a href="https://en.wikipedia.org/wiki/FpML">FpML</a>
		</li>
	</ul>
</div>

## Modeling Performance
* [Monitoring multi-party contracts for e-business, Lai Xu](https://pure.uvt.nl/portal/files/594971/xu.pdf)
* [Formal Specification of Web Service Contracts for Automated Contracting and Monitoring](https://www.computer.org/csdl/proceedings/hicss/2007/2755/00/27550063b.pdf)
* [A Contract Compliance Checker, Ioannis Sfyrakis](http://homepages.cs.ncl.ac.uk/carlos.molina/home.formal/IoannisSfyrakisDissertation2012.pdf) shows an Event-Condition-Action language called EROP
* [Eris:legal](https://erisindustries.com/components/erislegal/) brings compatibility with smart contracts

## Formal Verification of Smart Contracts

Formal methods and languages like [Agda](http://dl.acm.org/citation.cfm?id=2841316), [Idris](http://cufp.org/2014/t5-edwin-brady-idris-practical-software-verification-with-Dependent-types.html), [Why3](http://why3.lri.fr/), and [CoQ](https://coq.inria.fr/), not to mention specification languages like [Z](http://formalmethods.wikia.com/wiki/Z_notation), hold much promise.

On the spectrum of software reliability, smart contracts ought to live near-mission-critical or life-critical software – cryptosystems, human-crewed spacecraft, hospital equipment. Today, they're closer to enterprise web-apps.

The need for formal systems is dawning on r/ethereum:
* [Can we please never again put 100m in a contract without formal correctness proofs?](https://www.reddit.com/r/ethereum/comments/4oimok/can_we_please_never_again_put_100m_in_a_contract/)
* [The bug which the "DAO hacker" exploited was *not* "merely in the DAO itself"](https://www.reddit.com/r/ethereum/comments/4opjov/the_bug_which_the_dao_hacker_exploited_was_not/)
* Ethereum's Solidity [is also experimenting with formal verification](https://gist.github.com/chriseth/c4a53f201cd17fc3dd5f8ddea2aa3ff9).
* [This list of languages with compile into the EVM](https://github.com/pirapira/awesome-ethereum-virtual-machine#programming-languages-that-compile-into-evm)

Papers include:
* [Certified Symbolic Management of Financial Multi-party Contracts](http://hiperfit.dk/pdf/icfp15-contracts-final.pdf)
* [Safer smart contracts through type-driven development](http://publications.lib.chalmers.se/records/fulltext/234939/234939.pdf)
* [Evaluation of Logic-Based Smart Contracts for Blockchain Systems](https://www.researchgate.net/publication/303679677_Evaluation_of_Logic-Based_Smart_Contracts_for_Blockchain_Systems)
* Validation and Verification of Smart Contracts: a Research Agenda. Daniele Magazzeni, Peter McBurney, William Nash. IEEE Computer Journal, Special Issue on Blockchain Technology for Finance. September 2017
* [Formal Verification of Smart Contracts: Short Paper](http://dl.acm.org/citation.cfm?id=2993611)

Startups include:
* [Adjoint.io](http://www.adjoint.io/)
* [123.ai](http://123.ai/)
* [kadena.io, with PACT](http://kadena.io/pact/)

Legalese wants to apply the same ideas to legacy-compatible contracts – even those that do not live on the blockchain.

# Now what?

The research continues, under the umbrella of projects like [MIREL](http://www.mirelproject.eu/method.html).

Built on all this research is [the LegalTech Industry Today](present).
