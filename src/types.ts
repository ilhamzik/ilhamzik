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
  /** Short tag shown on the evidence sticker, e.g. "EXHIBIT A" or "P-01". */
  tag: string;
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
  stamp?: string;
  /** Optional tech-stack pills shown in the "forensic report" facts area. */
  techStack?: string[];
  /** Optional line rendered behind a redacted black bar, revealed on hover/tap. */
  redacted?: Bilingual;
}

export interface EducationEntry extends CaseFile {
  level: "sd" | "smp" | "sma" | "kuliah";
  institution: Bilingual;
  years: string;
}

export interface ExperienceEntry extends CaseFile {
  role: Bilingual;
  organization: Bilingual;
  period: string;
}

export interface ProjectEntry extends CaseFile {
  techStack: string[];
}

export interface SkillEntry extends CaseFile {
  proficiency: 1 | 2 | 3 | 4 | 5;
}

export interface InterestEntry extends CaseFile {
  icon: "manutd" | "custom";
}
