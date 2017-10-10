_FV_ abbreviates Formal Verification

_MC_ abbreviates Model Checker



# Formal contract systems

These all come from academia.


## CSL (Hvitved, no FV)
*License*:

## FormaLex / FL language
*License*:

They are a class act, but a lot of the source code is in Spanish. :-(

## CL/SCL (language) / CLAN / Anacon / C-O diagrams (Gothenburg, Cammileri, Schneider, which MC?)
*License*:

*Papers*: [google drive](https://drive.google.com/open?id=0BzKTGZrxy40NbklTUWd5bEVTaWc)

Cammileri on limitations of AnaCon, from *A Domain-Specific Language for
Normative Texts with Timing Constraints*:
> The AnaCon [10] framework for contract analysis, based on
the contract logic CL [11], has a similar goal but more limited
scope than the current work. In particular, their underlying
logical formalism contains no direct temporal notions other
than sequencing, and the only kind of analysis possible is the
detection of normative conflicts using the CLAN tool [12].

Cammileri on limitations of SCL, from *A Domain-Specific Language for
Normative Texts with Timing Constraints* (the paper defining it):
> SCL can be seen as a combinator library, where complex
contracts are built by stacking simple well-defined constructors
together. While this makes the semantics and translation easier
to define, it can make modelling normative texts from natural
language less straightforward. In addition, terms in SCL can
quickly become quite large and unwieldy, making them hard
to debug or modify. Thus, we see SCL as more of an
“assembly language” for contract analysis, which other higherlevel
languages or representations could be compiled into for
further processing.
>
> The concepts of obligation O and permission P do not,
at first, seem to be properly differentiated in SCL. Indeed,
semantically they behave in the same way. The reason for
having them as different operators in the language is that
distinguishing between them can be useful when querying
a contract: an unfulfilled obligation is more serious than an
unfulfilled permission.
>
> Another potentially misleading behaviour of SCL is that
prohibition F is only persistent until violated... 
>
> Another limitation of SCL is that the language does not
support the concept of repetition, which would be useful for
modelling recurring contracts, e.g. paying rent every month.
The treatment of actions as instantaneous—that is, taking zero
time to complete—may also be a limiting feature.
> 
> Unfortunately, full verification on our translated NTA when
no trace is given can require more computing time and
resources than is reasonably possible. While we try to mitigate
this as much as possible by providing testing-based alternatives
and the concept of contract compression, this still remains a
significant issue.


## EROP language / CCC / CB2B (Abdelsadiq, extended Promela, Spin MC, Drools rule engine)
*License*: **????** _No evidence of open source_

*Papers*: [google drive](https://drive.google.com/open?id=0BzKTGZrxy40NcXVZWDR0VmMxajg)

_EROP_ name itself comes from Events Rights Obligations Prohibitions

_ECA_ Event-condition-action

_CB2B_ is Abdelsadiq's abbreviation for Contractual Busines-to-Business

_CCC_ is Abdelsadiq's abbreviation for Contract Compliance Checker

## X-Contract language (One FSM per party, Spin MC)
*License*:

Predecessor to EROP. At least one of the inventors is a coauthor of Abdelsadiq's.