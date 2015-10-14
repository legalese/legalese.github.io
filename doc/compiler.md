# Compiler Family

This is currently (Oct 2015) a research project not yet productized for end-users.

The Compiler converts the canonical DSL representation to one or more target representations, possibly in parallel.

Source language: DSL (see below).

## Compiler Target: Plain English (en-US)

Explains the intent of a given clause in plain English, with American inflections.

## Compiler Target: Plain English (en-UK)

Explains the intent of a given clause in plain English, with British inflections.

## Compiler Target: Plain English (de)

Explains the intent of a given clause in plain German.

## Compiler Target: Legalese 1.0 (en-US)

Lawyer-readable text consistent with traditional (American) contract language.

There could be various dialects. One dialect could be Ken Adams, where the style would be conformant to _Adams on Drafting_.

## Compiler Target: Legalese 1.0 (en-UK)

Lawyer-readable text consistent with traditional (British) contract language.

## Compiler Target: Static Visualization

One or more diagrams illustrating one or more clauses in the contract.

## Compiler Target: Interactive Visualization

Interactive visualization which allows the user to reconfigure the contract.

Outputs updated contract in DSL form.

## Compiler Target: XML

Losslessly exports the DSL representation to an XML template.

This is here as a placeholder -- it's not clear at this time what exactly this means.

## Compiler Target: JSON

Losslessly exports the DSL representation to JSON.

This is here as a placeholder -- it's not clear at this time what exactly this means.

## Compiler Target: YAML

Losslessly exports the DSL representation to YAML.

This is here as a placeholder -- it's not clear at this time what exactly this means.

## Compiler Example

A convertible note usually specifies an interest percentage.

So a lot of the Legalese 1.0 verbiage contains "... shall repay the principal and accrued and unpaid interest".

But suppose the parties negotiate a zero coupon -- no interest. We could awkwardly put in a definition of "Interest Rate shall be 0%" and let the text stand.

That's ugly, though. It's like pluralization text that says "The Borrower(s) shall pay the Lender(s)".

Let's smarten it up. It would be better to intelligently reduce all zero-coupon notes to just say "shall repay the principal".

One way to do that is with a macro: `<span class="underline">PRINCIPALandINTEREST</span>` could be a macro that expands to the correct expression depending on the interest defined elsewhere.

## Language Considerations

So we can do this kind of thing in Lisp and we can do it in Javascript.

Now, do we want to use a functional or a procedural language?
