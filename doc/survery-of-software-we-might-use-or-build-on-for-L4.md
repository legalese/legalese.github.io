_FV_ abbreviates Formal Verification. _MC_ abbreviates Model Checker.

# Model Checking 

## Friendly license

### NuSMV v2
license: LGPL. "This is an Open Source license that allows free academic and commercial usage of NuSMV."

Is this bounded model checking only? No Timed Automata?

http://nusmv.fbk.eu/index.html

### SPIN
license: BSD 3-Clause open source license

*Looks like goood documentation* http://spinroot.com/spin/Man/

PROMELA is the spec language

"Spin targets the efficient verification of multi-threaded software, not the verification of hardware circuits."

"The tool is one of very few verification tools that supports dynamically growing and shrinking numbers of processes, using a rubber state vector technique."

"Spin can be used as a full LTL model checking system, supporting all correctness requirements expressible in linear time temporal logic, but it can also be used as an efficient on-the-fly verifier for more basic safety and liveness properties. Many of the latter properties can be expressed, and verified, without the use of LTL. 
Correctness properties can be specified as system or process invariants (using assertions), as linear temporal logic requirements (LTL), as formal Büchi automata, or more broadly as general omega-regular properties in the syntax of Spin never claims."


http://spinroot.com/spin/whatispin.html

### Romeo
license: (free) http://www.cecill.info/
(free)

seems bounded only:
"Time Petri nets (TPNs) [1] are a classical time extension of Petri nets. They allow an easy representation of real-time systems features such as synchronization and parallelism. State reachability is decidable for bounded TPNs, which is sufficient for virtually all practical purposes."

http://romeo.rts-software.org/?page_id=2

## Unfriendly license
### HyCOMP
license: non-commercial only.  no mention of commercial licenses.

https://es-static.fbk.eu/tools/hycomp/

### nuXmv
license: non-commericial only. no mention of commercial licenses.

https://es.fbk.eu/tools/nuXmv/

### Kratos
license: "Kratos is available for research and evaluation purposes in an academic environment only. It cannot be used in any commercial environment, particularly as part of any commercial product, without written permission. Kratos is provided as is, without any warranty."

# Modeling/specification systems and FV tools 

## Symbolic Evaluation

implemented in pyL4

## Discrete event dynamic systems
[wiki discrete event dynamic systems](https://en.wikipedia.org/wiki/Discrete_event_dynamic_system)

[wiki discrete event system specification](https://en.wikipedia.org/wiki/DEVS)

This model has useful decidable problems, but I would need more time to determine if it is expressive enough for our purposes. But probably not.
[wiki Finite & Deterministic Discrete Event System Specification](https://en.wikipedia.org/wiki/Finite_%26_Deterministic_Discrete_Event_System_Specification) 

There is also _Symbolic DEVS_.

## K Framework
This could be good, but to assess we need to get over the hump of representing the operational semantics as a rewrite system.

## TLA+
Built for exhaustive model checking of distributed algorithms.

Worried it won't play well with DateTime/TimeDelta, which introduce a lot of usually-superficial nondeterminism that I don’t think TLA+ can handle in a smart (i.e. symbolic) way.

## Alloy


--------------------------------------

# Formal contract systems

These all come from academia.

## Flood/Goodenough
todo

## McMaster

## CSL (Hvitved, no FV)
*License*:

## FormaLex / FL language
*License*:

A lot of the source code is in Spanish. :-( BUT it's quite readable with google translate.

Their actions have duration by default, and are concurrent by default. I believe that was a mistake.

As of Mar 26, 2018, no commits to github repo in 2 years.

## CL/SCL (language) / CLAN / Anacon / C-O diagrams (Gothenburg, Cammileri, Schneider, UPPAAL MC)
*License*:

*Papers*: [google drive](https://drive.google.com/open?id=0BzKTGZrxy40NbklTUWd5bEVTaWc)

_COD14_ abbreviates C-O Diagrams Language from 2014 paper

_COD17_ abbreviates C-O Diagrams Language from 2017 paper

**Note**: CL doesn’t have time contraints, besides sequencing, so I think the languages from the Swedes to compare to CSL and FormaLex are SCL and C-O diagrams.

**Note**: CL/SCL do not seem to support arithmetic, except perhaps in timing constraints in the case of SCL.

**Note**: COD14 had what seems like a major flaw of not being able to distinguish between time constraints as guards on clauses vs time constraints as deadlines.

Cammileri on comparing COD17 to COD14 from 2017 paper:
> Differences from the original include the top-level contract type indicating Main/Aux clauses, the addition of cross-references, ⟙/⟘ as reparations, the distinction between guards and intervals, and the inclusion of predicates as constraints. In addition, our version of C-O Diagrams does not support repetition
 
I do not know the implications of "our version of C-O Diagrams does not support repetition."

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

# Generic model checking / simulating etc systems

## PAT: Process Analysis Toolkit
Developed at National University of Singapore

"An Enhanced Simulator, Model Checker and Refinement Checker for Concurrent and Real-time Systems"