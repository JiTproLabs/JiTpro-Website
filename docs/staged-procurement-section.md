# Staged: Homepage Procurement-Leakage Section

**Status:** Draft, NOT applied to `src/pages/Home.tsx`. Review the copy, eyebrow/headline choice, and JSX below, then approve before I wire it up.

---

## Proposed copy (verbatim — em-dashes are U+2014, superscript is U+00B2)

> **THE PROCUREMENT GAP**
>
> # Why procurement, specifically
>
> U.S. construction spends about $600 billion a year on materials. Bricks & Bytes estimates 10–20% of that — roughly $60 to $120 billion — disappears into procurement inefficiency.²
>
> What that looks like on the ground:
>
> - 5–10% overhead just to process purchases
> - ~40% of labor time idle, waiting on materials
> - 2–3% average contractor profit margins
>
> This is the gap JiTpro is built to close — before mobilization, not after the field absorbs it.

Footnote (to be appended to the existing SOURCES block at the bottom of Home.tsx, beneath footnote ¹):

> ² Bricks & Bytes, *The $120 Billion Blind Spot* and *The Procurement Gap*, 2026.

---

## Proposed placement

Insert as a new `<section>` between the existing DIAGNOSIS block (`src/pages/Home.tsx` lines 132–146) and the CREDIBILITY block (lines 148–161). Specifically, immediately after the closing `</section>` on line 146 ("JiTpro makes those constraints visible before they impact the schedule.") and before the comment `{/* CREDIBILITY */}` on line 148.

That keeps the doctrinal claim → quantified procurement gap → founder credibility → CTAs rhythm intact.

---

## Visual-treatment notes

- **Eyebrow style:** matches the existing role-card eyebrow on Home.tsx:114 — `text-sm font-semibold uppercase tracking-[0.15em] text-amber-600`. Bumped tracking to `[0.2em]` to align with the hero eyebrow rhythm.
- **Headline style:** matches the "You've seen this." pattern on Home.tsx:102 — `text-3xl md:text-4xl font-bold text-slate-900`.
- **Body / bullet style:** matches `ProjectManagers.tsx:118–123` and `Home.tsx` painPoints — `text-lg text-slate-600 leading-relaxed` with the amber 8px dot bullets (`w-2 h-2 bg-amber-500 rounded-full mt-2.5`).
- **Footnote ²:** stack inside the existing SOURCES section at the bottom of Home.tsx, same `text-xs text-slate-500` treatment as ¹.

Eyebrow / headline choice — the prompt suggested "THE PROCUREMENT GAP" / "Why procurement, specifically." I'd recommend keeping that pairing. It gives the section a category tag (eyebrow) and a question-as-headline (matches "You've seen this." rhythm). If you want an alternative, I'd suggest:

| Eyebrow | Headline |
|---|---|
| THE PROCUREMENT GAP | Why procurement, specifically. |
| WHERE THE MONEY LEAKS | $60–$120B disappears into procurement. |
| THE REAL CATEGORY | Procurement, not the field. |

The first is the closest to the prompt's draft. The second leads with the dollar number. The third is more pointed but loses the answer-to-a-question rhythm.

---

## Proposed JSX (drop into `src/pages/Home.tsx` between DIAGNOSIS and CREDIBILITY)

```jsx
      {/* PROCUREMENT GAP */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-amber-600 mb-6">
            The Procurement Gap
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">
            Why procurement, specifically.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            U.S. construction spends about $600 billion a year on materials. Bricks &amp; Bytes estimates 10–20% of that — roughly $60 to $120 billion — disappears into procurement inefficiency.²
          </p>
          <p className="text-lg text-slate-900 leading-relaxed font-medium mb-6">
            What that looks like on the ground:
          </p>
          <ul className="space-y-3 mb-8">
            {[
              '5–10% overhead just to process purchases',
              '~40% of labor time idle, waiting on materials',
              '2–3% average contractor profit margins',
            ].map((item) => (
              <li key={item} className="flex gap-3 items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2.5 flex-shrink-0" />
                <p className="text-lg text-slate-600 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
          <p className="text-lg text-slate-900 leading-relaxed font-medium">
            This is the gap JiTpro is built to close — before mobilization, not after the field absorbs it.
          </p>
        </div>
      </section>
```

And update the SOURCES block at the bottom of Home.tsx to stack ²:

```jsx
      {/* SOURCES */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto space-y-1">
          <p className="text-xs text-slate-500 leading-relaxed">
            ¹ PlanGrid/FMI, Construction Disconnected, 2018.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            ² Bricks &amp; Bytes, <em>The $120 Billion Blind Spot</em> and <em>The Procurement Gap</em>, 2026.
          </p>
        </div>
      </section>
```

---

## Reminders preserved from the prompt

- The $31.3B rework stat (in the hero, already shipped as Part 1) and the $60–$120B procurement-leakage stat (this section) are NOT merged. They measure different things — rework caused by poor data (FMI/PlanGrid, 2018) vs. total procurement inefficiency (Bricks & Bytes, 2026) — and are cited in separate footnotes (¹ and ²).
- The Bricks & Bytes report titles "*The $120 Billion Blind Spot*" and "*The Procurement Gap*" are written verbatim from your research notes. Double-check the exact titles before approval — they appear in the footnote exactly as written.
- Em-dashes throughout (U+2014) and the superscript ² (U+00B2) are the correct Unicode characters in this draft.

---

## Approval checklist before I wire it in

- [ ] Eyebrow + headline pairing — keep "THE PROCUREMENT GAP" / "Why procurement, specifically.", or swap to one of the alternatives above
- [ ] Bricks & Bytes report titles verified verbatim
- [ ] Section placement (between DIAGNOSIS and CREDIBILITY) feels right
- [ ] Bullet list reads cleanly; numbers are accurate for your positioning
- [ ] OK with the `bg-slate-50` light-gray section background (alternates with the white DIAGNOSIS and dark CREDIBILITY sections above/below)
