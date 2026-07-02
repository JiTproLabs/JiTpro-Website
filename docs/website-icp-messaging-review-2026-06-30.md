# JiTpro website ICP messaging review

Date: 2026-06-30
Repo: `/Users/jeffkaufman/Documents/GitHub/JiTpro-Website`
Audience lens: growth-stage general contractor owner, roughly $5M-$50M annual revenue, trying not to repeat $5M-project mistakes at $20M scale.

## Executive diagnosis

The current site is doctrinally strong but commercially too patient.

It explains the procurement-control thesis accurately, but the first-contact buyer Jeff is describing is overloaded, defensive, proud, and moving fast. That buyer is not looking for a procurement philosophy. He is trying to avoid another job where profit evaporated, his team got buried, and everyone pretended it was normal.

The site needs to shift from:

- "Here is the intellectual architecture of procurement control."

to:

- "You lost profit on the last job for a reason. Procurement slipped before the field ever had a chance. If you are growing, this will get worse unless you put control in before the next project starts."

The message should not be dumbed down. It should be compressed, sharpened, and aimed at the owner’s pain.

## The 5-second test

Current 5-second impression:

- Looks polished and serious.
- Feels abstract: "control," "sequencing," "constraints," "schedule certainty."
- The hero animation tells the right story, but the main text arrives too late for an impatient buyer.
- The visitor may understand that JiTpro is about procurement, but may not immediately feel, "This is why my last job lost margin."

Required 5-second impression:

- "That’s my problem."
- "That last project didn’t just go bad. We let procurement slip."
- "If we grow without fixing this, the losses scale with us."

Recommended homepage opening line:

> Your last project didn’t lose margin in the field.
> It lost margin when procurement slipped.

Supporting line:

> JiTpro helps growth-stage general contractors control decisions, submittals, fabrication, and delivery before late procurement turns into rework, schedule compression, and lost profit.

Primary CTA:

> Find the leak in your next project

Secondary CTA:

> Watch the 90-second procurement breakdown

## Site-wide repositioning

### Primary buyer

The public site should make the general contractor owner the center of gravity. Owners, architects, subs, and PMs still matter, but they should become supporting pages rather than equal front-door audiences.

Current issue:

- Home routes visitors to owners and architects before it fully captures the GC owner.
- Roles page treats every stakeholder as a peer.
- Contact navigation splits CTAs by role.

Recommendation:

- Main navigation should prioritize: Problem, For GCs, How JiTpro Works, Founder Story, Start with a Project.
- Owners/developers can remain as mandate allies.
- Architects can remain as coordination allies.
- The commercial story should be: "GC owner writes the check because margin is leaking."

### Core promise

Current promise:

- Schedule certainty through procurement control.

Sharper ICP promise:

- Protect margin by controlling procurement before the job goes reactive.

Do not abandon schedule certainty. Reframe it as the mechanism that protects margin.

### Emotional angle

The GC owner does not wake up thinking about "procurement constraints." He wakes up thinking:

- Why did we make less money on that job than we bid?
- Why did my PM get buried again?
- Why are we always expediting?
- Why do we keep winning bigger work but feeling less in control?
- Why did the owner lose confidence halfway through the job?
- Why does every job depend on heroic recovery?

The site should name these directly.

## Page-by-page review

### Home: `src/pages/Home.tsx` and hero data `src/content/heroAnimationData.ts`

What works:

- The animation concept is strong.
- The procurement-failure sequence is the right story.
- The thesis line "When Procurement Delays Compound, Margin Disappears" is very close to the needed commercial hook.
- The existing hero copy is governance-aligned: "reveals and sequences procurement constraints."

What misses:

- The hero copy appears after the animation. Desktop total run is 37.6 seconds; mobile total run is 20.9 seconds. The ICP needs the punch in 5 seconds.
- The final headline "Control Before You Build" is strong but not painful enough by itself.
- The homepage sections are thoughtful but softened: "supports healthy margins," "projects perform best," "procurement is not optional." This is true, but not sharp enough for a resistant GC owner.
- The page gives equal downstream attention to owners and architects too early.

Recommended change:

- Put the core accusation/value above or over the animation immediately, not after it.
- Keep the animation, but make it support the message instead of delaying the message.
- Replace soft language with profit-leak language.

Suggested hero structure:

1. Eyebrow:
   - Growth-stage GCs don’t have a field problem. They have a procurement-control problem.
2. H1:
   - Your last project didn’t lose margin in the field.
   - It lost margin when procurement slipped.
3. Subhead:
   - JiTpro finds the decisions, submittals, fabrication steps, and deliveries that will break your schedule before they become rework, overtime, and lost profit.
