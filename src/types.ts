/** A piece of text available in both Indonesian and English. */
export interface Bilingual {
  id: string;
  en: string;
}

export type Lang = "id" | "en";

/** A single line item inside a case file popup (e.g. a fact, a stat, a quote). */
export interface CaseFact {
  label: Bilingual;
  value: Bilingual;
}

/** Generic shape for anything that opens a "case file" popup when clicked. */
export interface CaseFile {
  id: string;
  /** Short tag shown on the evidence sticker, e.g. "EXHIBIT A" / "BUKTI A".
   *  Bilingual because these are words, not codes: the Indonesian set reads
   *  KARTU / BERKAS / SIDIK / BUKTI and the English set CARD / FILE / PRINT /
   *  EXHIBIT. Render it through `t()`, never raw. */
  tag: Bilingual;
  title: Bilingual;
  subtitle?: Bilingual;
  /** Main narrative body, can contain multiple paragraphs. */
  body: Bilingual[];
  facts?: CaseFact[];
  /** Optional photo. If absent, a placeholder illustration is used. */
  photoSrc?: string;
  photoCaption?: Bilingual;
  /** Optional external link (repo, demo, article, social profile...). */
  link?: { href: string; label: Bilingual };
  /** Stamp text overlay on the popup, e.g. "CASE CLOSED", "VERIFIED". */
  stamp?: Bilingual;
  /** Optional tech-stack pills shown in the "forensic report" facts area. */
  techStack?: string[];
  /** Optional line rendered behind a redacted black bar, revealed on hover/tap. */
  redacted?: Bilingual;
  /** Keys into `capabilityCatalog` in content.ts: the analyst techniques this
   *  file evidences. Rendered as chips by the modal and the exhibit cards. */
  capabilities?: string[];
  /**
   * Headline numbers, shown as a row of stat tiles at the top of the case
   * file so the impact lands before the narrative does. Two or three at most.
   *
   * `value` is Bilingual because decimal and thousands separators differ:
   * "5.846"/"0,85" in Indonesian, "5,846"/"0.85" in English. Only put a
   * number here that the body text already substantiates.
   */
  metrics?: { value: Bilingual; label: Bilingual }[];
  /**
   * Third-party corroboration. `source` must say who said it and how solid
   * it is: a paraphrased verbal remark is not a quotable figure, and saying
   * so plainly is what makes the rest of the file credible.
   */
  witness?: { statement: Bilingual; source: Bilingual };
  /**
   * A wide evidence image (a dashboard screenshot, a report page) shown
   * full-width in the case file. Separate from `photoSrc`, which is the
   * square polaroid for photographs of people and places: a dashboard in a
   * 160px square is unreadable.
   *
   * Set `redact` to lay black bars over the image, which is how a real
   * screenshot of internal data can be shown at all. Each bar is a
   * percentage box of the image: {x, y, w, h}.
   */
  exhibit?: {
    src: string;
    caption?: Bilingual;
    redact?: { x: number; y: number; w: number; h: number }[];
  };
}

export interface EducationEntry extends CaseFile {
  level: "sd" | "smp" | "sma" | "kuliah";
  institution: Bilingual;
}

export interface ExperienceEntry extends CaseFile {
  role: Bilingual;
  organization: Bilingual;
  period: Bilingual;
}

export interface ProjectEntry extends CaseFile {
  techStack: string[];
  /** Required here: every exhibit states which analyst techniques it shows. */
  capabilities: string[];
}

export interface SkillEntry extends CaseFile {
  proficiency: 1 | 2 | 3 | 4 | 5;
}

export interface InterestEntry extends CaseFile {
  icon: "manutd" | "custom";
}
