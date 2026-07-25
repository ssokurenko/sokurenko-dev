/**
 * The eight top-level sections of the catalog. This is the single source
 * of truth for the taxonomy — see specs/01-information-architecture.md.
 * The Zod schema, sidebar config, front page, and PDF templates all derive
 * from this array. Do not hardcode a section slug or label anywhere else.
 */
export const SECTIONS = [
  {
    slug: 'languages',
    label: 'Languages',
    blurb:
      'Syntax and type systems, standalone of any runtime or framework.',
  },
  {
    slug: 'frontend',
    label: 'Frontend',
    blurb: 'Browser runtime, UI frameworks, styling, and markup.',
  },
  {
    slug: 'backend',
    label: 'Backend',
    blurb: 'Server runtime, API design, auth, and messaging.',
  },
  {
    slug: 'data',
    label: 'Data',
    blurb: 'Datastores, query languages, and data modeling.',
  },
  {
    slug: 'infrastructure',
    label: 'Infrastructure',
    blurb: 'Runtime environments, provisioning, and networking.',
  },
  {
    slug: 'tooling',
    label: 'Tooling',
    blurb: 'Developer-machine tools you reach for every day.',
  },
  {
    slug: 'practices',
    label: 'Practices',
    blurb: 'Cross-cutting engineering discipline.',
  },
  {
    slug: 'career',
    label: 'Career',
    blurb: "Professional skills that aren't code.",
  },
] as const;

export type SectionSlug = (typeof SECTIONS)[number]['slug'];

export const SECTION_SLUGS = SECTIONS.map((s) => s.slug) as [
  SectionSlug,
  ...SectionSlug[],
];

export function getSection(slug: string) {
  return SECTIONS.find((s) => s.slug === slug);
}
