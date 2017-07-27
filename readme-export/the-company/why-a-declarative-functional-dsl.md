---
title: "Why a Declarative, Functional DSL?"
excerpt: ""
---
# Why are you developing a language? Can’t you just write apps?

In computer science, languages are foundational. If you want differentiated applications, you need a differentiated stack beneath those applications. At the bottom of the stack you will usually find some sort of programming language.

* What was Adobe’s first product? Not Photoshop. It was PostScript: a Turing-complete language for printing. It laid the groundwork for future technologies, like PDF and fonts, and future applications, like Illustrator.
* What was Microsoft’s first product? Not Windows. It was BASIC: a Turing-complete consumer-grade language for home programmers, and the first [high-level programming language](https://backchannel.com/a-spreadsheet-way-of-knowledge-8de60af7146e#.o37cgoaj1) available for the Altair 8800 microcomputer.
* What was Oracle’s first product? An SQL RDBMS: a Turing-complete language (if you add PL/SQL) for data management, now an essential part of every programmer’s toolkit.
* What was Netscape’s first product? A web browser that displayed HTML – Hypertext Markup Language.  What was its second product? Javascript: a Turing-complete language that brought interactivity to the web, now one of the most popular programming languages in the world.
* What do telephone switches and Whatsapp have in common? They run on Erlang/OTP: a Turing-complete functional language for high-availability telecommunications protocols. Every phone call you make, every Whatsapp message you send, runs on Erlang.

* [Spreadsheets](https://backchannel.com/a-spreadsheet-way-of-knowledge-8de60af7146e#.zepgrj4d4) are sort of a programming language. VisiCalc (Apple II), Lotus 1-2-3 (DOS), Excel (Windows): Turing-complete consumer-grade applications for business users to crunch numbers, and the foundation for modern enterprise.

To be pedantic, languages are not quite at the bottom of the stack. There is a sub-basement: mathematics. They call this the [Curry–Howard correspondence](https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence).

[block:parameters]
{
  "data": {
    "0-0": "Mathematics",
    "h-0": "Domain",
    "h-1": "Printing",
    "h-2": "Databases",
    "h-3": "Functional Programming",
    "h-4": "Legal",
    "1-0": "Languages",
    "2-0": "Businesses",
    "0-1": "Bernstein polynomial (1912) Bézier spline (1962, Renault) De Casteljau’s algorithm (1959, Citroën)",
    "1-1": "PostScript (1984–1997), PDF (1993), outline fonts (1985)",
    "2-1": "Adobe, Quark",
    "2-2": "Oracle, PostgresQL, MySQL, MariaDB",
    "2-3": "Ericsson, Whatsapp, Lexifi, AWS SimpleDB",
    "2-4": "*Legalese.com*",
    "1-2": "SQL",
    "0-2": "Relational algebra and tuple relational calculus (E.F. Codd, 1970)",
    "0-3": "Lambda calculus (Alonzo Church, 1930–1940)",
    "1-3": "ML, Lisp, Haskell, Erlang",
    "1-4": "CDL, CSL, L4",
    "0-4": "Modal μ-calculus (Kripke, 1959)"
  },
  "cols": 5,
  "rows": 3
}
[/block]

So it is fair to say: if software is eating the world, where does its appetite come from? From math.


------

This needs to be well-answered.

Highpoints:
* Much fewer runtime bugs!
    * much better compile-time checking!
* compositionality!
* Much fewer logic bugs!
    * formal verification!
    * better testing!


# Where do languages likes C, Go, or Solidity not measure up?
to be answered.

# Comparing Logic vs Functional Programming for Contracts
to be answered