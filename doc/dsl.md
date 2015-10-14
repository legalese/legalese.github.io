# Domain Specific Language

Nickname: Legalose. Because it's syntactic sugar for legalese.

## Is a DSL Even Necessary?

Numerous papers have observed that [contracts are ripe for formalization](http://www.diku.dk/hjemmesider/ansatte/hvitved/publications/hvitved10flacosb.pdf). A common impulse is to say, "let's design a [DSL](https://en.wikipedia.org/wiki/Domain-specific_language)!"

Not so fast. Nick Szabo (in private correspondence with Meng, 2015) asserted that a custom DSL was overkill and the project could and should be implemented in an existing general-purpose formal language.

Meng is inclined to agree because the larger the installed base of existing developers, the easier it will be to gain wide adoption. Adobe didn't invent a whole new language for scripting their applications -- instead they support AppleScript, VBScript, and ExtendScript (a variant of JavaScript).

Of course, a DSL doesn't have to be black-and-white, all-or-nothing, custom-or-C. It's a spectrum. On that spectrum lies the idea of an existing formal language with a library bolted on to it, or a few overloaded operators added ... that sort of thing.

We'll need a few tries to figure this out.

So, wherever Legalese documentation refers to a DSL, read that to mean the concise, formal, syntax in which the ultimate logic of a contract, and the constraints that bound it, are expressed. It could be Javascript. It could be Prolog, Haskell, or Clojure. Or it could be something that we make up.

## Inspirations

### m4

In the quest to formalize the semantics of a contract, the more fine-grained a template becomes, the longer and unwieldier it becomes. Everything in m4 family of approaches will have this problem.

To solve this problem, a different level of thinking is required. If we move the complexity into a compiler we get to simplify the "program".

### Prolog

Legal regulations are full of constraints which may be best expressed and explored in a logic programming language like Prolog.

For example, Singapore's Companies Act regulation requires shareholder approval for certain corporate actions. Shareholder approval in turn requires certain actions by the directors. Such dependencies can be expressed and evaluated effectively in a language like Prolog.

### LISP

Parties often elaborate contracts by turning simple but vague terms into better defined, more complex clauses. Clauses lengthen. Definitions gain "it depends".
Portions of the contract depend on the evaluation of other portions.

To cope with this situation, it helps to have a fluid boundary between simple data types and functions -- we need to be able to easily upgrade a simple variable to a more complex function. Such a function needs to be able to be evaluated not only in the context of producing the template, but as a first-class object referenceable within the template itself.

For example, an investment agreement may define the conversion price of a security as the lowest of a range of possibilities, and each of those possibilities may need to be expressed and evaluated parametrically.

Homoiconicity may provide the answer.

## Design

### principles

Templating systems are the natural forebears of our system.

Templating systems with inheritance, that is.

### Key Features

1.  Inheritance

    Mason sets the gold standard here, with entire classes of templates. Templates can inherit from and override one another.
    
    But maybe we don't need that.

2.  

### examples

What would a BNF for term sheets look like?
