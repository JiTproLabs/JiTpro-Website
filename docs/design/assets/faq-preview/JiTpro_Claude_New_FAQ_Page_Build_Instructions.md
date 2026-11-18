# Claude Code Task: Build a Separate JiTpro FAQ Preview Page

## Objective
Implement a new, visually polished and fully functional FAQ page in the existing JiTpro website project, using the supplied `JiTpro_FAQ_Interactive_Mockup.html` as the **design and copy reference**.

**This is a new candidate page for review, NOT a replacement of the existing FAQ.** The founder must be able to view the new page independently, compare it with the existing FAQ, and approve it before any replacement or navigation change.

## Inputs
- Reference file: `JiTpro_FAQ_Interactive_Mockup.html` (provided alongside this brief). Read its complete HTML/CSS/JavaScript, including the ten exact FAQ answers, before writing code.
- Existing repository: `JiTproLabs/JiTpro-Website`. Inspect the checked-out repo, its framework, routes, app shell, styles, tests, existing FAQ implementation, and package scripts before changing anything.
- Brand direction: dark navy, amber/orange accents, restrained cream/light neutral, strong typography, confident editorial layout.

## Non-negotiable isolation and safety requirements
1. **Do not alter, remove, redirect, or replace the existing FAQ page or its route.** All currently published content and behavior must continue working.
2. Create a separate preview route, preferably `/faq-preview`, or use the closest nonconflicting route that fits the actual router. If `/faq-preview` is occupied, choose another explicit route and report it.
3. Do not add this preview to public header/footer navigation, sitemap, canonical URL structure, or homepage links until explicitly authorized. Add `noindex` metadata for the preview route if the framework supports it.
4. Do not change existing homepage, GC, Architect, Owner, contact, or other pages except for any strictly necessary shared wiring to register the new route. Avoid global style regressions.
5. Do not deploy or merge to production without founder approval. Use the repo's existing feature-branch and PR workflow; verify the branch before modifying files. If currently on `main`, create a clearly named feature branch (e.g. `feature/faq-preview-page`). Do not force-push or overwrite others' work.
6. Make this a real page integrated into the existing framework (React/component architecture if that is what the repo uses), not an iframe or a standalone HTML file embedded as-is. Use scoped CSS or existing styling conventions to avoid collisions.
7. **Preserve all ten approved FAQ questions and answers from the HTML mock-up verbatim**, including the strong prevention-vs-recovery wording. Do not summarize, soften, expand, or rewrite the copy unless there is an obvious typographical issue, and flag any proposed editorial change rather than making it silently.
8. Never present JiTpro as a troubled-project rescue, turnaround, recovery, or mid-project intervention service. JiTpro engages early, ideally at contract award, then stays involved through the procurement process as requirements evolve. Do not name competing software providers.
9. Avoid em dashes in newly authored interface copy or code comments.

## Visual and UX direction
Recreate the mock-up's overall feel, with discretion to improve implementation quality while staying faithful to the design:

- **Hero:** full-width deep navy; oversized `Less chaos. More clarity.` typography with amber emphasis; eyebrow `THE QUESTIONS THAT MATTER`; concise explanation; primary jump link to FAQ and secondary contact link.
- **Right-side hero graphic:** designed `DEFINE → CONNECT → SEQUENCE` card, three stacked stages with numbering, restrained borders and glow, and the closing thought `Not everything is urgent on day one. Know when it matters.` This is a purposeful information graphic, not stock art.
- **Amber principle strip:** `We don't make everything urgent. We make the timing of everything clear.` with `ONE PROJECT AT A TIME.` as secondary detail.
- **FAQ area:** warm neutral background; prominent editorial heading, `Everything you need to know. Nothing you don't.`; ten numbered accordion questions `01`–`10` with generous spacing, fine rules, an amber active state, smooth but understated motion, and prominent indented amber callout lines inside the answers.
- **Accordion behavior:** clicking any question reveals its complete answer; opening one question closes the previously open one during normal interaction; `Expand all` and `Collapse all` controls work as labeled. First question may start open. Use accessible native `<details>/<summary>` or well-implemented accessible buttons with `aria-expanded`, keyboard operation, visible focus, and respect for `prefers-reduced-motion`.
- **Closing CTA:** dark section, amber-highlighted message `The best time to get ahead of your next project is before it starts.`; working contact-page link.
- **Responsive:** premium desktop layout, balanced tablet reflow, comfortable mobile typography, no horizontal overflow, ample touch targets, and no clipped content.
- Match the actual site's header, footer, logo, and established design system where practical, rather than duplicating mock-up placeholders. Keep the hero/FAQ/CTA composition distinctive.

## Copy/source of truth
The attached HTML mock-up contains the founder-approved wording for all ten answers. **Extract the questions and full answers directly from that file**. The question titles are:

1. What exactly does JiTpro do?
2. How is JiTpro different from what we're already doing?
3. How does JiTpro help protect our schedule and profits?
4. When is the best time to bring JiTpro into a project?
5. What does working with JiTpro actually look like?
6. Will JiTpro replace our project management team?
7. What kinds of construction projects benefit most from JiTpro?
8. What happens if we don't have a dedicated procurement planning process?
9. How much does JiTpro cost, and is it worth the investment?
10. How do we get started with JiTpro?

Key sentences that must be preserved precisely as they appear in the source include:
- `We don't make everything urgent. We make the timing of everything clear.`
- `The cost of preventing a problem is always substantially less than the cost of recovering from it.`
- `You're already paying for procurement management.`

Do **not** introduce an FAQ asking whether JiTpro will rescue an already-troubled project.

## Implementation process
1. Inspect current Git status, branch, routing, components, CSS, existing FAQ, and development scripts. Preserve any existing local changes.
2. Read the complete supplied mock-up. Identify reusable components, visual tokens, content, and interaction requirements.
3. Implement a new isolated page at `/faq-preview` (or reported nonconflicting equivalent). Reuse existing site shell and brand assets appropriately.
4. Add focused tests if the repo has a testing convention. Check for the ten question titles, correct copy, accordion behavior, and continued availability of the original FAQ route. Avoid broad test rewrites.
5. Run the relevant typecheck, lint, unit tests, and production build as supported by the project. Resolve errors attributable to this implementation.
6. Start the local development server using the repository's existing method and provide the **exact local preview URL and port** (e.g. `http://localhost:<actual-port>/faq-preview`). Do not invent the port. If preview deployments exist in the current workflow, provide the actual generated URL after deployment, not a guessed one.
7. Summarize changed files, the test/build results, how to view the new page, and any deviations from the mock-up. Stop for founder visual review; do not replace the existing FAQ or make the page publicly discoverable.

## Definition of done
- New FAQ page loads directly via its unique preview URL.
- Existing FAQ page is unchanged and still loads.
- All ten final approved FAQs are present, correct, and readable.
- Accordion and expand/collapse controls function with mouse, keyboard, and mobile touch.
- Layout is responsive, branded, visually polished, and respects accessibility basics.
- Site build/tests pass or any pre-existing failures are explicitly distinguished.
- Founder receives an exact URL to review the new page before any production/navigation switch.

## Final report format
Respond with: **Preview route/URL**, **branch**, **files changed**, **what was built**, **checks run and results**, **anything requiring my review**. No deployment to production and no replacement of the live FAQ.
