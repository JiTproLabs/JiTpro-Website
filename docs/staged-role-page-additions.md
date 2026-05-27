# Staged: Demoted Homepage Copy → Owner / Architect Role Pages

**Status:** Draft, NOT applied to live source. The strong panel-ratified sentences from the removed Owner and Architect homepage cards need to live somewhere — these are the proposed additions to the dedicated role pages.

Each page's additions below is a distinct change. Review and approve independently.

---

## A. Owners & Developers page (`src/pages/roles/OwnersDevelopers.tsx`)

### Missing copy that needs a home

These four pieces were on the homepage Owner card and earned an explicit positive panel reaction. None of them currently appear on `OwnersDevelopers.tsx`:

1. "Projects don't spiral late. They spiral early — when no one is in control."
2. "Schedules slip. Change orders stack. Decisions become urgent. And the project starts running you."
3. "JiTpro brings control in early — before things break."
4. The three Owner bullets:
   - Identify decisions before they become urgent
   - Sequence procurement before delays start
   - Build the schedule from real constraints

### Proposed placement

Insert as a new framing block at the top of the page, BEFORE the existing "Your role in procurement" section (line 21). This makes the strongest panel-ratified sentences the first thing an Owner reads after the hero.

Specifically, between the current hero `</section>` (closes line 19) and the "Your role in procurement" `<section>` (opens line 21).

### Proposed JSX

```jsx
      {/* DEMOTED FROM HOMEPAGE — PANEL-RATIFIED FRAMING */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-snug">
            Projects don't spiral late.
            <br />
            They spiral early — when no one is in control.
          </h2>
          <div className="text-lg text-slate-600 leading-relaxed space-y-2 mb-6">
            <p>Schedules slip.</p>
            <p>Change orders stack.</p>
            <p>Decisions become urgent.</p>
            <p>And the project starts running you.</p>
          </div>
          <p className="text-xl text-slate-900 font-medium mb-8">
            JiTpro brings control in early — before things break.
          </p>
          <ul className="space-y-3">
            {[
              'Identify decisions before they become urgent',
              'Sequence procurement before delays start',
              'Build the schedule from real constraints',
            ].map((item) => (
              <li key={item} className="flex gap-3 items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2.5 flex-shrink-0" />
                <p className="text-lg text-slate-700 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
```

### Note on em-dashes

The em-dash in "They spiral early — when no one is in control." and "before things break" is U+2014, not a hyphen. The homepage card used `—` directly (with surrounding spaces, not `—` no-space-no-space). Preserving exactly as the panel ratified.

---

## B. Architects & Engineers page (`src/pages/roles/ArchitectsEngineers.tsx`)

### Missing copy that needs a home

These were on the homepage Architect card and are NOT currently on `ArchitectsEngineers.tsx`:

1. "Design continues during procurement — but no one owns the timing." (was the card headline)
2. "Submittals become the place where design gets finished instead of verified." (was the card body)

### Proposed placement

Insert as a small framing block at the top of the page, BEFORE the existing "Your role in procurement" section (line 21). Same pattern as the Owner page — the panel-ratified sentences appear first.

### Proposed JSX

```jsx
      {/* DEMOTED FROM HOMEPAGE — PANEL-RATIFIED FRAMING */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-snug">
            Design continues during procurement — but no one owns the timing.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Submittals become the place where design gets finished instead of verified.
          </p>
        </div>
      </section>
```

---

## Approval checklist

- [ ] Owner page — add the framing block (4 pieces of copy) at top
- [ ] Architect page — add the framing block (2 pieces of copy) at top
- [ ] Em-dashes (—) preserved as U+2014 in both
- [ ] Heading levels (`h2`) fit each page's existing structure (the existing first content section uses `h2`, so `h2` here is consistent)
