/**
 * Project-level representative fixtures. Shared by every JiTpro demo screen,
 * so the same project, the same person and the same organisation appear
 * identically wherever they are shown. Cross-screen referential integrity is
 * the reason these live apart from any one screen's data.
 *
 * All of it is constructed to show realistic conditions. None of it is taken
 * from an actual engagement.
 */

export const PROJECT = {
  name: 'Oak Ridge Residence',
  location: 'Mountain View, CO',
} as const;

/** The signed-in user shown in the sidebar footer. */
export const USER = {
  initials: 'JA',
  name: 'John Anderson',
  role: 'Preconstruction Manager',
} as const;

/**
 * People who can be named as a Commitment Owner. A Commitment Owner is always
 * a specific person, never a role or an organisation.
 */
export const PEOPLE = {
  JS: { initials: 'JS', name: 'Jane Smith', role: 'Lead Architect' },
  EM: { initials: 'EM', name: 'Elizabeth Morgan', role: 'Owner' },
  DB: { initials: 'DB', name: 'Daniel Brooks', role: 'Project Manager' },
  MC: { initials: 'MC', name: 'Michael Chen', role: 'Structural Engineer' },
  LM: { initials: 'LM', name: 'Laura Martinez', role: 'Senior Plans Examiner' },
  AW: { initials: 'AW', name: 'Amy Wong', role: 'Contracts Manager' },
} as const;

export type PersonKey = keyof typeof PEOPLE;

/**
 * Organisations that can be a Responsible Organization: the entity that OWES a
 * commitment. Deliberately includes the Project Owner and the General
 * Contractor, because the responsible party is frequently not external - and
 * it is never the supplier or manufacturer merely because that party is named
 * in a description.
 */
export const ORGANIZATIONS = {
  architect: 'Sierra Ridge Architects',
  owner: 'Project Owner',
  gc: 'General Contractor',
  structural: 'Westline Structural Engineers',
  authority: 'Town of Mountain View Building Department',
  concrete: 'Pinnacle Concrete Construction',
} as const;
