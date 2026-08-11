---
title: "Ranking Investor Pitch Decks with Neurosymbolic AI"
published: true
excerpt: Ranking pitch decks against investment criteria is a rule application problem, not a language problem — we tested L4 against Oracle Intelligent Advisor to see which engine served the fund's actual intent.
coverImage: /assets/blog/content/2024-09-01-neurosymbolic-investor-pitch-deck-ranking.svg
date: 2024-09-01T00:00:00.000Z
author:
  name: Legalese Team
  picture: /assets/logos/legalese-logo.png
ogImage:
  url: /assets/blog/content/2024-09-01-neurosymbolic-investor-pitch-deck-ranking.svg
---

Legalese and Monad Solutions recently collaborated on a neurosymbolic AI system for sorting and ranking investor pitch decks. The problem is familiar to any fund: hundreds of decks per quarter, each needing assessment against investment criteria — sector, stage, team, market, financials — and a ranked shortlist for follow-up.

ChatGPT handled the language tasks well: extracting structured information from unstructured slide content, summarising team backgrounds, characterising market opportunities. The ranking step was different. Applying investment criteria to produce a consistent score is a rule application problem, not a language problem. We encoded the fund's criteria in parallel — in L4 and in Oracle Intelligent Advisor — and fed ChatGPT's structured output into both engines independently.

The comparison was instructive. OIA had some practical advantages: a mature visual interface, a workflow model familiar to business analysts, and good tooling for generating user-facing decision trees. L4 proved more expressive for complex conditional logic and defeasible rules — situations where one criterion overrides another depending on context. Both produced deterministic, auditable outputs; L4's were more faithful to the fund's actual intent in the edge cases that mattered most. The exercise clarified something we had long believed: the choice of rules engine is not just a technical decision. It shapes what you can express, and therefore what you can enforce.

As with the OIA encoding, the most valuable output was not the ranking itself. It was the clarity the process demanded. You cannot encode a vague rule. The attempt either resolves the vagueness or fails visibly, and both outcomes are useful.