4. CTA:
   - Find the leak in your next project
5. Proof/credibility line:
   - Built from 38 years of complex residential and light commercial construction.

Recommended homepage section sequence:

1. 5-second pain hook.
2. "Where the margin went" visual: bid margin -> late decision -> rushed submittal -> missed fabrication -> stacked trades -> rework/overtime -> margin leak.
3. "The $5M to $20M trap" section: bigger projects do not forgive informal procurement.
4. 90-second procurement story/video.
5. What JiTpro controls: decisions, submittals, buyout, fabrication, delivery, owner/architect response timing.
6. Founder credibility.
7. CTA: start with one upcoming project.

### Product: `src/pages/Product.tsx`

What works:

- It explains lifecycle, forecasting, approval routing, delay attribution, and audit trail.
- The Procore contrast is present: existing PM tools track; JiTpro adds procurement control.

What misses:

- It reads like a feature page for someone already convinced.
- "Procurement control and forecasting" is accurate but not urgent.
- The page starts with what JiTpro manages rather than the business loss it prevents.

Recommended H1:

> Stop finding procurement problems after they have already cost you money.

Recommended subhead:

> JiTpro turns every required decision, approval, submittal, fabrication step, and delivery into a controlled sequence tied to the date the field actually needs it.

Recommended product framing:

- What leaks profit today:
  - missed decision dates
  - endless review loops
  - late buyout
  - fabricated-too-late materials
  - expediting
  - stacked trades
  - rework
- What JiTpro puts in place:
  - owner/deadline for every procurement constraint
  - required-on-site date logic
  - warning before compression starts
  - proof when delay is not the GC’s fault

### How It Works: `src/pages/HowItWorks.tsx`

What works:

- The 5-step flow is logical.
- It explains backward forecasting well.

What misses:

- The first step uses internal/product terms like "ScopeBuilder" and "generate registry" before establishing why the GC owner should care.
- "Simple to implement" may sound like another software promise. The buyer may not believe it.

Recommended H1:

> We start where your margin usually starts leaking: before the job begins.

Recommended 5-step rewrite:

1. List every item the schedule depends on.
2. Work backward from the required-on-site date.
3. Assign every decision to a real owner.
4. Escalate before procurement compresses the field.
5. Lock the record so blame does not replace facts.

Add a visual:

- Left: ordinary schedule says "Install windows Aug 12."
- Right: JiTpro shows "selection due Apr 5, submittal due Apr 19, approval due May 3, release due May 10, fabrication starts May 17, delivery Aug 5."

### Why JiTpro: `src/pages/Why.tsx`

What works:

- This is the strongest explanatory page on the current site.
- It contains the right doctrine: the field reveals the problem; upstream constraints created it.
- The narrative has rhythm and founder truth.

What misses:

- It is long and philosophical.
- The GC owner may agree but not act.
- The financial consequence appears indirectly.

Recommendation:

- Keep this page, but rename/reframe it as "Why Projects Lose Margin Before the Field Starts."
- Add a "What you probably called it" vs "What it actually was" section:
  - "Bad luck" -> unresolved procurement constraint
  - "Sub delay" -> late approval/release
  - "Owner indecision" -> no decision runway
  - "Field inefficiency" -> schedule compression from upstream failure
- Add a hard GC-owner bridge near the top:
  - "If you are growing from $5M work to $20M work, informal procurement does not scale. It turns into profit leakage."

### Roles index: `src/pages/Roles.tsx`

What works:

- It recognizes every stakeholder’s procurement exposure.

What misses:

- It dilutes the buyer. For the current GTM problem, the roles page makes JiTpro look like a broad ecosystem solution rather than a profit-protection system for the GC owner.

Recommendation:

- Make the GC role visually dominant.
- Reframe other roles as "Who JiTpro aligns around the GC’s procurement plan."
- Suggested H1:
  - "Built for the GC who carries the schedule and the margin risk."

### General Contractors: `src/pages/roles/GeneralContractors.tsx`

What works:

- This is closest to the requested ICP.
- It already mentions growth-stage GCs, margin, credibility, burnout, field pressure, and informal procurement not scaling.
- The line "Operational strain grows faster than control systems" is a strong strategic insight.

What misses:

- It still leads with project-environment health rather than direct profit loss.
- "Get Ahead of the Job Before It Gets Ahead of You" is good, but not yet painful enough.
- The word "environment" softens what Jeff is trying to say.

Recommended H1:

> Bigger jobs will not forgive the procurement habits that worked at $5M.

Alternative H1:

