export type Department = 'karosserie' | 'spengler' | 'lackierer' | 'mechaniker' | 'sonstiges';
export type Pensum = 'vollzeit' | 'teilzeit';
export type EmploymentType = 'festanstellung' | 'lehre' | 'praktikum' | 'temporaer';

export interface JobOpening {
  id: string;
  department: Department;
  pensum: Pensum;
  hours_per_week: number | null;
  employment_type: EmploymentType;
  description: string;
  tasks: string[];
  requirements: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export const DEPARTMENT_LABELS: Record<Department, string> = {
  karosserie: 'Karosserie',
  spengler: 'Spenglerei',
  lackierer: 'Lackiererei',
  mechaniker: 'Mechanik',
  sonstiges: 'Sonstiges',
};

// Actual job title shown in the ad heading — DEPARTMENT_LABELS above is only
// the admin-facing category name, not a real job title (e.g. "Lackiererei").
export const JOB_TITLE_LABELS: Record<Department, string> = {
  karosserie: 'Auto-Carrosseriespengler/in',
  spengler: 'Auto-Carrosseriespengler/in',
  lackierer: 'Auto-Lackierer/in',
  mechaniker: 'Auto-Mechaniker/in',
  sonstiges: 'Mitarbeiter/in',
};

export const PENSUM_LABELS: Record<Pensum, string> = {
  vollzeit: 'Ganztag',
  teilzeit: 'Halbtag',
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  festanstellung: 'Festanstellung',
  lehre: 'Lehre',
  praktikum: 'Praktikum',
  temporaer: 'Temporär',
};

// Fixed intro shown on every job ad — the admin never edits this text,
// only picks the structured fields above; the ad below is assembled from both.
export const JOB_AD_INTRO =
  'In unserer Firma im Unterland arbeiten wir seit über 40 Jahren mit Leidenschaft für Fahrzeuge. Wir suchen motivierte Verstärkung, die mit uns in einem eingespielten Team, mit moderner Ausrüstung und höchsten Qualitätsstandards arbeitet.';

export interface JobDefaults {
  description: string;
  tasks: string[];
  requirements: string[];
}

// Prefilled when the admin picks a department for a new job — editable afterwards
// (add/remove), never overwrites a job that already has content.
export const DEFAULT_JOB_CONTENT: Record<Department, JobDefaults | null> = {
  karosserie: {
    description:
      'Verantwortlich für die strukturelle und ästhetische Instandsetzung von Unfall-, Hagel- und Korrosionsschäden an der Fahrzeugkarosserie.',
    tasks: [
      'Demontage, Reparatur, Richtarbeiten und Montage beschädigter Karosserieteile',
      'Richtbankarbeiten zur Wiederherstellung der ursprünglichen Rahmen- und Fahrwerksgeometrie',
      'Schweiss-, Niet-, Klebe- und Trennverfahren nach Herstellervorgaben',
      'Drücktechnik / Dellenreparatur ohne Lackieren (PDR / Hagelinstandsetzung)',
      'Passgenaues Einpassen von Spaltmassen vor der Lackierung',
    ],
    requirements: [
      'Abgeschlossene Berufslehre als Carrosseriespengler/in EFZ (oder gleichwertig)',
      'Fundierte Kenntnisse über moderne Werkstoffe (Aluminium, hochfester Stahl, CFK)',
      'Präzises Massnehmen, Schweisszertifikate und räumliches Vorstellungsvermögen',
    ],
  },
  spengler: {
    description:
      'Verantwortlich für die strukturelle und ästhetische Instandsetzung von Unfall-, Hagel- und Korrosionsschäden an der Fahrzeugkarosserie.',
    tasks: [
      'Demontage, Reparatur, Richtarbeiten und Montage beschädigter Karosserieteile',
      'Richtbankarbeiten zur Wiederherstellung der ursprünglichen Rahmen- und Fahrwerksgeometrie',
      'Schweiss-, Niet-, Klebe- und Trennverfahren nach Herstellervorgaben',
      'Drücktechnik / Dellenreparatur ohne Lackieren (PDR / Hagelinstandsetzung)',
      'Passgenaues Einpassen von Spaltmassen vor der Lackierung',
    ],
    requirements: [
      'Abgeschlossene Berufslehre als Carrosseriespengler/in EFZ (oder gleichwertig)',
      'Fundierte Kenntnisse über moderne Werkstoffe (Aluminium, hochfester Stahl, CFK)',
      'Präzises Massnehmen, Schweisszertifikate und räumliches Vorstellungsvermögen',
    ],
  },
  lackierer: {
    description:
      'Zuständig für die Oberflächenvorbereitung, Grundierung, exakte Farbtonfindung und Lackierung aller Fahrzeugteile.',
    tasks: [
      'Schleifen, Spachteln, Füllern und Abdecken von Reparaturstellen',
      'Digitale Farbbestimmung mittels Spektrofotometer und Rezepturanpassung',
      'Applikation von Wasserbasislacken und Klarlacken in der Spritzkabine',
      'Finish-Arbeiten wie Polieren, Glanzgradangleichung und Lackversiegelung (Detailing)',
    ],
    requirements: [
      'Ausbildung als Carrosserielackierer/in EFZ (oder vergleichbare Praxis)',
      'Hohes Farbsehvermögen und Gespür für Nuancen',
      'Präzise Führung der Spritzpistole sowie strikte Einhaltung von Sicherheits- und Umweltstandards',
    ],
  },
  mechaniker: {
    description:
      'Konzentriert sich auf Antrieb, Fahrwerk, Bremsanlagen, Abgassysteme und die periodische Wartung.',
    tasks: [
      'Grosser und kleiner Service nach Herstellervorgaben (Öl-, Filter- und Flüssigkeitswechsel, Zahnriemen/Steuerkette)',
      'Reparatur und Wartung von Bremsanlage und Fahrwerk (Bremsen, Stossdämpfer, Achsvermessung)',
      'Diagnose und Instandsetzung von Motor, Kupplung und Getriebe',
      'Vorbereitung und Durchführung der MFK (Bremsprüfstand, Lichttest, Abgasmessung)',
      'Saisonaler Räderwechsel, Reifenmontage und RDKS-Programmierung',
      'Klimaservice (Gasfüllung, Leckortung) und Wartung der Abgasanlage',
    ],
    requirements: [
      'Abgeschlossene Berufslehre als Automobil-Fachmann/-frau oder Automobil-Mechatroniker/in EFZ',
      'Fundierte Kenntnisse in Fahrzeugdiagnose und moderner Bordelektronik',
      'Technisches Verständnis, körperliche Belastbarkeit und Führerausweis Kategorie B',
    ],
  },
  sonstiges: null,
};

export function jobAdTitle(job: Pick<JobOpening, 'department' | 'pensum'>): string {
  return `${JOB_TITLE_LABELS[job.department]} gesucht (${PENSUM_LABELS[job.pensum]})`;
}

export function jobMailtoHref(job: Pick<JobOpening, 'department' | 'pensum'>): string {
  const subject = `Bewerbung – ${jobAdTitle(job)}`;
  const body = `Sehr geehrte Damen und Herren\n\nHiermit bewerbe ich mich für die Stelle "${jobAdTitle(job)}".\n\n`;
  return `mailto:sazcargmbh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
