/**
 * The encoding sections a drafter can run against their legal text.
 * Each section is one isolated AI request (its own conversation)
 * carrying only the document plus — for sections after Ontology — the
 * ontology reply. Sections never see each other's outputs, so every
 * encoding stands on its own.
 */
export interface CompareSection {
  id: string;
  title: string;
  /** Ontology is the world model the other sections build on — always runs. */
  locked?: boolean;
  prompt: string;
}

/**
 * Shared response-style requirements appended to every section prompt.
 * The audience is a legal drafter scanning three model outputs side by
 * side — brevity and structure matter more than completeness of prose.
 */
const RESPONSE_STYLE = [
  "",
  "Response requirements:",
  "- Be brief: open with the first substantive item and close with the last.",
  "- Write for a legal drafter: scannable structure, short headings, the provision reference first in every item.",
  "- Prefer tables and bullet lists wherever they aid side-by-side comparison.",
  "- Keep quotation to the minimum needed to identify a provision, and make each point exactly once.",
].join("\n");

export const COMPARE_SECTIONS: CompareSection[] = [
  {
    id: "ontology",
    title: "Ontology",
    locked: true,
    prompt: [
      "SECTION: ONTOLOGY",
      "",
      "Extract the ontology of the legal text: the objects/types, their attributes, and the constants — essentially a model of the world according to the rules in this text.",
      "",
      "- For each type: a `###` heading with the type name, a one-line description, and a table of its attributes (attribute, type or allowed values, source provision).",
      "- List defined terms as types or attributes where appropriate.",
      "- End with a `### Constants` subsection: fixed values, thresholds, amounts, durations and dates the rules rely on, each with its source provision.",
      "",
      "Model only the world the rules assume — the logic of the rules is encoded separately.",
    ].join("\n") + RESPONSE_STYLE,
  },
  {
    id: "propositional",
    title: "Propositional",
    prompt: [
      "SECTION: PROPOSITIONAL",
      "",
      "Extract the rules of the legal text and express each one as purely propositional logic against the ontology provided above.",
      "",
      "- One paragraph per rule, starting with the provision reference in bold.",
      "- Introduce named proposition letters (e.g. `P1 = the tenant is in arrears`) and then give the encoding using only propositional connectives (∧, ∨, ¬, →, ↔).",
      "- Stay purely propositional; where the natural rule would call for quantifiers, predicates or variables, note what the propositional encoding loses.",
    ].join("\n") + RESPONSE_STYLE,
  },
  {
    id: "predicative",
    title: "Predicative",
    prompt: [
      "SECTION: PREDICATIVE",
      "",
      "Extract the rules of the legal text and implement each one as purely predicative (first-order) logic against the ontology provided above.",
      "",
      "- One paragraph per rule, starting with the provision reference in bold.",
      "- Use quantifiers (∀, ∃), predicates and functions whose names and argument types come from the ontology, followed by a one-line plain-language gloss.",
      "- Keep the encoding purely declarative, leaving deontic and temporal aspects to the Regulative section.",
    ].join("\n") + RESPONSE_STYLE,
  },
  {
    id: "regulative",
    title: "Regulative",
    prompt: [
      "SECTION: REGULATIVE",
      "",
      "Extract the rules of the legal text and implement them as regulative logic against the ontology provided above, highlighting who must do what.",
      "",
      "- One paragraph per rule, starting with the provision reference in bold.",
      "- Make the **actor** and **action** bold in each encoding.",
      "- State the deontic modality (OBLIGATION / PERMISSION / PROHIBITION) and treat it as defeasible: list defeaters, exceptions and priority over conflicting rules.",
      "- State the temporal requirements: deadlines, effective dates, durations, and what happens on breach or lapse.",
    ].join("\n") + RESPONSE_STYLE,
  },
  {
    id: "constitutive",
    title: "Constitutive",
    prompt: [
      "SECTION: CONSTITUTIVE",
      "",
      "Extract the rules of the legal text that are constitutive — rules that create or define institutional facts rather than directing behaviour — and implement them against the ontology provided above.",
      "",
      "- Constitutive rules include: definitions, statuses, powers, and counts-as relations (X counts as Y in context C).",
      "- One paragraph per rule, starting with the provision reference in bold, expressing it as a definition, status-conferral or counts-as rule over your ontology.",
      "- Flag borderline rules that could also be read as regulative (behaviour-directing) and say what tips the balance.",
    ].join("\n") + RESPONSE_STYLE,
  },
  {
    id: "non-operative",
    title: "Non-operative",
    prompt: [
      "SECTION: NON-OPERATIVE",
      "",
      "Render only the content of the legal text that you determined to be non-substantive (non-operative), leaving every operative rule to the other sections.",
      "",
      "- Quote each non-operative passage (condensed where long).",
      "- Label each passage in bold with the class you think it belongs to: **preamble**, **recitals**, **findings**, **purpose**, or **preliminary** (titles, commencement, interpretation aids).",
      "- Add one line per passage on why it is non-operative and what interpretive weight, if any, it carries.",
    ].join("\n") + RESPONSE_STYLE,
  },
];

/** Wraps the pasted/uploaded legal text for the first request of a conversation. */
export function buildDocumentPreamble(docText: string | null): string {
  const intro =
    "You are analysing a piece of legal drafting (legislation, regulation or contract).";
  if (docText === null) {
    return `${intro}\n\nThe legal text is the attached document.`;
  }
  return `${intro}\n\nHere is the full legal text:\n\n<legal-text>\n${docText}\n</legal-text>`;
}
