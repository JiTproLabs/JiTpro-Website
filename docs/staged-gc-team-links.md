# Staged: GC Page — Team Links Section (PM / Super / Sub)

**Status:** Draft, NOT applied to `src/pages/roles/GeneralContractors.tsx`. The value-sentence for each role is a copywriting choice — review and adjust the wording before this is wired in.

---

## Goal

Add a "share these with your team" block to the GC role page. A GC reading the GC page may want to send the PM, Superintendent, or Subcontractor pages to their team. Those pages already exist and are reachable from the main `/roles` index; this block makes the in-organization routing explicit on the GC page itself.

---

## URL paths verified

The link targets in this block resolve to:

- Project Manager page → `/roles/project-managers` (component: `src/pages/roles/ProjectManagers.tsx`)
- Superintendent page → **DOES NOT EXIST** in current codebase — see "Open question" below
- Subcontractor page → `/roles/subcontractors` (component: `src/pages/roles/Subcontractors.tsx`)

### Open question — Superintendent page

There is no `/roles/superintendents` route, no `Superintendents.tsx` component, and no Superintendent entry in the role-cards index (`Roles.tsx` lists only GC, A/E, Sub, Owner/Dev, PM/CM). The prompt asserts the page exists. Two possibilities:

1. The page is planned but not yet built. In that case this staged block needs to wait, or the Super link gets removed from the block until the page ships.
2. The Super role is bundled into the PM/CM page (`/roles/project-managers`, titled "Project Managers & Construction Managers"). In that case the Super link should resolve to `/roles/project-managers` and the value-sentence should be revised.

**Pick one before I wire this in.** I've left the Super bullet as a `TODO` placeholder in the JSX below.

---

## Proposed placement

Insert as a new `<section>` near the bottom of `src/pages/roles/GeneralContractors.tsx`, immediately ABOVE the final CTA section (the dark `bg-slate-900` "Control before construction" block on line 265). That puts "share with your team" as the last content beat before the contact CTA — natural reading flow.

Specifically, between the closing `</section>` of the OUTCOMES block (line 262) and the comment `{/* 8. CTA */}` (line 264).

---

## Proposed copy

> **HOW JITPRO HELPS YOUR TEAM**
>
> Procurement control doesn't stop at the office. JiTpro changes what your team sees and does on the job:
>
> → **Project Managers** — see how PMs get procurement risk weeks ahead instead of in the field.
>
> → **Superintendents** — see how supers get long-lead items sequenced before they show up as field problems. *(pending — see Super-page question above)*
>
> → **Subcontractors** — see how subs get cleaner buyout, fewer change orders, and fewer scheduling whiplashes.

---

## Proposed JSX

```jsx
      {/* TEAM LINKS — share with PMs, Supers, Subs */}
      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            How JiTpro helps your team
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            Procurement control doesn't stop at the office. JiTpro changes what your team sees and does on the job:
          </p>
          <div className="space-y-8">
            <div>
              <Link
                to="/roles/project-managers"
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors mb-2"
              >
                → Project Managers
              </Link>
              <p className="text-lg text-slate-600 leading-relaxed">
                See how PMs get procurement risk weeks ahead instead of in the field.
              </p>
            </div>
            {/* TODO: confirm Superintendent destination (own page vs. PM/CM page) before enabling */}
            <div>
              <Link
                to="/roles/project-managers" /* TODO: replace with /roles/superintendents if a Super page is created */
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors mb-2"
              >
                → Superintendents
              </Link>
              <p className="text-lg text-slate-600 leading-relaxed">
                See how supers get long-lead items sequenced before they show up as field problems.
              </p>
            </div>
            <div>
              <Link
                to="/roles/subcontractors"
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors mb-2"
              >
                → Subcontractors
              </Link>
              <p className="text-lg text-slate-600 leading-relaxed">
                See how subs get cleaner buyout, fewer change orders, and fewer scheduling whiplashes.
              </p>
            </div>
          </div>
        </div>
      </section>
```

---

## Approval checklist

- [ ] Resolve Superintendent destination (build new page, or point to PM/CM page, or drop the Super bullet)
- [ ] Approve or revise each role's value-sentence — the wording is the part most likely to benefit from a copywriting pass
- [ ] Confirm placement above the final CTA reads as "share with your team," not "yet another product feature"
- [ ] Section background `bg-slate-50` alternates with the white OUTCOMES section above and the dark CTA below — confirm that visual rhythm
- [ ] Heading "How JiTpro helps your team" — sentence case to match the GC page's other H2s, OR uppercase to match the homepage's new stakeholder-router eyebrow style. Choose one.
