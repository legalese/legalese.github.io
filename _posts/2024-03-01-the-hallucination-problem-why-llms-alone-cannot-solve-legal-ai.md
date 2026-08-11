---
title: "The Hallucination Problem: Why LLMs Alone Cannot Solve Legal AI"
published: true
excerpt: A sanctioned lawyer and invented case citations aren't a bug to patch — they're a property of probabilistic systems, which makes them unsuitable, alone, for determinate legal reasoning.
coverImage: /assets/blog/content/2024-03-01-the-hallucination-problem-why-llms-alone-cannot-solve-legal-ai.svg
date: 2024-03-01T00:00:00.000Z
author:
  name: Legalese Team
  picture: /assets/logos/legalese-logo.png
ogImage:
  url: /assets/blog/content/2024-03-01-the-hallucination-problem-why-llms-alone-cannot-solve-legal-ai.svg
---

In June 2023, [a lawyer in New York was sanctioned](https://www.forbes.com/sites/mollybohannon/2023/06/08/lawyer-used-chatgpt-in-court-and-cited-fake-cases-a-judge-is-considering-sanctions/) for submitting a brief that cited cases that did not exist. ChatGPT had invented them — complete with plausible citations and holdings. The lawyer was sanctioned. The incident became the most widely cited cautionary tale about AI in law, and it prompted every major firm to issue a policy centred on one word: verify.

Verification is sensible. But it treats the symptom, not the cause. The problem is not that the model made a mistake — all systems make mistakes. The problem is that the model cannot know it made a mistake. There is no internal check against reality. A language model predicts the next plausible token; it does not execute rules or verify facts.

For legal tasks requiring determinate answers — compliance, eligibility, coverage — the solution is a neurosymbolic architecture: the LLM handles language and context, a symbolic rules engine executes the applicable rules and produces an auditable, deterministic answer. Hallucination is not a bug to be patched. It is a property of probabilistic systems that makes them unsuitable, on their own, for determinate legal reasoning.