> If procurement is informal, growth makes every mistake more expensive.

Recommended opening:

> At $5M, the owner can chase decisions himself. At $20M, that same habit turns into late approvals, rushed submittals, expediting, stacked trades, and margin leakage. JiTpro gives growth-stage GCs a procurement control system before the next project exposes the gap.

Add section:

> The $5M to $20M trap
>
> The jobs get bigger. The team gets busier. The old procurement method stays informal. Then the company discovers that every missed decision now costs more, moves more people, and damages more margin.

### Documentation & Risk: `src/pages/Documentation.tsx`

What works:

- Strong relevance for claims and defensible records.
- Delay attribution is useful.

What misses:

- It feels legal/defensive instead of operational/profit-driven.
- For a reluctant GC, claims protection is secondary unless tied to margin and owner trust.

Recommended H1:

> When the job slips, facts beat blame.

Recommended subhead:

> JiTpro records when decisions were requested, who owned them, when they were made, and how late procurement affected the schedule — so margin loss does not turn into a blame fight.

### About: `src/pages/About.tsx`

What works:

- Clear and short.

What misses:

- Generic. It could belong to any construction software company.
- It underuses Jeff’s 38-year authority.

Recommendation:

- Push visitors to Founder Story or merge more founder authority into About.
- Replace "Built from real construction problems" with something like:
  - "Built by a contractor who got tired of watching profit disappear after procurement had already slipped."

### Founder Story: `src/pages/FounderStory.tsx`

What works:

- Strong credibility.
- The founder voice is real.
- The line "when they left — the system left with them" is excellent.

What misses:

- It could hit the GC owner harder with business consequence.
- It talks about instability and bleeding, but not enough about the founder’s personal frustration with preventable profit loss.

Recommendation:

- Add one early paragraph:
  - "The painful part was not that projects were complex. The painful part was watching good contractors lose margin on problems that were visible months earlier."
- Add CTA at end:
  - "Bring JiTpro into one upcoming project before procurement starts slipping."

### FAQ: `src/pages/FAQ.tsx` and `src/content/faqData.ts`

What works:

- Very rich. The strongest margin/pricing language lives here.
- It directly says JiTpro is for growth-stage contractors and protects profit.

What misses:

- Much of the best buyer-facing copy is buried in FAQ, not visible on core pages.
- Governance drift: FAQ uses externally banned/problematic language in places: "software platform," "platform," "AI," and "automation"-adjacent framing. The main FAQ hero says "software platform" directly.
- ICP revenue range drift: FAQ says growth-stage contractors typically operating between $5M-$150M annually, while canonical ICP is $5M-$50M annual revenue.

Recommendation:

- Move the strongest financial FAQ ideas into Home, GC page, and Product.
- Fix external-language drift.
- Correct $5M-$150M to $5M-$50M unless Jeff explicitly changes ICP.
- Consider renaming the "Software, Platform & AI" FAQ category to "Technology & Workflow" or "System & Workflow."

### Demo and contact pages: `src/pages/Demo.tsx`, `src/pages/contact/ContractorContact.tsx`

What works:

- The contractor contact page asks relevant qualification questions.
- It asks about procurement planning method, which is useful.

What misses:

- CTA language is passive: "Request a demonstration," "Let’s Talk Procurement."
- A resistant GC owner may not want a demo. He may want to know whether the pain is real and whether his next project is exposed.

Recommended CTA shift:

- Replace "Request Demo" with one of:
  - "Find the procurement risk in my next project"
  - "Review an upcoming project"
  - "See where procurement will slip"
  - "Start with one project"

Recommended contractor form intro:

> Tell us about one upcoming project. We’ll help identify where procurement decisions, approvals, fabrication, or delivery are likely to compress your schedule before the field absorbs the cost.

### Unlisted landing page: `src/pages/BrokenBeforeJobStarts.tsx`

What works:

- This is the closest page to the tone Jeff is asking for.
- It has the hard hook: "How much of that was yours?"
- It connects rework, margin leakage, and procurement failure.
- It uses short, readable sections.

What misses:

- It points back to the homepage instead of converting directly.
- It could become the model for the new homepage rather than staying unlisted.

Recommendation:

- Promote this page’s style into the main homepage.
- Add a direct contractor CTA, not just "Visit JiTpro."
- Convert it into a campaign page: "Where Did the Margin Go?"

### The Real Procurement Timeline: `src/pages/TheRealProcurementTimeline.tsx`

What works:

- Strong concept for showing the story instead of explaining it.
- Has potential as the "show me" piece resistant GCs need.

What misses:

- It is unlisted and likely too detailed for first touch.

Recommendation:

