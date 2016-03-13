# Domain Specific Language

## Motivation ##

At present, parties proposal legal agreements tend to email contracts in Microsoft Word to each other. This is like teenage warez enthusiasts in 1980 snail-mailing floppy disks to one another, with handwritten instructions to open up a .EXE or .COM file in a hex editor, and to change byte location 0xBEEF from "02" to "44".

Whitehead said:
By relieving the brain of all unnecessary work, a good notation sets it free to concentrate on more advanced problems, and in effect increases the mental power of the race.

We propose L4, a superior notation for expressing legal agreements, so as to increase the mental power of the race.

Previous efforts include FormaLex and CLAN, as well as papers by Szabo and by Hvitved. See the [modeling.org](modeling.org) document for a reading list and the [Turing page](http://legalese.io/turing.html) for prior art.

## This is a Multi-Paradigm, Multi-Level Challenge ##

> A contract can be regarded as a collection of different
> conceptual models that are interrelated, and various
> paradigms can be employed to represent them. At one level
> of abstraction, a contract is an organized collection of
> concepts.
> 
> At another level, a contract is a collection of
> obligations, permissions, entitlements, powers and so on
> (Jones et al., 1992, 1993, 1996; Jones, 1990). These are
> notions that have been studied extensively in legal theory
> (Hohfeld, 1913; Kanger, 1985; Kanger et al., 1966, Lindahl,
> 1977; and many others).
> 
> At a third level a contract can be regarded as a collection
> of procedures (protocols) that specify its operational
> aspects (how the business exchange is to be conducted in
> practice). These have temporal and action aspects that are
> at the core of much current research in Artificial
> Intelligence, Computer Science and Philosophical Logic. And
> from another standpoint still, a contract may be represented
> as a collection of parameters (the parties, the product in
> question, the price, the delivery quantities, the delivery
> date and so on).
> 
> Contractual activities are not all concerned with all
> aspects of a contract. Each focuses on some particular
> parts.
> 
> Alternative views of contracts need to be represented and
> sometimes integrated into a single system to support a
> variety of functions. However, as mentioned earlier,
> information that is not contained in contractual documents
> is also required to support some aspects of contractual
> activity.

http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.36.4777&rep=rep1&type=pdf

## Requirements

This section describes the requirements for the L4 language and associated compiler/interpreter.

We assume the L4 DSL is embedded in a host GPL.

### Novice, Intermediate, Advanced Users

End-users of the L4 language are referred to as L4 programmers.

Novice L4 programmers -- "brogrammers" -- should not need to know the host GPL.

Intermediate L4 programmers can be expected to learn the host GPL.

Advanced L4 programmers can be expected to learn L4 internals.

#### Accessibility to Novices -- Brogrammers ####

Just as 90% of programming is maintenance, 90% of the use cases for L4 will be customization by end-users who just want to dip in to an existing codebase (which they think of as the "template") and make only those tweaks (which they think of as "configuration") necessary to get their job done (the current "deal").

These end-users may be business users, in-house counsel (or someone pretending to be in-house counsel), or junior lawyers in a progressive law firm. We use the collective term "brogrammers" to describe such lay users.

For their sake, an L4 program should be transparent and "self-documenting", in the sense that an intelligent, technically minded individual with no prior programming experience beyond high school C, PHP or Javascript should be able to intuit the syntax and vocabulary of the language from inspection of the code she wants to modify, just as a male native English tourist in France should be able to puzzle out "Toilettes" by similarity, "Femmes" by linguistic root, and "Hommes" by process of elimination, pun intended, ha ha.

### Semantic Representation ###

It should be possible to express in L4, without loss of meaning, the semantics of
- a traditional legal contract
- directors' and members' resolutions
- legislation and regulations

A template has free variables. An instance has bound variables.

Templates turn into instances. Instances turn into output, like a PDF.

### Model Checking and Verification

The L4 engine should detect semantic errors.

The L4 engine should raise a compiler warning in the following circumstances:

- If two clauses of the same document contradict each other.
- If a certain expression is unreachable.
- If a scenario fails to handle all possible input cases.

#### Large Models ####

The universe may span multiple agreements and multiple documents.

Detect conflict across those agreements.

#### Regulatory Compliance ####

It should be possible to express a policy specification in L4. For example, it should be possible to translate the Companies Act into L4.

It should be possible to test a specific contract for compliance with that Act.

### Specification vs Implementation vs Validation ###

An L4 program may express a specification.

An L4 program may implement a contract, in the sense that it may trigger real-world events, e.g. transferring Bitcoin or making an entry in a blockchain, sending PDFs for e-signature, calling against a government filing API, or emailing a notice to counterparties.

Implementation example: parties PA, PB, and PC agree that when A pays B, then C must pay A. Instead of the tedium of PA proving to PC that it has paid PB, the proof of payment could sit in a publicly accessible blockchain, and PC could set a monitor on the blockchain, such that when the proof of payment appears, PC automatically pays PA. The contract itself would trigger the payment, and PA would not need to consciously approve or initiate anything. This is desirable because it allows PA to post selfies to Instagram and browse cat pictures instead: this is progress, by Whitehead's definition: 

An L4 program may validate an event log, auditing a set of past events, or evaluating a proposed scenario (series of future events), and returning an opinion regarding compliance, breach, and current state.

Validation example: "I'm afraid I can't disclose that because I'm under NDA. My lawyer, I mean, my L4 system, told me not to. Sorry!"

#### Derivation of Implementation from Specification ####

It may be possible to derive an implementation from the specification, in the way that a [constraint solver](https://en.wikipedia.org/wiki/Constraint_satisfaction) produces a set of variables that satisfy given constraints. The variables may be an L4 program.

### Syntactic Representation and Negotiability ###

Contracts are the subject of negotiation between parties.

In the pre-L4 world, parties propose patches by emailing Word documents around, with Track Changes turned on.

Programmers have better tools.

In the L4 world, parties using those tools should find the collaboration experience superior to the pre-L4 experience.

There is no need to build a full-fledged negotiation platform. Others are doing that: http://synergist.io/ is just one example.

For the purposes of L4, existing tools that programmers use to communicate changes are sufficient: diffs, Git, comments.

If the language is text-based, with relatively short line lengths, then it will be compatible with the same tools.

### Output to Natural Language

It should be possible to compile an L4 program into one or more natural languages. The initial target is American English, following the style guidelines set out in Adams. The second target is Australian English, following Peter Butts. The third target may be Italian, Chinese, German, or Polish.

### Output to Formal Language

It should be possible to compile an L4 program to an Ethereum source or bytecode form, to the extent that the semantic models correspond.

## Future Requirements ##

Not needed in the current effort but worth keeping in mind for purposes of "futureproofing".

### Projectional Editing (future requirement) ###

In the future, L4 programs should be expressible in visual forms.

The visual form should be editable, and edits should roundtrip back to L4.

For an illustration of projectional editing see
- Intentional Software
- MPS: https://youtu.be/iN2PflvXUqQ?t=13m00s
- Bret Victor, Inventing on Principle: https://vimeo.com/36579366

## Proposed Components and Branding ##

The DSL itself: L4. Refers to both the Lagrangian point and to M4. Also, backformed from the "i18n" and "l10n" convention, if "m4" -> "macro" then "l4" -> "legal".

The Natural Language output of the DSL: Legalese

The optimization engine responsible for syntactic sugar: Legalose

A parser for L4: Legalase

## True DSL or Embedded DSL?

Numerous papers have observed that [contracts are ripe for formalization](http://www.diku.dk/hjemmesider/ansatte/hvitved/publications/hvitved10flacosb.pdf). A common impulse is to say, "let's design a [DSL](https://en.wikipedia.org/wiki/Domain-specific_language)!"

Not so fast. Nick Szabo (in private correspondence with Meng, 2015) asserted that a custom DSL was overkill and the project could and should be implemented in an existing general-purpose formal language.

Meng is inclined to agree because the larger the installed base of existing developers, the easier it will be to gain wide adoption. Adobe didn't invent a whole new language for scripting their applications -- instead they support AppleScript, VBScript, and ExtendScript (a variant of JavaScript).

Of course, a DSL doesn't have to be black-and-white, all-or-nothing, custom-or-C. It's a spectrum. On that spectrum lies the idea of an existing formal language with a library bolted on to it, or a few overloaded operators added ... what they call an [Embedded DSL](http://c2.com/cgi/wiki?EmbeddedDomainSpecificLanguage).

We'll need a few tries to figure this out.

So, wherever L4 documentation refers to a DSL, read that to mean the concise, formal, syntax in which the ultimate logic of a contract, and the constraints that bound it, are expressed. It could be Javascript. It could be Prolog, Haskell, or Clojure. Or it could be something that we make up.

## Inspirations

### m4

In the quest to formalize the semantics of a contract, the more fine-grained a template becomes, the longer and unwieldier it becomes. Everything in the m4 family of approaches will have this problem.

To solve this problem, a different level of thinking is required. If we move the complexity into a compiler we get to simplify the "program".

### Logic Programming

Legal regulations are full of constraints which may be expressed and explored in a logic programming language.

For example, Singapore's Companies Act regulation requires shareholder approval for certain corporate actions. Shareholder approval in turn requires certain actions by the directors.

Such dependencies can be expressed and evaluated effectively in declarative / logical / functional languages like Prolog. Or in some other language which provides an implementation of Prolog, or something close enough, like miniKanren.

### functional / homoiconic

Parties often elaborate contracts by turning simple but vague terms into better defined, more complex clauses. Clauses lengthen. Definitions gain "it depends".
Portions of the contract depend on the evaluation of other portions.

To cope with this situation, it helps to have a fluid boundary between simple data types and functions -- we need to be able to easily upgrade a simple variable to a more complex function. Such a function needs to be able to be evaluated not only in the context of producing the template, but as a first-class object referenceable within the template itself.

For example, an investment agreement may define the conversion price of a security as the lowest of a range of possibilities, and each of those possibilities may need to be expressed and evaluated parametrically.

Homoiconicity may provide the answer.

## Design

### principles

Templating systems are the natural forebears of our system.

Templating systems with inheritance, that is.


### Compilation Considerations ###

#### Vagueness

Sometimes the parties to a contract may disagree about some part of the contract. But a contract is supposed to be an agreement, not a disagreement! Because the parties want to get the larger deal done, they are willing to accept vagueness. They may even desire imprecision! This goes against the principle that a contract should represent a "meeting of minds".

This idea may humourously be related to "lazy evaluation".

Example: "If you do the dishes tonight, I'll take you out to dinner tomorrow." Subsequently, "honey, a McDonald's drive-thru was not my idea of you taking me out to dinner." "But, we're having dinner, and it's take-out."

L4 should allow drafters to specify the degree of vagueness desired in the compile-time natural-language representation of a certain idea.

#### Paratextual Content

Sometimes one party to a contract will plant strategic language in a contract which is non-prima-facie. For example, the party may have no intention of obeying the obligations described in the text they authored, expecting instead to breach it.

Even if they didn't author the text, a party may sign a contract fully expecting to breach it from the very start.

Or the text itself may be struck out by a judge, but the fact that the text exists may influence the course of litigation.

Such content may be considered akin to a deliberate bug, or an attempt to trigger a bug in the interpreter, such as a stack-smashing buffer overflow.

Example 1: "Parents must pick up their children within 30 minutes of the end of school, or face a penalty of $20 per hour per child." That led to parents using schools as daycare, because $20 was cheaper than the market rate.

L4 should allow drafters to include the languge of their choice even if it is in blatant violation of the higher principles of drafting.

L4 should, in "unsafe mode", allow drafters to include arbitrary string literals inline.

## Relation to Modal Logics

A formula consists of a one or more L4 primitives, standing alone or in composition, defined on one or more objects.

Most L4 primitives belong to one or more families of modal logics.

http://fenrong.net/teaching/mljvb.pdf

### Deontic ###

"Party PA shall pay Party PB one dollar."

"Party PA shall not disclose any confidential information to any third party."

### Temporal ###

"36 months after the execution date,"

"Clause CC shall survive any termination of this Agreement."

"If the Major Shareholders fail to exercise in full the right of first refusal within the 10 day period, then the Company will have one hundred twenty (120) days thereafter to sell the New Securities with respect to which the Major Shareholders' rights of first refusal hereunder were not exercised, at a price and upon general terms not materially more favorable to the purchasers thereof than specified in the Company's Notice to the Major Shareholders."

### Epistemic ###

"To the best of its knowledge and belief, Party PP claims the following are true:"

"The foregoing representation is made to the best knowledge (after due inquiry) of Party P1."

## Performative ##

Party PA hereby grants Benefit BB to Party PB.

Let Benefit B1 = a limited power of attorney.

Party PA hereby grants a limited power of attorney to Party PB.

Party PA warrants that Fact FF.

## Transitive Obligations ##

Party A undertakes to procure that Party B shall perform X.

## Contract State ##

Events may cause the contract to move from "valid" state to "breach", "voidable", etc. The contract needs to be able to explain why it is in a particular state.

## Composition ##

An object may have multiple formulae.

The primitives are:
- (temporal) upon, when, while, before, after
- (conditional) if, unless, provided
- (predicate) party
- (performative) warrant, hereby
- (deontic) must, may, mustnot
- (deontic) lest, else
- (scope) defining

In practice, these could be implemented as methods on an object, or functions on a variable.

### Object-Oriented Implementation ###

Any object that supports deontics can run these methods. (Whether it inherits from, fills the role of, or mixes in a deontic class/trait/whatever, depending on your flavour of object oriented programming.)

A typical formula is written like this:

	object.when(world.isRaining())
	      .if  (not object.isFeelingCarefree())
		  .may {object.umbrella.deploy()}
		  .lest{object.isWet(true)}

What looks like method chaining allows us to split the formula over multiple lines. In practice, each deontic method actually returns a formula, so that the formula is curried/carried over to subsequent methods.

It could alternatively be written like this:
	object.deonticFormula(
		when: function() { world.isRaining() },
		if:   function() { not object.isFeelingCarefree() },
	    may:  function() { object.umbrella.deploy() },
		lest  function() { object.isWet(true) },
	);

What does this formula mean? When it's raining, and if you're not feeling carefree, then you open your umbrella. If for some reason the umbrella doesn't work, then you get wet.

The formula *delists* after the `may`-block returns true. We may call this *discharge*.

Each primitive is described below:

	object.upon { upon-block }

The system runs the upon-block many times. It is read-only: it may read from the world but must not write to the world.

If the upon-block returns true, the rest of the formula proceeds once: 

	object.when { when-block }

.if   {   if-block }
		  .may  {  may-block }
	      
if (`when-block` && `if-block`) { may-block }

The `when` block must be pure, except for time, in the sense that it will be evaluated many times.

The `if` block is not expected to be pure; it is expected to perform IO, querying one or more entities. It is memoized. Continuations are supported.

The `may` block always runs after `when` and `if` return true.

	object.must (condition) { block }

	object.must (condition) { block } lest { block }

	object.may (condition)  { } else object.must (condition) { block }

What would a BNF for term sheets look like?

