/**
 * The encoding sections a drafter can run against their legal text.
 * Each section is one AI request; within a column they run in order,
 * so later prompts can refer back to the ontology the model
 * established in the same conversation.
 */
export interface CompareSection {
  id: string;
  title: string;
  /** Ontology is the world model the other sections build on — always runs. */
  locked?: boolean;
  prompt: string;
}

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
      "Do not restate the rules themselves; only model the world they assume.",
    ].join("\n"),
  },
  {
    id: "propositional",
    title: "Propositional",
    prompt: [
      "SECTION: PROPOSITIONAL",
      "",
      "Extract the rules of the legal text and express each one as purely propositional logic against the ontology you established above.",
      "",
      "- One paragraph per rule, starting with the provision reference in bold.",
      "- Introduce named proposition letters (e.g. `P1 = the tenant is in arrears`) and then give the encoding using only propositional connectives (∧, ∨, ¬, →, ↔).",
      "- No quantifiers, predicates or variables — propositional logic only. Where the natural rule needs them, note what the propositional encoding loses.",
    ].join("\n"),
  },
  {
    id: "predicative",
    title: "Predicative",
    prompt: [
      "SECTION: PREDICATIVE",
      "",
      "Extract the rules again, but now implement each one as purely predicative (first-order) logic against the ontology you established above.",
      "",
      "- One paragraph per rule, starting with the provision reference in bold.",
      "- Use quantifiers (∀, ∃), predicates and functions whose names and argument types come from your ontology, followed by a one-line plain-language gloss.",
      "- Keep the encoding declarative — no deontic or temporal operators in this section.",
    ].join("\n"),
  },
  {
    id: "regulative",
    title: "Regulative",
    prompt: [
      "SECTION: REGULATIVE",
      "",
      "Extract the rules once more, but implement them as regulative logic against your established ontology, highlighting who must do what.",
      "",
      "- One paragraph per rule, starting with the provision reference in bold.",
      "- Make the **actor** and **action** bold in each encoding.",
      "- State the deontic modality (OBLIGATION / PERMISSION / PROHIBITION) and treat it as defeasible: list defeaters, exceptions and priority over conflicting rules.",
      "- State the temporal requirements: deadlines, effective dates, durations, and what happens on breach or lapse.",
    ].join("\n"),
  },
  {
    id: "non-operative",
    title: "Non-operative",
    prompt: [
      "SECTION: NON-OPERATIVE",
      "",
      "Render only the content of the legal text that you determined to be non-substantive (non-operative). Do not include any operative rules.",
      "",
      "- Quote each non-operative passage (condensed where long).",
      "- Label each passage in bold with the class you think it belongs to: **preamble**, **recitals**, **findings**, **purpose**, or **preliminary** (titles, commencement, interpretation aids).",
      "- Add one line per passage on why it is non-operative and what interpretive weight, if any, it carries.",
    ].join("\n"),
  },
  {
    id: "constitutive",
    title: "Constitutive vs. Regulative",
    prompt: [
      "SECTION: CONSTITUTIVE VS. REGULATIVE",
      "",
      "Classify every rule in the legal text as constitutive or regulative.",
      "",
      "- **Constitutive** rules create or define institutional facts: definitions, statuses, powers, counts-as relations (X counts as Y in context C).",
      "- **Regulative** rules direct behaviour: obligations, permissions, prohibitions.",
      "- Produce two lists, one per class. One line per rule: provision reference, the rule in a few words, and why it falls in that class. Flag borderline rules and say what tips the balance.",
    ].join("\n"),
  },
];

/** Wraps the pasted/uploaded legal text for the first request of a conversation. */
export function buildDocumentPreamble(docText: string | null): string {
  const intro =
    "You will analyse a piece of legal drafting (legislation, regulation or contract) across several encoding sections, one request per section, in this conversation.";
  if (docText === null) {
    return `${intro}\n\nThe legal text is the attached document.`;
  }
  return `${intro}\n\nHere is the full legal text:\n\n<legal-text>\n${docText}\n</legal-text>`;
}