- Convert the best parts into a short video/interactive snippet on Home and GC page.
- Keep the full interactive as a deeper proof page.

### Procurement Schedule: `src/pages/ProcurementSchedule.tsx`

What works:

- Directly shows what JiTpro produces.

What misses:

- Unlisted and context-light.
- "Here’s what it looks like" is useful only after the visitor cares.

Recommendation:

- Link it from How It Works after a pain-led setup.
- Rename section headline to:
  - "This is what procurement control looks like before the job starts."

## Graphics and short-video recommendations

### 1. The margin leak chain

Format: homepage visual and 15-second video.

Sequence:

Bid margin -> late selection -> submittal loop -> fabrication misses start -> delivery slips -> trades stack -> rework/overtime -> margin disappears.

On-screen final line:

> The field didn’t create the loss. It revealed it.

### 2. The $5M to $20M trap

Format: simple split-screen graphic.

Left: $5M company

- owner can chase decisions manually
- PM can remember most risks
- smaller delays are survivable

Right: $20M company

- more projects
- more decisions
- more approvals
- more lead times
- informal procurement collapses

Final line:

> Growth multiplies whatever system you already have. If procurement is informal, growth multiplies the chaos.

### 3. One procurement item exploded

Format: 30-45 second animation.

Start with one innocent line item: "Steel windows needed onsite Aug 12."

Then reveal backward chain:

- delivery Aug 5
- fabrication release May 10
- approval May 3
- submittal Apr 19
- selection Apr 5
- scope clarification Mar 22

Final line:

> If you only track the delivery date, you are already late.

### 4. The owner decision runway visual

Format: static graphic / carousel.

Show that an owner decision is not due "when the owner feels ready." It is due when procurement needs it to preserve schedule.

Final line:

> A late decision is not just late. It consumes the field’s runway.

### 5. The PM overload visual

Format: short video or homepage section.

Show a PM buried under:

- RFIs
- submittals
- delivery calls
- owner selections
- expediting
- schedule updates
- trade resequencing

Then overlay:

> This is not project management. This is procurement failure arriving late.

## Recommended new site architecture

Primary navigation:

1. Problem
2. For General Contractors
3. How It Works
4. Founder Story
5. Start with One Project

Supporting/footer links:

- Owners & Developers
- Architects & Engineers
- Documentation & Risk
- FAQ
- Investor, if still needed and gated/separate

Recommended page set:

- `/` — pain-led homepage for GC owner
- `/problem` or current `/why` — why margin disappears before the field
- `/roles/general-contractors` — primary buyer page
- `/how-it-works` — operational mechanism
- `/proof` or `/the-real-procurement-timeline` — interactive/video proof
- `/founder-story` — credibility
- `/contact/contractor` — start with one project

## Immediate priority changes

1. Homepage hero must punch immediately. Do not wait for the animation to finish.
2. Promote margin-loss language from FAQ and BrokenBeforeJobStarts into main pages.
3. Make the GC owner the obvious buyer across navigation, Home, Product, and CTA language.
4. Add the $5M-to-$20M growth-stage trap as a core section.
5. Replace passive CTAs with project-risk CTAs.
6. Move strongest visuals/video concepts into Home and GC page.
7. Fix external-language governance drift in FAQ and any public page using "platform" or technology-first language.
8. Correct FAQ ICP drift from $5M-$150M to $5M-$50M unless intentionally changed.

## Copy bank for the next rewrite sprint

Hero options:

1. Your last project didn’t lose margin in the field. It lost margin when procurement slipped.
2. Bigger jobs won’t forgive the procurement habits that worked when you were smaller.
3. If procurement is informal, growth makes every mistake more expensive.
4. The field didn’t create the loss. It revealed it.
5. You don’t have a scheduling problem. You have decisions, approvals, and materials arriving too late to support the schedule.

CTA options:

1. Find the leak in your next project
2. Review an upcoming project
3. See where procurement will slip
4. Start with one project
5. Watch the procurement breakdown

Short proof lines:

1. Every project pays for control. You either establish it early or absorb the cost later.
2. A schedule is only as reliable as the procurement sequence behind it.
3. Procurement does not become urgent all at once. It becomes urgent one missed decision at a time.
4. By the time the field feels it, the margin is already exposed.
5. Growth does not fix informal systems. It exposes them.

## Bottom line

The current site is not wrong. It is too gentle and too explanatory for the buyer Jeff is trying to break through to.

The new site should feel like a contractor looking at the post-job financials and finally naming what happened:

> We did not lose that profit because the field failed.
> We lost it because procurement was never under control.

That is the message to build around.
