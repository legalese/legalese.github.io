# Compiler Family

Converts the canonical DSL representation to one or more target representations, possibly in parallel.

Source language: DSL (see below).

## Compiler Target: Plain English

Explains the intent of a given clause in plain English.

## Compiler Target: Legalese 1.0

Lawyer-readable text consistent with traditional contract language.

## Compiler Target: Static Visualization

One or more diagrams illustrating one or more clauses in the contract.

## Compiler Target: Interactive Visualization

Interactive visualization which allows the user to reconfigure the contract.

Outputs updated contract in DSL form.

## Compiler Target: XML

Losslessly exports the DSL representation to XML.

## Compiler Target: JSON

Losslessly exports the DSL representation to JSON.

## Compiler Target: YAML

Losslessly exports the DSL representation to YAML.

## Compiler Example

Suppose a convertible note usually specifies an interest percentage.

So a lot of the syntax is like "&#x2026; shall repay the principal and accrued interest".

But what if they agree to a zero-coupon note? We could awkwardly say "The Borrower shall pay an interest rate of 0%" and let the text stand.

That's ugly, though. It's like text that says "The Borrower(s) shall pay the Lender(s)".

Let's smarten it up. It would be better to intelligently reduce all zero-coupon notes to just say "shall repay the principal".

One way to do that is with a macro: <span class="underline">PRINCIPALandINTEREST</span> could be a macro that expands to the correct expression depending on the interest defined elsewhere.

So we can do this kind of thing in Lisp and we can do it in Javascript.
