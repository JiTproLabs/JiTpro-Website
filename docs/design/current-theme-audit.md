# JiTpro Current Theme Audit

Scope: current visual implementation snapshot. This is an audit only: no redesign, no recommendations, no new color/font/token choices.

Scanned source set: `src/**/*`, `public/**/*.svg`, `tailwind.config.*`, `postcss.config.*`, `vite.config.*`, `package.json`. Excluded `dist`, `node_modules`, `.git`, and documentation prose except this generated audit.

## 1. GLOBAL THEME OVERVIEW

- Primary visual style: a mixed-state React/Tailwind marketing/application codebase. Newer homepage, investor, timeline, and landing-page surfaces lean dark, structured, slate/navy, data-heavy, and amber-accented. Older informational and contact pages still use light `white`/`slate-50` surfaces with slate text and dark slate buttons.
- Primary color palette currently observed: Tailwind slate neutrals, amber accents, red/orange risk colors, white/black overlays, and a small number of blue/emerald/cyan one-offs or legacy/chart colors.
- Dark theme philosophy currently implemented: deep navy/slate canvases (`#030a19`, `slate-950`, `slate-900`), slate cards (`slate-800`), amber signal/CTA accents, and red/orange escalation states.
- Light theme usage: legacy pages, contact forms, footer, documentation/product/role informational pages, and some cards use `bg-white`, `bg-slate-50`, `text-slate-900`, `text-slate-600`, and `border-slate-200/300`.
- Current design direction: shifting toward dark navy/slate surfaces with amber accents and construction/timeline/schedule visuals, while legacy light surfaces and one-off visual implementations remain in the codebase.

## 2. COMPLETE COLOR INVENTORY

### 2.1 Tailwind color utilities

| Color utility | Approx value | Approx frequency | Audit classification | Where it appears |
| --- | --- | --- | --- | --- |
| accent-slate-900 | #0f172a | 12 | Core brand / canvas | src/pages/contact/ArchitectContact.tsx (4), src/pages/contact/ContractorContact.tsx (4), src/pages/contact/OwnerContact.tsx (4) |
| bg-[#030a19] | #030a19 | 7 | Core brand / canvas | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1), src/pages/Home.tsx (1) |
| bg-[#030a19]/40 | #030a19 @ 0.4 | 4 | Core brand / canvas | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| bg-[#0A66C2] | #0A66C2 | 1 | Supporting / legacy / one-off | src/components/Footer.tsx (1) |
| bg-[#0f172a] | #0f172a | 1 | Core brand / canvas | src/components/TypicalScheduleSection.tsx (1) |
| bg-amber-100 | #fef3c7 | 2 | Core brand / accent | src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| bg-amber-300 | #fcd34d | 1 | Core brand / accent | src/components/hero/ProcurementFlowHero.tsx (1) |
| bg-amber-400 | #fbbf24 | 1 | Core brand / accent | src/pages/CompanyProjectHealth.tsx (1) |
| bg-amber-50 | #fffbeb | 4 | Core brand / accent | src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.legacy.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| bg-amber-500 | #f59e0b | 33 | Core brand / accent | src/pages/roles/GeneralContractors.legacy.tsx (6), src/pages/investor/InvestorHome.tsx (3), src/pages/roles/GeneralContractorsConcept.tsx (3), src/pages/Admin.tsx (2), src/pages/BrokenBeforeJobStarts.tsx (2) |
| bg-amber-500/10 | #f59e0b @ 0.1 | 3 | Core brand / accent | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (1) |
| bg-amber-500/15 | #f59e0b @ 0.15 | 1 | Core brand / accent | src/pages/BrokenBeforeJobStarts.tsx (1) |
| bg-amber-500/30 | #f59e0b @ 0.3 | 1 | Core brand / accent | src/pages/investor/EconomicCase.tsx (1) |
| bg-amber-500/40 | #f59e0b @ 0.4 | 1 | Core brand / accent | src/pages/investor/InvestorDeckPage.tsx (1) |
| bg-amber-500/60 | #f59e0b @ 0.6 | 1 | Core brand / accent | src/pages/investor/InvestorDeckPage.tsx (1) |
| bg-amber-500/75 | #f59e0b @ 0.75 | 1 | Core brand / accent | src/components/ControlledProcurementSection.tsx (1) |
| bg-black/30 | #000000 @ 0.3 | 1 | Neutral utility | src/components/TypicalScheduleSection.tsx (1) |
| bg-black/55 | #000000 @ 0.55 | 1 | Neutral utility | src/components/TypicalScheduleSection.tsx (1) |
| bg-blue-50 | #eff6ff | 1 | Supporting / legacy / one-off | src/pages/Why.tsx (1) |
| bg-emerald-300 | #6ee7b7 | 1 | Supporting / legacy / one-off | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| bg-red-300 | #fca5a5 | 1 | Semantic risk / alert | src/components/hero/ProcurementFlowHero.tsx (1) |
| bg-red-400 | #f87171 | 1 | Semantic risk / alert | src/pages/investor/InvestorHome.tsx (1) |
| bg-red-50 | #fef2f2 | 4 | Semantic risk / alert | src/pages/Demo.tsx (1), src/pages/contact/ArchitectContact.tsx (1), src/pages/contact/ContractorContact.tsx (1), src/pages/contact/OwnerContact.tsx (1) |
| bg-red-500/10 | #ef4444 @ 0.1 | 7 | Semantic risk / alert | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/pages/investor/HiddenCost.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| bg-red-500/20 | #ef4444 @ 0.2 | 1 | Semantic risk / alert | src/pages/Admin.tsx (1) |
| bg-red-500/30 | #ef4444 @ 0.3 | 1 | Semantic risk / alert | src/pages/investor/EconomicCase.tsx (1) |
| bg-slate-100 | #f1f5f9 | 1 | Supporting neutral | src/pages/FounderStory.tsx (1) |
| bg-slate-100/60 | #f1f5f9 @ 0.6 | 2 | Supporting neutral | src/components/InteractiveProcurementSchedule.tsx (2) |
| bg-slate-200 | #e2e8f0 | 2 | Supporting neutral | src/pages/HomepageConcept.tsx (2) |
| bg-slate-300 | #cbd5e1 | 1 | Supporting neutral | src/components/ControlledProcurementSection.tsx (1) |
| bg-slate-400 | #94a3b8 | 1 | Supporting neutral | src/components/ControlledProcurementSection.tsx (1) |
| bg-slate-50 | #f8fafc | 37 | Supporting neutral | src/pages/Why.tsx (5), src/components/ControlledProcurementSection.tsx (3), src/pages/HomepageConcept.tsx (3), src/pages/roles/GeneralContractors.legacy.tsx (3), src/pages/roles/GeneralContractors.tsx (3) |
| bg-slate-500 | #64748b | 2 | Supporting neutral | src/pages/investor/WhyNow.tsx (2) |
| bg-slate-500/25 | #64748b @ 0.25 | 1 | Supporting neutral | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| bg-slate-500/30 | #64748b @ 0.3 | 1 | Supporting neutral | src/components/hero/ProcurementFlowHero.tsx (1) |
| bg-slate-600 | #475569 | 1 | Supporting neutral | src/components/TypicalScheduleSection.tsx (1) |
| bg-slate-600/25 | #475569 @ 0.25 | 1 | Supporting neutral | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| bg-slate-700 | #334155 | 8 | Supporting neutral | src/pages/investor/HiddenCost.tsx (2), src/components/ControlledProcurementSection.tsx (1), src/components/Navigation.tsx (1), src/components/TypicalScheduleSection.tsx (1), src/components/investor/InvestorFooter.tsx (1) |
| bg-slate-800 | #1e293b | 40 | Supporting neutral | src/pages/Home.tsx (7), src/pages/investor/WhyNow.tsx (5), src/components/investor/AccessRequestForm.tsx (4), src/pages/investor/InvestorProduct.tsx (4), src/pages/investor/HiddenCost.tsx (3) |
| bg-slate-800/50 | #1e293b @ 0.5 | 2 | Supporting neutral | src/components/timeline/TimelineShow.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| bg-slate-800/90 | #1e293b @ 0.9 | 1 | Supporting neutral | src/components/TypicalScheduleSection.tsx (1) |
| bg-slate-900 | #0f172a | 70 | Core brand / canvas | src/pages/Home.tsx (13), src/pages/investor/HiddenCost.tsx (5), src/pages/investor/EconomicCase.tsx (4), src/pages/investor/InvestorProduct.tsx (4), src/pages/investor/MarketOpportunity.tsx (4) |
| bg-slate-900/40 | #0f172a @ 0.4 | 3 | Core brand / canvas | src/pages/TheRealProcurementTimeline.tsx (2), src/components/timeline/TimelineShow.tsx (1) |
| bg-slate-900/60 | #0f172a @ 0.6 | 1 | Core brand / canvas | src/pages/BrokenBeforeJobStarts.tsx (1) |
| bg-slate-900/85 | #0f172a @ 0.85 | 1 | Core brand / canvas | src/components/hero/MobileHeroSequence.tsx (1) |
| bg-slate-900/95 | #0f172a @ 0.95 | 2 | Core brand / canvas | src/components/investor/InvestorNav.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| bg-slate-950 | #020617 | 25 | Core brand / canvas | src/pages/Home.tsx (5), src/pages/CompanyProjectHealth.tsx (4), src/pages/HomepageConcept.tsx (3), src/components/investor/AccessRequestForm.tsx (2), src/components/investor/InvestorLayout.tsx (2) |
| bg-slate-950/40 | #020617 @ 0.4 | 2 | Core brand / canvas | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| bg-slate-950/85 | #020617 @ 0.85 | 1 | Core brand / canvas | src/components/timeline/TimelineShow.tsx (1) |
| bg-slate-950/90 | #020617 @ 0.9 | 1 | Core brand / canvas | src/components/timeline/TimelineShow.tsx (1) |
| bg-slate-950/96 | #020617 @ 0.96 | 1 | Core brand / canvas | src/components/timeline/TimelineShow.tsx (1) |
| bg-white | #ffffff | 55 | Neutral utility | src/pages/HomepageConcept.tsx (9), src/pages/roles/GeneralContractors.tsx (6), src/pages/roles/GeneralContractorsConcept.tsx (6), src/pages/roles/ArchitectsEngineers.tsx (5), src/pages/roles/OwnersDevelopers.tsx (5) |
| bg-white/85 | #ffffff @ 0.85 | 1 | Neutral utility | src/components/InteractiveProcurementSchedule.tsx (1) |
| bg-white/90 | #ffffff @ 0.9 | 1 | Neutral utility | src/components/TypicalScheduleSection.tsx (1) |
| bg-white/[0.06] | #ffffff @ 0.06 | 2 | Neutral utility | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| border-amber-300/30 | #fcd34d @ 0.3 | 4 | Core brand / accent | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| border-amber-400/30 | #fbbf24 @ 0.3 | 2 | Core brand / accent | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| border-amber-400/35 | #fbbf24 @ 0.35 | 1 | Core brand / accent | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| border-amber-500 | #f59e0b | 4 | Core brand / accent | src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/FounderStory.tsx (1), src/pages/investor/InvestorProduct.tsx (1), src/pages/roles/GeneralContractors.legacy.tsx (1) |
| border-amber-500/20 | #f59e0b @ 0.2 | 2 | Core brand / accent | src/components/timeline/TimelineShow.tsx (1), src/pages/investor/InvestorProduct.tsx (1) |
| border-amber-500/30 | #f59e0b @ 0.3 | 4 | Core brand / accent | src/pages/BrokenBeforeJobStarts.tsx (2), src/pages/investor/InvestorHome.tsx (1), src/pages/investor/WhyNow.tsx (1) |
| border-amber-500/40 | #f59e0b @ 0.4 | 2 | Core brand / accent | src/components/investor/InvestorNav.tsx (2) |
| border-amber-500/50 | #f59e0b @ 0.5 | 1 | Core brand / accent | src/pages/investor/EconomicCase.tsx (1) |
| border-amber-700 | #b45309 | 1 | Core brand / accent | src/components/ControlledProcurementSection.tsx (1) |
| border-red-200 | #fecaca | 4 | Semantic risk / alert | src/pages/Demo.tsx (1), src/pages/contact/ArchitectContact.tsx (1), src/pages/contact/ContractorContact.tsx (1), src/pages/contact/OwnerContact.tsx (1) |
| border-red-300/20 | #fca5a5 @ 0.2 | 4 | Semantic risk / alert | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| border-red-400/30 | #f87171 @ 0.3 | 2 | Semantic risk / alert | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| border-red-500/20 | #ef4444 @ 0.2 | 1 | Semantic risk / alert | src/pages/investor/WhyNow.tsx (1) |
| border-red-500/30 | #ef4444 @ 0.3 | 3 | Semantic risk / alert | src/pages/investor/HiddenCost.tsx (2), src/pages/Admin.tsx (1) |
| border-red-500/50 | #ef4444 @ 0.5 | 1 | Semantic risk / alert | src/pages/investor/EconomicCase.tsx (1) |
| border-slate-100 | #f1f5f9 | 1 | Supporting neutral | src/components/ControlledProcurementSection.tsx (1) |
| border-slate-100/70 | #f1f5f9 @ 0.7 | 2 | Supporting neutral | src/components/InteractiveProcurementSchedule.tsx (2) |
| border-slate-200 | #e2e8f0 | 80 | Supporting neutral | src/components/InteractiveProcurementSchedule.tsx (8), src/pages/roles/ArchitectsEngineers.tsx (8), src/pages/roles/OwnersDevelopers.tsx (8), src/pages/roles/ProjectManagers.tsx (8), src/pages/roles/Subcontractors.tsx (8) |
| border-slate-200/50 | #e2e8f0 @ 0.5 | 1 | Supporting neutral | src/components/InteractiveProcurementSchedule.tsx (1) |
| border-slate-300 | #cbd5e1 | 15 | Supporting neutral | src/pages/HomepageConcept.tsx (7), src/pages/Demo.tsx (5), src/components/TypicalScheduleSection.tsx (2), src/pages/Home.legacy.tsx (1) |
| border-slate-50 | #f8fafc | 1 | Supporting neutral | src/components/InteractiveProcurementSchedule.tsx (1) |
| border-slate-600 | #475569 | 12 | Supporting neutral | src/pages/Home.tsx (7), src/pages/investor/InvestorHome.tsx (3), src/components/Navigation.tsx (1), src/components/TypicalScheduleSection.tsx (1) |
| border-slate-700 | #334155 | 36 | Supporting neutral | src/pages/Home.tsx (6), src/components/investor/AccessRequestForm.tsx (4), src/pages/investor/InvestorAppendix.tsx (4), src/pages/Admin.tsx (3), src/pages/investor/HiddenCost.tsx (3) |
| border-slate-700/50 | #334155 @ 0.5 | 3 | Supporting neutral | src/pages/investor/InvestorAppendix.tsx (2), src/pages/Admin.tsx (1) |
| border-slate-800 | #1e293b | 18 | Supporting neutral | src/components/investor/InvestorNav.tsx (7), src/pages/BrokenBeforeJobStarts.tsx (3), src/pages/TheRealProcurementTimeline.tsx (3), src/components/investor/InvestorFooter.tsx (2), src/components/timeline/TimelineShow.tsx (2) |
| border-slate-800/40 | #1e293b @ 0.4 | 3 | Supporting neutral | src/pages/investor/InvestorDeckPage.tsx (3) |
| border-slate-800/60 | #1e293b @ 0.6 | 11 | Supporting neutral | src/pages/BrokenBeforeJobStarts.tsx (9), src/components/timeline/TimelineShow.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| border-white/10 | #ffffff @ 0.1 | 8 | Neutral utility | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2), src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2) |
| border-white/20 | #ffffff @ 0.2 | 3 | Neutral utility | src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| disabled:bg-slate-400 | #94a3b8 | 4 | Supporting neutral | src/pages/Demo.tsx (1), src/pages/contact/ArchitectContact.tsx (1), src/pages/contact/ContractorContact.tsx (1), src/pages/contact/OwnerContact.tsx (1) |
| focus:border-amber-500 | #f59e0b | 12 | Core brand / accent | src/pages/Home.tsx (7), src/components/investor/AccessRequestForm.tsx (4), src/pages/Admin.tsx (1) |
| focus:border-slate-900 | #0f172a | 12 | Core brand / canvas | src/pages/HomepageConcept.tsx (7), src/pages/Demo.tsx (5) |
| from-[#030a19] | #030a19 | 2 | Core brand / canvas | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| from-[#030a19]/55 | #030a19 @ 0.55 | 2 | Core brand / canvas | src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| from-[#030a19]/60 | #030a19 @ 0.6 | 2 | Core brand / canvas | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| from-[#030a19]/85 | #030a19 @ 0.85 | 1 | Core brand / canvas | src/components/hero/ProcurementFlowHero.tsx (1) |
| from-[#030a19]/90 | #030a19 @ 0.9 | 1 | Core brand / canvas | src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| from-amber-300/40 | #fcd34d @ 0.4 | 2 | Core brand / accent | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| from-amber-500 | #f59e0b | 1 | Core brand / accent | src/pages/investor/HiddenCost.tsx (1) |
| from-amber-500/10 | #f59e0b @ 0.1 | 2 | Core brand / accent | src/pages/BrokenBeforeJobStarts.tsx (2) |
| from-white | #ffffff | 2 | Neutral utility | src/pages/FAQ.tsx (2) |
| group-hover:bg-white | #ffffff | 1 | Neutral utility | src/components/TypicalScheduleSection.tsx (1) |
| group-hover:text-amber-600 | #d97706 | 2 | Core brand / accent | src/pages/Roles.tsx (2) |
| group-hover:text-slate-700 | #334155 | 1 | Supporting neutral | src/components/faq/FaqAccordionItem.tsx (1) |
| hover:bg-[#004182] | #004182 | 1 | One-off / decorative / inspect | src/components/Footer.tsx (1) |
| hover:bg-amber-400 | #fbbf24 | 16 | Core brand / accent | src/pages/Admin.tsx (2), src/pages/BrokenBeforeJobStarts.tsx (2), src/pages/investor/InvestorHome.tsx (2), src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2) |
| hover:bg-amber-500/10 | #f59e0b @ 0.1 | 2 | Core brand / accent | src/components/investor/InvestorNav.tsx (2) |
| hover:bg-black/75 | #000000 @ 0.75 | 1 | Neutral utility | src/components/TypicalScheduleSection.tsx (1) |
| hover:bg-red-500/30 | #ef4444 @ 0.3 | 1 | Semantic risk / alert | src/pages/Admin.tsx (1) |
| hover:bg-slate-100 | #f1f5f9 | 9 | Supporting neutral | src/components/InteractiveProcurementSchedule.tsx (2), src/pages/FAQ.tsx (2), src/pages/roles/ArchitectsEngineers.tsx (1), src/pages/roles/GeneralContractors.legacy.tsx (1), src/pages/roles/OwnersDevelopers.tsx (1) |
| hover:bg-slate-50/50 | #f8fafc @ 0.5 | 1 | Supporting neutral | src/components/InteractiveProcurementSchedule.tsx (1) |
| hover:bg-slate-800 | #1e293b | 11 | Supporting neutral | src/pages/Demo.tsx (1), src/pages/Home.legacy.tsx (1), src/pages/HomepageConcept.tsx (1), src/pages/Product.tsx (1), src/pages/Roles.tsx (1) |
| hover:bg-slate-900/60 | #0f172a @ 0.6 | 2 | Core brand / canvas | src/components/timeline/TimelineShow.tsx (2) |
| hover:bg-slate-900/70 | #0f172a @ 0.7 | 1 | Core brand / canvas | src/pages/TheRealProcurementTimeline.tsx (1) |
| hover:border-amber-300 | #fcd34d | 3 | Core brand / accent | src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| hover:border-amber-500/50 | #f59e0b @ 0.5 | 1 | Core brand / accent | src/pages/Home.tsx (1) |
| hover:border-amber-500/60 | #f59e0b @ 0.6 | 1 | Core brand / accent | src/components/timeline/TimelineShow.tsx (1) |
| hover:border-slate-400 | #94a3b8 | 6 | Supporting neutral | src/pages/investor/InvestorHome.tsx (3), src/components/InteractiveProcurementSchedule.tsx (2), src/pages/Roles.tsx (1) |
| hover:border-slate-900 | #0f172a | 1 | Core brand / canvas | src/pages/Home.legacy.tsx (1) |
| hover:border-white/30 | #ffffff @ 0.3 | 4 | Neutral utility | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| hover:border-white/45 | #ffffff @ 0.45 | 3 | Neutral utility | src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| hover:text-amber-200 | #fde68a | 2 | Core brand / accent | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| hover:text-amber-300 | #fcd34d | 1 | Core brand / accent | src/pages/Home.legacy.tsx (1) |
| hover:text-amber-400 | #fbbf24 | 4 | Core brand / accent | src/components/timeline/TimelineShow.tsx (2), src/pages/Home.tsx (2) |
| hover:text-amber-500 | #f59e0b | 3 | Core brand / accent | src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1), src/pages/investor/InvestorAppendix.tsx (1) |
| hover:text-amber-700 | #b45309 | 4 | Core brand / accent | src/pages/Home.legacy.tsx (2), src/pages/HomepageConcept.tsx (2) |
| hover:text-slate-100 | #f1f5f9 | 3 | Supporting neutral | src/pages/investor/InvestorHome.tsx (3) |
| hover:text-slate-200 | #e2e8f0 | 2 | Supporting neutral | src/components/investor/InvestorNav.tsx (1), src/pages/Admin.tsx (1) |
| hover:text-slate-300 | #cbd5e1 | 1 | Supporting neutral | src/components/investor/InvestorFooter.tsx (1) |
| hover:text-slate-600 | #475569 | 1 | Supporting neutral | src/components/Footer.tsx (1) |
| hover:text-slate-700 | #334155 | 2 | Supporting neutral | src/pages/FAQ.tsx (2) |
| hover:text-slate-900 | #0f172a | 12 | Core brand / canvas | src/components/Footer.tsx (11), src/pages/ThankYou.tsx (1) |
| hover:text-white | #ffffff | 1 | Neutral utility | src/components/timeline/TimelineShow.tsx (1) |
| hover:text-white/85 | #ffffff @ 0.85 | 4 | Neutral utility | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| text-amber-100 | #fef3c7 | 4 | Core brand / accent | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| text-amber-200/95 | #fde68a @ 0.95 | 2 | Core brand / accent | src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| text-amber-300 | #fcd34d | 21 | Core brand / accent | src/pages/Home.tsx (8), src/pages/HomepageConcept.tsx (8), src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2), src/components/TypicalScheduleSection.tsx (1) |
| text-amber-300/60 | #fcd34d @ 0.6 | 2 | Core brand / accent | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| text-amber-300/80 | #fcd34d @ 0.8 | 1 | Core brand / accent | src/components/TypicalScheduleSection.tsx (1) |
| text-amber-300/85 | #fcd34d @ 0.85 | 2 | Core brand / accent | src/components/hero/_archive/JitproGanttAnimation.tsx (2) |
| text-amber-300/90 | #fcd34d @ 0.9 | 5 | Core brand / accent | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2), src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| text-amber-400 | #fbbf24 | 2 | Core brand / accent | src/components/timeline/TimelineShow.tsx (1), src/pages/Home.legacy.tsx (1) |
| text-amber-500 | #f59e0b | 54 | Core brand / accent | src/pages/BrokenBeforeJobStarts.tsx (21), src/pages/Home.tsx (10), src/pages/investor/InvestorAppendix.tsx (4), src/pages/investor/WhyNow.tsx (4), src/pages/investor/InvestorProduct.tsx (3) |
| text-amber-500/60 | #f59e0b @ 0.6 | 1 | Core brand / accent | src/pages/investor/WhyNow.tsx (1) |
| text-amber-500/70 | #f59e0b @ 0.7 | 2 | Core brand / accent | src/pages/investor/InvestorAppendix.tsx (1), src/pages/investor/InvestorDeckPage.tsx (1) |
| text-amber-500/80 | #f59e0b @ 0.8 | 1 | Core brand / accent | src/pages/investor/InvestorDeckPage.tsx (1) |
| text-amber-600 | #d97706 | 30 | Core brand / accent | src/pages/HomepageConcept.tsx (8), src/pages/roles/GeneralContractors.tsx (5), src/pages/roles/GeneralContractorsConcept.tsx (5), src/pages/Home.legacy.tsx (2), src/pages/roles/GeneralContractors.legacy.tsx (2) |
| text-amber-700 | #b45309 | 4 | Core brand / accent | src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2) |
| text-emerald-200/95 | #a7f3d0 @ 0.95 | 1 | Supporting / legacy / one-off | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| text-red-100 | #fee2e2 | 6 | Semantic risk / alert | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| text-red-300 | #fca5a5 | 7 | Semantic risk / alert | src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2), src/components/hero/ProcurementFlowHero.tsx (1), src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| text-red-400 | #f87171 | 10 | Semantic risk / alert | src/pages/Admin.tsx (3), src/pages/investor/HiddenCost.tsx (2), src/pages/investor/WhyNow.tsx (2), src/components/TypicalScheduleSection.tsx (1), src/components/investor/AccessRequestForm.tsx (1) |
| text-red-800 | #991b1b | 4 | Semantic risk / alert | src/pages/Demo.tsx (1), src/pages/contact/ArchitectContact.tsx (1), src/pages/contact/ContractorContact.tsx (1), src/pages/contact/OwnerContact.tsx (1) |
| text-slate-100 | #f1f5f9 | 79 | Supporting neutral | src/pages/Home.tsx (25), src/pages/BrokenBeforeJobStarts.tsx (15), src/pages/CompanyProjectHealth.tsx (7), src/pages/investor/InvestorDeckPage.tsx (7), src/components/investor/AccessRequestForm.tsx (6) |
| text-slate-200 | #e2e8f0 | 28 | Supporting neutral | src/pages/Home.tsx (5), src/pages/HomepageConcept.tsx (5), src/pages/CompanyProjectHealth.tsx (3), src/components/TypicalScheduleSection.tsx (2), src/pages/BrokenBeforeJobStarts.tsx (2) |
| text-slate-300 | #cbd5e1 | 108 | Supporting neutral | src/pages/BrokenBeforeJobStarts.tsx (18), src/pages/investor/WhyNow.tsx (9), src/pages/investor/HiddenCost.tsx (8), src/pages/investor/MarketOpportunity.tsx (8), src/pages/CompanyProjectHealth.tsx (7) |
| text-slate-300/85 | #cbd5e1 @ 0.85 | 2 | Supporting neutral | src/components/hero/_archive/JitproGanttAnimation.tsx (2) |
| text-slate-400 | #94a3b8 | 91 | Supporting neutral | src/pages/investor/InvestorAppendix.tsx (15), src/pages/Home.tsx (13), src/components/investor/AccessRequestForm.tsx (6), src/pages/TheRealProcurementTimeline.tsx (5), src/pages/CompanyProjectHealth.tsx (4) |
| text-slate-500 | #64748b | 67 | Supporting neutral | src/pages/Admin.tsx (12), src/pages/investor/InvestorAppendix.tsx (10), src/pages/investor/HiddenCost.tsx (5), src/pages/investor/EconomicCase.tsx (4), src/pages/investor/WhyNow.tsx (4) |
| text-slate-600 | #475569 | 235 | Supporting neutral | src/pages/Why.tsx (76), src/components/Footer.tsx (13), src/pages/roles/ArchitectsEngineers.tsx (12), src/pages/roles/OwnersDevelopers.tsx (12), src/pages/roles/ProjectManagers.tsx (12) |
| text-slate-700 | #334155 | 20 | Supporting neutral | src/pages/roles/GeneralContractors.legacy.tsx (5), src/pages/FounderStory.tsx (4), src/pages/HomepageConcept.tsx (3), src/pages/Home.legacy.tsx (2), src/pages/roles/GeneralContractors.tsx (2) |
| text-slate-800 | #1e293b | 9 | Supporting neutral | src/pages/Why.tsx (6), src/pages/roles/GeneralContractors.legacy.tsx (2), src/components/TypicalScheduleSection.tsx (1) |
| text-slate-900 | #0f172a | 200 | Core brand / canvas | src/pages/HomepageConcept.tsx (26), src/pages/roles/ArchitectsEngineers.tsx (14), src/pages/roles/OwnersDevelopers.tsx (14), src/pages/roles/ProjectManagers.tsx (14), src/pages/roles/Subcontractors.tsx (14) |
| text-slate-950 | #020617 | 14 | Core brand / canvas | src/pages/HomepageConcept.tsx (3), src/pages/roles/GeneralContractorsConcept.tsx (3), src/pages/BrokenBeforeJobStarts.tsx (2), src/pages/roles/GeneralContractors.tsx (2), src/components/timeline/TimelineShow.tsx (1) |
| text-white | #ffffff | 51 | Neutral utility | src/pages/HomepageConcept.tsx (8), src/pages/Home.tsx (6), src/pages/roles/GeneralContractors.tsx (6), src/pages/roles/GeneralContractorsConcept.tsx (6), src/components/TypicalScheduleSection.tsx (2) |
| text-white/45 | #ffffff @ 0.45 | 4 | Neutral utility | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| text-white/90 | #ffffff @ 0.9 | 1 | Neutral utility | src/components/TypicalScheduleSection.tsx (1) |
| text-white/95 | #ffffff @ 0.95 | 1 | Neutral utility | src/components/ControlledProcurementSection.tsx (1) |
| to-[#030a19]/30 | #030a19 @ 0.3 | 3 | Core brand / canvas | src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| to-[#030a19]/60 | #030a19 @ 0.6 | 2 | Core brand / canvas | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| to-[#030a19]/70 | #030a19 @ 0.7 | 1 | Core brand / canvas | src/components/hero/MobileHeroSequence.tsx (1) |
| to-red-300/40 | #fca5a5 @ 0.4 | 2 | Semantic risk / alert | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| to-red-500 | #ef4444 | 1 | Semantic risk / alert | src/pages/investor/HiddenCost.tsx (1) |
| to-slate-900/40 | #0f172a @ 0.4 | 2 | Core brand / canvas | src/pages/BrokenBeforeJobStarts.tsx (2) |
| to-transparent | transparent | 4 | Neutral utility | src/pages/FAQ.tsx (2), src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| via-[#030a19]/20 | #030a19 @ 0.2 | 1 | Core brand / canvas | src/components/hero/ProcurementFlowHero.tsx (1) |
| via-[#030a19]/30 | #030a19 @ 0.3 | 2 | Core brand / canvas | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| via-[#030a19]/92 | #030a19 @ 0.92 | 2 | Core brand / canvas | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| via-amber-300/30 | #fcd34d @ 0.3 | 2 | Core brand / accent | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| via-transparent | transparent | 3 | Neutral utility | src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| via-white/80 | #ffffff @ 0.8 | 2 | Neutral utility | src/pages/FAQ.tsx (2) |

### 2.2 Arbitrary hex and hex literals

| Hex | Approx frequency | Audit classification | Where it appears |
| --- | --- | --- | --- |
| #000 | 1 | One-off / decorative / inspect | public/jitpro-logo_(1).svg (1) |
| #000000 | 1 | Neutral utility | public/jitpro-logo_(1).svg (1) |
| #004182 | 1 | One-off / decorative / inspect | src/components/Footer.tsx (1) |
| #030a19 | 31 | Core brand / canvas | src/components/hero/MobileHeroSequence.tsx (8), src/components/hero/ProcurementFlowHero.tsx (7), src/components/hero/ProcurementFlowHero.legacy.tsx (5), src/pages/Home.tsx (4), src/pages/HomepageConcept.tsx (4), src/components/hero/_archive/JitproGanttAnimation.tsx (3) |
| #0A66C2 | 1 | Supporting / legacy / one-off | src/components/Footer.tsx (1) |
| #0f172a | 1 | Core brand / canvas | src/components/TypicalScheduleSection.tsx (1) |
| #111 | 438 | One-off / decorative / inspect | src/content/procurementScheduleSnapshot.json (438) |
| #17becf | 42 | One-off / decorative / inspect | src/content/procurementScheduleSnapshot.json (42) |
| #1e293b | 22 | Supporting neutral | public/assets/logo/JiTpro_Amber.svg (21), src/components/JiTproWordmark.tsx (1) |
| #1f77b4 | 84 | One-off / decorative / inspect | src/content/procurementScheduleSnapshot.json (84) |
| #231f20 | 18 | One-off / decorative / inspect | public/assets/logo/JiTpro_Amber_white_text.svg (18) |
| #2ca02c | 18 | One-off / decorative / inspect | src/content/procurementScheduleSnapshot.json (18) |
| #34d399 | 4 | Supporting / legacy / one-off | src/components/hero/ProcurementFlowHero.legacy.tsx (4) |
| #38bdf8 | 1 | Supporting / legacy / one-off | src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| #475569 | 2 | Supporting neutral | src/components/InteractiveProcurementSchedule.tsx (2) |
| #555 | 42 | One-off / decorative / inspect | src/content/procurementScheduleSnapshot.json (42) |
| #6ee7b7 | 1 | Supporting / legacy / one-off | src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| #8482 | 1 | One-off / decorative / inspect | public/jitpro-logo_(1).svg (1) |
| #9467bd | 42 | One-off / decorative / inspect | src/content/procurementScheduleSnapshot.json (42) |
| #9632 | 8 | One-off / decorative / inspect | src/pages/BrokenBeforeJobStarts.tsx (8) |
| #c1121f | 1 | Semantic risk / alert | src/pages/Home.tsx (1) |
| #d62728 | 75 | One-off / decorative / inspect | src/content/procurementScheduleSnapshot.json (75) |
| #dc2626 | 1 | Semantic risk / alert | src/pages/Home.tsx (1) |
| #ea580c | 1 | Semantic risk / alert | src/pages/Home.tsx (1) |
| #f59e0b | 14 | Core brand / accent | public/assets/logo/JiTpro_Amber.svg (6), public/assets/logo/JiTpro_Amber_white_text.svg (6), src/components/JiTproWordmark.tsx (1), src/pages/Home.tsx (1) |
| #f97316 | 1 | Semantic risk / alert | src/pages/Home.tsx (1) |
| #fbbf24 | 2 | Core brand / accent | src/components/hero/ProcurementFlowHero.legacy.tsx (2) |
| #fcd34d | 1 | Core brand / accent | src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| #ff0000 | 1 | Semantic risk / alert | src/pages/Home.tsx (1) |
| #ff7f0e | 51 | One-off / decorative / inspect | src/content/procurementScheduleSnapshot.json (51) |
| #ffffff | 21 | Neutral utility | public/assets/logo/JiTpro_Amber_white_text.svg (21) |

### 2.3 RGB/RGBA literals

| RGB/RGBA | Approx frequency | Audit classification | Where it appears |
| --- | --- | --- | --- |
| rgb(${r}, ${g}, ${b}) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.tsx (1) |
| rgb(100 116 139) | 1 | One-off / decorative / inspect | src/pages/investor/InvestorDeckPage.tsx (1) |
| rgb(148, 163, 184) | 1 | One-off / decorative / inspect | src/components/TypicalScheduleSection.tsx (1) |
| rgb(15, 23, 42) | 1 | One-off / decorative / inspect | src/components/ControlledProcurementSection.tsx (1) |
| rgb(180,130,40) | 2 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.legacy.tsx (2) |
| rgb(180,130,45) | 1 | One-off / decorative / inspect | src/components/hero/ArchitecturalOutcome.tsx (1) |
| rgb(203, 213, 225) | 1 | One-off / decorative / inspect | src/components/TypicalScheduleSection.tsx (1) |
| rgb(220, 38, 38) | 1 | One-off / decorative / inspect | src/components/TypicalScheduleSection.tsx (1) |
| rgb(220,160,50) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| rgb(245 158 11) | 2 | One-off / decorative / inspect | src/pages/investor/InvestorDeckPage.tsx (2) |
| rgb(245,158,11) | 5 | Core brand / accent | src/components/hero/ProcurementFlowHero.legacy.tsx (5) |
| rgb(251,191,36) | 3 | Core brand / accent | src/components/hero/ProcurementFlowHero.legacy.tsx (2), src/components/hero/ArchitecturalOutcome.tsx (1) |
| rgb(252,211,77) | 2 | Core brand / accent | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| rgb(253,224,71) | 10 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.legacy.tsx (10) |
| rgb(254, 226, 226) | 1 | One-off / decorative / inspect | src/components/TypicalScheduleSection.tsx (1) |
| rgb(254,243,199) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.tsx (1) |
| rgb(30, 41, 59) | 1 | One-off / decorative / inspect | src/index.css (1) |
| rgb(51, 65, 85) | 1 | One-off / decorative / inspect | src/components/ControlledProcurementSection.tsx (1) |
| rgb(71 85 105) | 1 | One-off / decorative / inspect | src/pages/investor/InvestorDeckPage.tsx (1) |
| rgba(0, 0, 0, ${0.4 * chromeOpacity}) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(0,0,0,0.2) | 1 | One-off / decorative / inspect | src/components/hero/ArchitecturalOutcome.tsx (1) |
| rgba(0,0,0,0.35) | 1 | One-off / decorative / inspect | src/components/TypicalScheduleSection.tsx (1) |
| rgba(0,0,0,0.6) | 1 | One-off / decorative / inspect | src/components/TypicalScheduleSection.tsx (1) |
| rgba(10,7,3,0.4) | 1 | One-off / decorative / inspect | src/components/hero/ArchitecturalOutcome.tsx (1) |
| rgba(10,7,3,0.6) | 1 | One-off / decorative / inspect | src/components/hero/ArchitecturalOutcome.tsx (1) |
| rgba(100,116,139,0.35) | 2 | One-off / decorative / inspect | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(100,116,139,0.40) | 1 | One-off / decorative / inspect | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| rgba(110,231,183,0.35) | 1 | One-off / decorative / inspect | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| rgba(148, 163, 184, 0.45) | 1 | One-off / decorative / inspect | src/components/TypicalScheduleSection.tsx (1) |
| rgba(148, 163, 184, 0.85) | 2 | One-off / decorative / inspect | src/components/TypicalScheduleSection.tsx (2) |
| rgba(148, 163, 184, 0.95) | 1 | One-off / decorative / inspect | src/components/TypicalScheduleSection.tsx (1) |
| rgba(148,163,184,0.30) | 1 | One-off / decorative / inspect | src/components/TypicalScheduleSection.tsx (1) |
| rgba(148,163,184,0.45) | 1 | One-off / decorative / inspect | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| rgba(148,163,184,0.55) | 3 | One-off / decorative / inspect | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| rgba(148,163,184,0.6) | 2 | One-off / decorative / inspect | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(15, 23, 42, ${0.85 * chromeOpacity}) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(15,10,5,0.5) | 2 | One-off / decorative / inspect | src/components/hero/ArchitecturalOutcome.tsx (2) |
| rgba(15,23,42,0.88) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| rgba(160,110,30,0.04) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| rgba(180, 83, 9, 1) | 1 | One-off / decorative / inspect | src/components/ControlledProcurementSection.tsx (1) |
| rgba(180,120,30,0.05) | 1 | One-off / decorative / inspect | src/components/hero/ArchitecturalOutcome.tsx (1) |
| rgba(203, 213, 225, 0.9) | 1 | One-off / decorative / inspect | src/components/TypicalScheduleSection.tsx (1) |
| rgba(203,213,225,0.85) | 2 | One-off / decorative / inspect | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(217,119,6,0.32) | 1 | One-off / decorative / inspect | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| rgba(220, 38, 38, 1) | 1 | One-off / decorative / inspect | src/components/TypicalScheduleSection.tsx (1) |
| rgba(220,38,38,0.34) | 2 | One-off / decorative / inspect | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(220,38,38,0.4) | 1 | One-off / decorative / inspect | src/components/hero/MobileHeroSequence.tsx (1) |
| rgba(220,38,38,0.45) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(220,38,38,0.5) | 1 | One-off / decorative / inspect | src/components/hero/MobileHeroSequence.tsx (1) |
| rgba(220,38,38,0.55) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(220,38,38,0.7) | 1 | One-off / decorative / inspect | src/components/hero/MobileHeroSequence.tsx (1) |
| rgba(220,38,38,0.85) | 4 | One-off / decorative / inspect | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| rgba(220,38,38,0.95) | 2 | One-off / decorative / inspect | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(226,232,240,0.9) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(239,68,68,0.35) | 1 | One-off / decorative / inspect | src/components/timeline/TimelineShow.tsx (1) |
| rgba(245, 158, 11, ${0.25 + morphT * 0.55}) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(245, 158, 11, ${0.40 * chromeOpacity}) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(245, 158, 11, ${0.70 * chromeOpacity}) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(245, 158, 11, 0.78) | 1 | One-off / decorative / inspect | src/components/ControlledProcurementSection.tsx (1) |
| rgba(245, 158, 11, 1) | 1 | One-off / decorative / inspect | src/components/TypicalScheduleSection.tsx (1) |
| rgba(245,158,11,0.20) | 2 | Core brand / accent | src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| rgba(245,158,11,0.22) | 2 | Core brand / accent | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| rgba(245,158,11,0.25) | 2 | Core brand / accent | src/components/hero/ProcurementFlowHero.legacy.tsx (2) |
| rgba(245,158,11,0.32) | 3 | Core brand / accent | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| rgba(245,158,11,0.35) | 3 | Core brand / accent | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/timeline/TimelineShow.tsx (1) |
| rgba(245,158,11,0.4) | 3 | Core brand / accent | src/components/hero/ProcurementFlowHero.tsx (2), src/components/hero/MobileHeroSequence.tsx (1) |
| rgba(245,158,11,0.40) | 1 | Core brand / accent | src/components/hero/MobileHeroSequence.tsx (1) |
| rgba(245,158,11,0.42) | 1 | Core brand / accent | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| rgba(245,158,11,0.45) | 1 | Core brand / accent | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| rgba(245,158,11,0.5) | 2 | Core brand / accent | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| rgba(245,158,11,0.55) | 3 | Core brand / accent | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| rgba(245,158,11,0.7) | 1 | Core brand / accent | src/components/hero/MobileHeroSequence.tsx (1) |
| rgba(245,158,11,0.85) | 3 | Core brand / accent | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| rgba(248, 113, 113, 0.85) | 1 | One-off / decorative / inspect | src/components/TypicalScheduleSection.tsx (1) |
| rgba(248,113,113,0.45) | 2 | One-off / decorative / inspect | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(25,18,8,0.35) | 1 | One-off / decorative / inspect | src/components/hero/ArchitecturalOutcome.tsx (1) |
| rgba(251, 191, 36, ${0.80 * chromeOpacity}) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(251, 191, 36, ${chromeOpacity}) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(251,191,36,0.01) | 2 | Core brand / accent | src/components/hero/ArchitecturalOutcome.tsx (2) |
| rgba(251,191,36,0.015) | 1 | Core brand / accent | src/components/hero/ArchitecturalOutcome.tsx (1) |
| rgba(251,191,36,0.02) | 1 | Core brand / accent | src/components/hero/ArchitecturalOutcome.tsx (1) |
| rgba(251,191,36,0.04) | 1 | Core brand / accent | src/components/hero/ArchitecturalOutcome.tsx (1) |
| rgba(251,191,36,0.18) | 1 | Core brand / accent | src/components/hero/ArchitecturalOutcome.tsx (1) |
| rgba(251,191,36,0.2) | 1 | Core brand / accent | src/components/hero/ArchitecturalOutcome.tsx (1) |
| rgba(251,191,36,0.35) | 1 | Core brand / accent | src/components/hero/ArchitecturalOutcome.tsx (1) |
| rgba(251,191,36,0.80) | 1 | Core brand / accent | src/components/hero/MobileHeroSequence.tsx (1) |
| rgba(252, 211, 77, 0.70) | 1 | One-off / decorative / inspect | src/components/TypicalScheduleSection.tsx (1) |
| rgba(253,224,71,0.42) | 1 | One-off / decorative / inspect | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| rgba(253,224,71,0.6) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| rgba(253,224,71,0.7) | 1 | One-off / decorative / inspect | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| rgba(253,224,71,0.8) | 2 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.legacy.tsx (2) |
| rgba(253,224,71,0.85) | 1 | One-off / decorative / inspect | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| rgba(253,224,71,0.95) | 4 | One-off / decorative / inspect | src/components/hero/_archive/JitproGanttAnimation.tsx (2), src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(254,226,226,0.95) | 4 | One-off / decorative / inspect | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| rgba(254,243,199,0.95) | 2 | One-off / decorative / inspect | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| rgba(255,255,255,0.12) | 1 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| rgba(255,255,255,0.95) | 2 | One-off / decorative / inspect | src/components/hero/ProcurementFlowHero.legacy.tsx (2) |
| rgba(34,211,238,0.35) | 1 | One-off / decorative / inspect | src/components/timeline/TimelineShow.tsx (1) |
| rgba(51,65,85,0.3) | 1 | One-off / decorative / inspect | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| rgba(59,130,246,0.12) | 4 | One-off / decorative / inspect | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| rgba(71,85,105,0.4) | 1 | One-off / decorative / inspect | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |

### 2.4 CSS variables, SVG colors, and gradient colors

- CSS variable definitions: none found in scanned implementation files.

- SVG colors are included above when represented as hex, rgb, rgba, `fill`, or `stroke` literals in `public/**/*.svg` and inline SVG React components.
- Gradient colors are included above as Tailwind `from-*`, `via-*`, `to-*` utilities and CSS `radial-gradient` / `linear-gradient` literals. See Section 11 for gradient usage lines.

## 3. GROUP COLORS BY PURPOSE

### Alerts / Errors / Risk Text

| Color token/class | Approx frequency | Approx value | Primary file references |
| --- | --- | --- | --- |
| text-red-100 | 6 | #fee2e2 | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/pages/roles/GeneralContractors.tsx (1) |
| text-red-300 | 7 | #fca5a5 | src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2), src/components/hero/ProcurementFlowHero.tsx (1) |
| text-red-400 | 10 | #f87171 | src/pages/Admin.tsx (3), src/pages/investor/HiddenCost.tsx (2), src/pages/investor/WhyNow.tsx (2) |
| text-red-800 | 4 | #991b1b | src/pages/Demo.tsx (1), src/pages/contact/ArchitectContact.tsx (1), src/pages/contact/ContractorContact.tsx (1) |

### Alerts / Errors / Risk Tint

| Color token/class | Approx frequency | Approx value | Primary file references |
| --- | --- | --- | --- |
| bg-red-300 | 1 | #fca5a5 | src/components/hero/ProcurementFlowHero.tsx (1) |
| bg-red-400 | 1 | #f87171 | src/pages/investor/InvestorHome.tsx (1) |
| bg-red-50 | 4 | #fef2f2 | src/pages/Demo.tsx (1), src/pages/contact/ArchitectContact.tsx (1), src/pages/contact/ContractorContact.tsx (1) |
| bg-red-500/10 | 7 | #ef4444 @ 0.1 | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/pages/investor/HiddenCost.tsx (1) |
| bg-red-500/20 | 1 | #ef4444 @ 0.2 | src/pages/Admin.tsx (1) |
| bg-red-500/30 | 1 | #ef4444 @ 0.3 | src/pages/investor/EconomicCase.tsx (1) |
| hover:bg-red-500/30 | 1 | #ef4444 @ 0.3 | src/pages/Admin.tsx (1) |

### Backgrounds / Other

| Color token/class | Approx frequency | Approx value | Primary file references |
| --- | --- | --- | --- |
| bg-[#0A66C2] | 1 | #0A66C2 | src/components/Footer.tsx (1) |
| bg-[#0f172a] | 1 | #0f172a | src/components/TypicalScheduleSection.tsx (1) |
| bg-black/30 | 1 | #000000 @ 0.3 | src/components/TypicalScheduleSection.tsx (1) |
| bg-black/55 | 1 | #000000 @ 0.55 | src/components/TypicalScheduleSection.tsx (1) |
| bg-slate-200 | 2 | #e2e8f0 | src/pages/HomepageConcept.tsx (2) |
| bg-slate-300 | 1 | #cbd5e1 | src/components/ControlledProcurementSection.tsx (1) |
| bg-slate-400 | 1 | #94a3b8 | src/components/ControlledProcurementSection.tsx (1) |
| bg-slate-600 | 1 | #475569 | src/components/TypicalScheduleSection.tsx (1) |
| bg-slate-600/25 | 1 | #475569 @ 0.25 | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| disabled:bg-slate-400 | 4 | #94a3b8 | src/pages/Demo.tsx (1), src/pages/contact/ArchitectContact.tsx (1), src/pages/contact/ContractorContact.tsx (1) |
| hover:bg-[#004182] | 1 | #004182 | src/components/Footer.tsx (1) |
| hover:bg-black/75 | 1 | #000000 @ 0.75 | src/components/TypicalScheduleSection.tsx (1) |

### Borders

| Color token/class | Approx frequency | Approx value | Primary file references |
| --- | --- | --- | --- |
| border-amber-300/30 | 4 | #fcd34d @ 0.3 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1) |
| border-amber-400/30 | 2 | #fbbf24 @ 0.3 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| border-amber-400/35 | 1 | #fbbf24 @ 0.35 | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| border-amber-500 | 4 | #f59e0b | src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/FounderStory.tsx (1), src/pages/investor/InvestorProduct.tsx (1) |
| border-amber-500/20 | 2 | #f59e0b @ 0.2 | src/components/timeline/TimelineShow.tsx (1), src/pages/investor/InvestorProduct.tsx (1) |
| border-amber-500/30 | 4 | #f59e0b @ 0.3 | src/pages/BrokenBeforeJobStarts.tsx (2), src/pages/investor/InvestorHome.tsx (1), src/pages/investor/WhyNow.tsx (1) |
| border-amber-500/40 | 2 | #f59e0b @ 0.4 | src/components/investor/InvestorNav.tsx (2) |
| border-amber-500/50 | 1 | #f59e0b @ 0.5 | src/pages/investor/EconomicCase.tsx (1) |
| border-amber-700 | 1 | #b45309 | src/components/ControlledProcurementSection.tsx (1) |
| border-red-200 | 4 | #fecaca | src/pages/Demo.tsx (1), src/pages/contact/ArchitectContact.tsx (1), src/pages/contact/ContractorContact.tsx (1) |
| border-red-300/20 | 4 | #fca5a5 @ 0.2 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1) |
| border-red-400/30 | 2 | #f87171 @ 0.3 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| border-red-500/20 | 1 | #ef4444 @ 0.2 | src/pages/investor/WhyNow.tsx (1) |
| border-red-500/30 | 3 | #ef4444 @ 0.3 | src/pages/investor/HiddenCost.tsx (2), src/pages/Admin.tsx (1) |
| border-red-500/50 | 1 | #ef4444 @ 0.5 | src/pages/investor/EconomicCase.tsx (1) |
| border-slate-100 | 1 | #f1f5f9 | src/components/ControlledProcurementSection.tsx (1) |
| border-slate-100/70 | 2 | #f1f5f9 @ 0.7 | src/components/InteractiveProcurementSchedule.tsx (2) |
| border-slate-200 | 80 | #e2e8f0 | src/components/InteractiveProcurementSchedule.tsx (8), src/pages/roles/ArchitectsEngineers.tsx (8), src/pages/roles/OwnersDevelopers.tsx (8) |
| border-slate-200/50 | 1 | #e2e8f0 @ 0.5 | src/components/InteractiveProcurementSchedule.tsx (1) |
| border-slate-300 | 15 | #cbd5e1 | src/pages/HomepageConcept.tsx (7), src/pages/Demo.tsx (5), src/components/TypicalScheduleSection.tsx (2) |
| border-slate-50 | 1 | #f8fafc | src/components/InteractiveProcurementSchedule.tsx (1) |
| border-slate-600 | 12 | #475569 | src/pages/Home.tsx (7), src/pages/investor/InvestorHome.tsx (3), src/components/Navigation.tsx (1) |
| border-slate-700 | 36 | #334155 | src/pages/Home.tsx (6), src/components/investor/AccessRequestForm.tsx (4), src/pages/investor/InvestorAppendix.tsx (4) |
| border-slate-700/50 | 3 | #334155 @ 0.5 | src/pages/investor/InvestorAppendix.tsx (2), src/pages/Admin.tsx (1) |
| border-slate-800 | 18 | #1e293b | src/components/investor/InvestorNav.tsx (7), src/pages/BrokenBeforeJobStarts.tsx (3), src/pages/TheRealProcurementTimeline.tsx (3) |
| border-slate-800/40 | 3 | #1e293b @ 0.4 | src/pages/investor/InvestorDeckPage.tsx (3) |
| border-slate-800/60 | 11 | #1e293b @ 0.6 | src/pages/BrokenBeforeJobStarts.tsx (9), src/components/timeline/TimelineShow.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| border-white/10 | 8 | #ffffff @ 0.1 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2), src/pages/Home.tsx (2) |
| border-white/20 | 3 | #ffffff @ 0.2 | src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| focus:border-amber-500 | 12 | #f59e0b | src/pages/Home.tsx (7), src/components/investor/AccessRequestForm.tsx (4), src/pages/Admin.tsx (1) |
| focus:border-slate-900 | 12 | #0f172a | src/pages/HomepageConcept.tsx (7), src/pages/Demo.tsx (5) |
| hover:border-amber-300 | 3 | #fcd34d | src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| hover:border-amber-500/50 | 1 | #f59e0b @ 0.5 | src/pages/Home.tsx (1) |
| hover:border-amber-500/60 | 1 | #f59e0b @ 0.6 | src/components/timeline/TimelineShow.tsx (1) |
| hover:border-slate-400 | 6 | #94a3b8 | src/pages/investor/InvestorHome.tsx (3), src/components/InteractiveProcurementSchedule.tsx (2), src/pages/Roles.tsx (1) |
| hover:border-slate-900 | 1 | #0f172a | src/pages/Home.legacy.tsx (1) |
| hover:border-white/30 | 4 | #ffffff @ 0.3 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| hover:border-white/45 | 3 | #ffffff @ 0.45 | src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |

### Buttons / Accent / Warning Tint

| Color token/class | Approx frequency | Approx value | Primary file references |
| --- | --- | --- | --- |
| bg-amber-100 | 2 | #fef3c7 | src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| bg-amber-300 | 1 | #fcd34d | src/components/hero/ProcurementFlowHero.tsx (1) |
| bg-amber-400 | 1 | #fbbf24 | src/pages/CompanyProjectHealth.tsx (1) |
| bg-amber-50 | 4 | #fffbeb | src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.legacy.tsx (1), src/pages/roles/GeneralContractors.tsx (1) |
| bg-amber-500 | 33 | #f59e0b | src/pages/roles/GeneralContractors.legacy.tsx (6), src/pages/investor/InvestorHome.tsx (3), src/pages/roles/GeneralContractorsConcept.tsx (3) |
| bg-amber-500/10 | 3 | #f59e0b @ 0.1 | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (1) |
| bg-amber-500/15 | 1 | #f59e0b @ 0.15 | src/pages/BrokenBeforeJobStarts.tsx (1) |
| bg-amber-500/30 | 1 | #f59e0b @ 0.3 | src/pages/investor/EconomicCase.tsx (1) |
| bg-amber-500/40 | 1 | #f59e0b @ 0.4 | src/pages/investor/InvestorDeckPage.tsx (1) |
| bg-amber-500/60 | 1 | #f59e0b @ 0.6 | src/pages/investor/InvestorDeckPage.tsx (1) |
| bg-amber-500/75 | 1 | #f59e0b @ 0.75 | src/components/ControlledProcurementSection.tsx (1) |
| hover:bg-amber-400 | 16 | #fbbf24 | src/pages/Admin.tsx (2), src/pages/BrokenBeforeJobStarts.tsx (2), src/pages/investor/InvestorHome.tsx (2) |
| hover:bg-amber-500/10 | 2 | #f59e0b @ 0.1 | src/components/investor/InvestorNav.tsx (2) |

### Canvas Backgrounds

| Color token/class | Approx frequency | Approx value | Primary file references |
| --- | --- | --- | --- |
| bg-[#030a19] | 7 | #030a19 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| bg-[#030a19]/40 | 4 | #030a19 @ 0.4 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| bg-slate-900 | 70 | #0f172a | src/pages/Home.tsx (13), src/pages/investor/HiddenCost.tsx (5), src/pages/investor/EconomicCase.tsx (4) |
| bg-slate-900/40 | 3 | #0f172a @ 0.4 | src/pages/TheRealProcurementTimeline.tsx (2), src/components/timeline/TimelineShow.tsx (1) |
| bg-slate-900/60 | 1 | #0f172a @ 0.6 | src/pages/BrokenBeforeJobStarts.tsx (1) |
| bg-slate-900/85 | 1 | #0f172a @ 0.85 | src/components/hero/MobileHeroSequence.tsx (1) |
| bg-slate-900/95 | 2 | #0f172a @ 0.95 | src/components/investor/InvestorNav.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| bg-slate-950 | 25 | #020617 | src/pages/Home.tsx (5), src/pages/CompanyProjectHealth.tsx (4), src/pages/HomepageConcept.tsx (3) |
| bg-slate-950/40 | 2 | #020617 @ 0.4 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| bg-slate-950/85 | 1 | #020617 @ 0.85 | src/components/timeline/TimelineShow.tsx (1) |
| bg-slate-950/90 | 1 | #020617 @ 0.9 | src/components/timeline/TimelineShow.tsx (1) |
| bg-slate-950/96 | 1 | #020617 @ 0.96 | src/components/timeline/TimelineShow.tsx (1) |
| hover:bg-slate-900/60 | 2 | #0f172a @ 0.6 | src/components/timeline/TimelineShow.tsx (2) |
| hover:bg-slate-900/70 | 1 | #0f172a @ 0.7 | src/pages/TheRealProcurementTimeline.tsx (1) |

### Gradients

| Color token/class | Approx frequency | Approx value | Primary file references |
| --- | --- | --- | --- |
| from-[#030a19] | 2 | #030a19 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| from-[#030a19]/55 | 2 | #030a19 @ 0.55 | src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| from-[#030a19]/60 | 2 | #030a19 @ 0.6 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| from-[#030a19]/85 | 1 | #030a19 @ 0.85 | src/components/hero/ProcurementFlowHero.tsx (1) |
| from-[#030a19]/90 | 1 | #030a19 @ 0.9 | src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| from-amber-300/40 | 2 | #fcd34d @ 0.4 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| from-amber-500 | 1 | #f59e0b | src/pages/investor/HiddenCost.tsx (1) |
| from-amber-500/10 | 2 | #f59e0b @ 0.1 | src/pages/BrokenBeforeJobStarts.tsx (2) |
| from-white | 2 | #ffffff | src/pages/FAQ.tsx (2) |
| to-[#030a19]/30 | 3 | #030a19 @ 0.3 | src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| to-[#030a19]/60 | 2 | #030a19 @ 0.6 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| to-[#030a19]/70 | 1 | #030a19 @ 0.7 | src/components/hero/MobileHeroSequence.tsx (1) |
| to-red-300/40 | 2 | #fca5a5 @ 0.4 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| to-red-500 | 1 | #ef4444 | src/pages/investor/HiddenCost.tsx (1) |
| to-slate-900/40 | 2 | #0f172a @ 0.4 | src/pages/BrokenBeforeJobStarts.tsx (2) |
| to-transparent | 4 | transparent | src/pages/FAQ.tsx (2), src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| via-[#030a19]/20 | 1 | #030a19 @ 0.2 | src/components/hero/ProcurementFlowHero.tsx (1) |
| via-[#030a19]/30 | 2 | #030a19 @ 0.3 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| via-[#030a19]/92 | 2 | #030a19 @ 0.92 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| via-amber-300/30 | 2 | #fcd34d @ 0.3 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| via-transparent | 3 | transparent | src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| via-white/80 | 2 | #ffffff @ 0.8 | src/pages/FAQ.tsx (2) |

### Information / Success / Legacy Chart

| Color token/class | Approx frequency | Approx value | Primary file references |
| --- | --- | --- | --- |
| bg-blue-50 | 1 | #eff6ff | src/pages/Why.tsx (1) |
| bg-emerald-300 | 1 | #6ee7b7 | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |

### Interactive / Focus / Form

| Color token/class | Approx frequency | Approx value | Primary file references |
| --- | --- | --- | --- |
| accent-slate-900 | 12 | #0f172a | src/pages/contact/ArchitectContact.tsx (4), src/pages/contact/ContractorContact.tsx (4), src/pages/contact/OwnerContact.tsx (4) |

### Links / Accent Text / Icons

| Color token/class | Approx frequency | Approx value | Primary file references |
| --- | --- | --- | --- |
| group-hover:text-amber-600 | 2 | #d97706 | src/pages/Roles.tsx (2) |
| hover:text-amber-200 | 2 | #fde68a | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| hover:text-amber-300 | 1 | #fcd34d | src/pages/Home.legacy.tsx (1) |
| hover:text-amber-400 | 4 | #fbbf24 | src/components/timeline/TimelineShow.tsx (2), src/pages/Home.tsx (2) |
| hover:text-amber-500 | 3 | #f59e0b | src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1), src/pages/investor/InvestorAppendix.tsx (1) |
| hover:text-amber-700 | 4 | #b45309 | src/pages/Home.legacy.tsx (2), src/pages/HomepageConcept.tsx (2) |
| text-amber-100 | 4 | #fef3c7 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/pages/Home.tsx (1) |
| text-amber-200/95 | 2 | #fde68a @ 0.95 | src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| text-amber-300 | 21 | #fcd34d | src/pages/Home.tsx (8), src/pages/HomepageConcept.tsx (8), src/pages/roles/GeneralContractors.tsx (2) |
| text-amber-300/60 | 2 | #fcd34d @ 0.6 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| text-amber-300/80 | 1 | #fcd34d @ 0.8 | src/components/TypicalScheduleSection.tsx (1) |
| text-amber-300/85 | 2 | #fcd34d @ 0.85 | src/components/hero/_archive/JitproGanttAnimation.tsx (2) |
| text-amber-300/90 | 5 | #fcd34d @ 0.9 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2), src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| text-amber-400 | 2 | #fbbf24 | src/components/timeline/TimelineShow.tsx (1), src/pages/Home.legacy.tsx (1) |
| text-amber-500 | 54 | #f59e0b | src/pages/BrokenBeforeJobStarts.tsx (21), src/pages/Home.tsx (10), src/pages/investor/InvestorAppendix.tsx (4) |
| text-amber-500/60 | 1 | #f59e0b @ 0.6 | src/pages/investor/WhyNow.tsx (1) |
| text-amber-500/70 | 2 | #f59e0b @ 0.7 | src/pages/investor/InvestorAppendix.tsx (1), src/pages/investor/InvestorDeckPage.tsx (1) |
| text-amber-500/80 | 1 | #f59e0b @ 0.8 | src/pages/investor/InvestorDeckPage.tsx (1) |
| text-amber-600 | 30 | #d97706 | src/pages/HomepageConcept.tsx (8), src/pages/roles/GeneralContractors.tsx (5), src/pages/roles/GeneralContractorsConcept.tsx (5) |
| text-amber-700 | 4 | #b45309 | src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2) |

### Primary Text

| Color token/class | Approx frequency | Approx value | Primary file references |
| --- | --- | --- | --- |
| hover:text-slate-100 | 3 | #f1f5f9 | src/pages/investor/InvestorHome.tsx (3) |
| hover:text-slate-900 | 12 | #0f172a | src/components/Footer.tsx (11), src/pages/ThankYou.tsx (1) |
| hover:text-white | 1 | #ffffff | src/components/timeline/TimelineShow.tsx (1) |
| hover:text-white/85 | 4 | #ffffff @ 0.85 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| text-slate-100 | 79 | #f1f5f9 | src/pages/Home.tsx (25), src/pages/BrokenBeforeJobStarts.tsx (15), src/pages/CompanyProjectHealth.tsx (7) |
| text-slate-900 | 200 | #0f172a | src/pages/HomepageConcept.tsx (26), src/pages/roles/ArchitectsEngineers.tsx (14), src/pages/roles/OwnersDevelopers.tsx (14) |
| text-white | 51 | #ffffff | src/pages/HomepageConcept.tsx (8), src/pages/Home.tsx (6), src/pages/roles/GeneralContractors.tsx (6) |
| text-white/45 | 4 | #ffffff @ 0.45 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| text-white/90 | 1 | #ffffff @ 0.9 | src/components/TypicalScheduleSection.tsx (1) |
| text-white/95 | 1 | #ffffff @ 0.95 | src/components/ControlledProcurementSection.tsx (1) |

### Secondary / Muted Text

| Color token/class | Approx frequency | Approx value | Primary file references |
| --- | --- | --- | --- |
| group-hover:text-slate-700 | 1 | #334155 | src/components/faq/FaqAccordionItem.tsx (1) |
| hover:text-slate-300 | 1 | #cbd5e1 | src/components/investor/InvestorFooter.tsx (1) |
| hover:text-slate-600 | 1 | #475569 | src/components/Footer.tsx (1) |
| hover:text-slate-700 | 2 | #334155 | src/pages/FAQ.tsx (2) |
| text-slate-300 | 108 | #cbd5e1 | src/pages/BrokenBeforeJobStarts.tsx (18), src/pages/investor/WhyNow.tsx (9), src/pages/investor/HiddenCost.tsx (8) |
| text-slate-300/85 | 2 | #cbd5e1 @ 0.85 | src/components/hero/_archive/JitproGanttAnimation.tsx (2) |
| text-slate-400 | 91 | #94a3b8 | src/pages/investor/InvestorAppendix.tsx (15), src/pages/Home.tsx (13), src/components/investor/AccessRequestForm.tsx (6) |
| text-slate-500 | 67 | #64748b | src/pages/Admin.tsx (12), src/pages/investor/InvestorAppendix.tsx (10), src/pages/investor/HiddenCost.tsx (5) |
| text-slate-600 | 235 | #475569 | src/pages/Why.tsx (76), src/components/Footer.tsx (13), src/pages/roles/ArchitectsEngineers.tsx (12) |
| text-slate-700 | 20 | #334155 | src/pages/roles/GeneralContractors.legacy.tsx (5), src/pages/FounderStory.tsx (4), src/pages/HomepageConcept.tsx (3) |

### Surface Backgrounds / Elevated Surfaces

| Color token/class | Approx frequency | Approx value | Primary file references |
| --- | --- | --- | --- |
| bg-slate-100 | 1 | #f1f5f9 | src/pages/FounderStory.tsx (1) |
| bg-slate-100/60 | 2 | #f1f5f9 @ 0.6 | src/components/InteractiveProcurementSchedule.tsx (2) |
| bg-slate-50 | 37 | #f8fafc | src/pages/Why.tsx (5), src/components/ControlledProcurementSection.tsx (3), src/pages/HomepageConcept.tsx (3) |
| bg-slate-500 | 2 | #64748b | src/pages/investor/WhyNow.tsx (2) |
| bg-slate-500/25 | 1 | #64748b @ 0.25 | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| bg-slate-500/30 | 1 | #64748b @ 0.3 | src/components/hero/ProcurementFlowHero.tsx (1) |
| bg-slate-700 | 8 | #334155 | src/pages/investor/HiddenCost.tsx (2), src/components/ControlledProcurementSection.tsx (1), src/components/Navigation.tsx (1) |
| bg-slate-800 | 40 | #1e293b | src/pages/Home.tsx (7), src/pages/investor/WhyNow.tsx (5), src/components/investor/AccessRequestForm.tsx (4) |
| bg-slate-800/50 | 2 | #1e293b @ 0.5 | src/components/timeline/TimelineShow.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| bg-slate-800/90 | 1 | #1e293b @ 0.9 | src/components/TypicalScheduleSection.tsx (1) |
| bg-white | 55 | #ffffff | src/pages/HomepageConcept.tsx (9), src/pages/roles/GeneralContractors.tsx (6), src/pages/roles/GeneralContractorsConcept.tsx (6) |
| bg-white/85 | 1 | #ffffff @ 0.85 | src/components/InteractiveProcurementSchedule.tsx (1) |
| bg-white/90 | 1 | #ffffff @ 0.9 | src/components/TypicalScheduleSection.tsx (1) |
| bg-white/[0.06] | 2 | #ffffff @ 0.06 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| group-hover:bg-white | 1 | #ffffff | src/components/TypicalScheduleSection.tsx (1) |
| hover:bg-slate-100 | 9 | #f1f5f9 | src/components/InteractiveProcurementSchedule.tsx (2), src/pages/FAQ.tsx (2), src/pages/roles/ArchitectsEngineers.tsx (1) |
| hover:bg-slate-50/50 | 1 | #f8fafc @ 0.5 | src/components/InteractiveProcurementSchedule.tsx (1) |
| hover:bg-slate-800 | 11 | #1e293b | src/pages/Demo.tsx (1), src/pages/Home.legacy.tsx (1), src/pages/HomepageConcept.tsx (1) |

### Text / Other

| Color token/class | Approx frequency | Approx value | Primary file references |
| --- | --- | --- | --- |
| hover:text-slate-200 | 2 | #e2e8f0 | src/components/investor/InvestorNav.tsx (1), src/pages/Admin.tsx (1) |
| text-emerald-200/95 | 1 | #a7f3d0 @ 0.95 | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| text-slate-200 | 28 | #e2e8f0 | src/pages/Home.tsx (5), src/pages/HomepageConcept.tsx (5), src/pages/CompanyProjectHealth.tsx (3) |
| text-slate-800 | 9 | #1e293b | src/pages/Why.tsx (6), src/pages/roles/GeneralContractors.legacy.tsx (2), src/components/TypicalScheduleSection.tsx (1) |
| text-slate-950 | 14 | #020617 | src/pages/HomepageConcept.tsx (3), src/pages/roles/GeneralContractorsConcept.tsx (3), src/pages/BrokenBeforeJobStarts.tsx (2) |

## 4. DEDUPLICATED PALETTE

| Unique value / approximate value | Observed tokens/literals | Total approx frequency | Audit classification(s) |
| --- | --- | --- | --- |
| #000 | literal | 1 | One-off / decorative / inspect |
| #000000 | literal | 1 | Neutral utility |
| #000000 @ 0.3 | bg-black/30 | 1 | Neutral utility |
| #000000 @ 0.55 | bg-black/55 | 1 | Neutral utility |
| #000000 @ 0.75 | hover:bg-black/75 | 1 | Neutral utility |
| #004182 | hover:bg-[#004182], literal | 2 | One-off / decorative / inspect |
| #020617 | bg-slate-950, text-slate-950 | 39 | Core brand / canvas |
| #020617 @ 0.4 | bg-slate-950/40 | 2 | Core brand / canvas |
| #020617 @ 0.85 | bg-slate-950/85 | 1 | Core brand / canvas |
| #020617 @ 0.9 | bg-slate-950/90 | 1 | Core brand / canvas |
| #020617 @ 0.96 | bg-slate-950/96 | 1 | Core brand / canvas |
| #030a19 | bg-[#030a19], from-[#030a19], literal | 40 | Core brand / canvas |
| #030a19 @ 0.2 | via-[#030a19]/20 | 1 | Core brand / canvas |
| #030a19 @ 0.3 | to-[#030a19]/30, via-[#030a19]/30 | 5 | Core brand / canvas |
| #030a19 @ 0.4 | bg-[#030a19]/40 | 4 | Core brand / canvas |
| #030a19 @ 0.55 | from-[#030a19]/55 | 2 | Core brand / canvas |
| #030a19 @ 0.6 | from-[#030a19]/60, to-[#030a19]/60 | 4 | Core brand / canvas |
| #030a19 @ 0.7 | to-[#030a19]/70 | 1 | Core brand / canvas |
| #030a19 @ 0.85 | from-[#030a19]/85 | 1 | Core brand / canvas |
| #030a19 @ 0.9 | from-[#030a19]/90 | 1 | Core brand / canvas |
| #030a19 @ 0.92 | via-[#030a19]/92 | 2 | Core brand / canvas |
| #0A66C2 | bg-[#0A66C2], literal | 2 | Supporting / legacy / one-off |
| #0f172a | accent-slate-900, bg-[#0f172a], bg-slate-900, focus:border-slate-900, hover:border-slate-900, hover:text-slate-900, literal, text-slate-900 | 309 | Core brand / canvas |
| #0f172a @ 0.4 | bg-slate-900/40, to-slate-900/40 | 5 | Core brand / canvas |
| #0f172a @ 0.6 | bg-slate-900/60, hover:bg-slate-900/60 | 3 | Core brand / canvas |
| #0f172a @ 0.7 | hover:bg-slate-900/70 | 1 | Core brand / canvas |
| #0f172a @ 0.85 | bg-slate-900/85 | 1 | Core brand / canvas |
| #0f172a @ 0.95 | bg-slate-900/95 | 2 | Core brand / canvas |
| #111 | literal | 438 | One-off / decorative / inspect |
| #17becf | literal | 42 | One-off / decorative / inspect |
| #1e293b | bg-slate-800, border-slate-800, hover:bg-slate-800, literal, text-slate-800 | 100 | Supporting neutral |
| #1e293b @ 0.4 | border-slate-800/40 | 3 | Supporting neutral |
| #1e293b @ 0.5 | bg-slate-800/50 | 2 | Supporting neutral |
| #1e293b @ 0.6 | border-slate-800/60 | 11 | Supporting neutral |
| #1e293b @ 0.9 | bg-slate-800/90 | 1 | Supporting neutral |
| #1f77b4 | literal | 84 | One-off / decorative / inspect |
| #231f20 | literal | 18 | One-off / decorative / inspect |
| #2ca02c | literal | 18 | One-off / decorative / inspect |
| #334155 | bg-slate-700, border-slate-700, group-hover:text-slate-700, hover:text-slate-700, text-slate-700 | 67 | Supporting neutral |
| #334155 @ 0.5 | border-slate-700/50 | 3 | Supporting neutral |
| #34d399 | literal | 4 | Supporting / legacy / one-off |
| #38bdf8 | literal | 1 | Supporting / legacy / one-off |
| #475569 | bg-slate-600, border-slate-600, hover:text-slate-600, literal, text-slate-600 | 251 | Supporting neutral |
| #475569 @ 0.25 | bg-slate-600/25 | 1 | Supporting neutral |
| #555 | literal | 42 | One-off / decorative / inspect |
| #64748b | bg-slate-500, text-slate-500 | 69 | Supporting neutral |
| #64748b @ 0.25 | bg-slate-500/25 | 1 | Supporting neutral |
| #64748b @ 0.3 | bg-slate-500/30 | 1 | Supporting neutral |
| #6ee7b7 | bg-emerald-300, literal | 2 | Supporting / legacy / one-off |
| #8482 | literal | 1 | One-off / decorative / inspect |
| #9467bd | literal | 42 | One-off / decorative / inspect |
| #94a3b8 | bg-slate-400, disabled:bg-slate-400, hover:border-slate-400, text-slate-400 | 102 | Supporting neutral |
| #9632 | literal | 8 | One-off / decorative / inspect |
| #991b1b | text-red-800 | 4 | Semantic risk / alert |
| #a7f3d0 @ 0.95 | text-emerald-200/95 | 1 | Supporting / legacy / one-off |
| #b45309 | border-amber-700, hover:text-amber-700, text-amber-700 | 9 | Core brand / accent |
| #c1121f | literal | 1 | Semantic risk / alert |
| #cbd5e1 | bg-slate-300, border-slate-300, hover:text-slate-300, text-slate-300 | 125 | Supporting neutral |
| #cbd5e1 @ 0.85 | text-slate-300/85 | 2 | Supporting neutral |
| #d62728 | literal | 75 | One-off / decorative / inspect |
| #d97706 | group-hover:text-amber-600, text-amber-600 | 32 | Core brand / accent |
| #dc2626 | literal | 1 | Semantic risk / alert |
| #e2e8f0 | bg-slate-200, border-slate-200, hover:text-slate-200, text-slate-200 | 112 | Supporting neutral |
| #e2e8f0 @ 0.5 | border-slate-200/50 | 1 | Supporting neutral |
| #ea580c | literal | 1 | Semantic risk / alert |
| #ef4444 | to-red-500 | 1 | Semantic risk / alert |
| #ef4444 @ 0.1 | bg-red-500/10 | 7 | Semantic risk / alert |
| #ef4444 @ 0.2 | bg-red-500/20, border-red-500/20 | 2 | Semantic risk / alert |
| #ef4444 @ 0.3 | bg-red-500/30, border-red-500/30, hover:bg-red-500/30 | 5 | Semantic risk / alert |
| #ef4444 @ 0.5 | border-red-500/50 | 1 | Semantic risk / alert |
| #eff6ff | bg-blue-50 | 1 | Supporting / legacy / one-off |
| #f1f5f9 | bg-slate-100, border-slate-100, hover:bg-slate-100, hover:text-slate-100, text-slate-100 | 93 | Supporting neutral |
| #f1f5f9 @ 0.6 | bg-slate-100/60 | 2 | Supporting neutral |
| #f1f5f9 @ 0.7 | border-slate-100/70 | 2 | Supporting neutral |
| #f59e0b | bg-amber-500, border-amber-500, focus:border-amber-500, from-amber-500, hover:text-amber-500, literal, text-amber-500 | 121 | Core brand / accent |
| #f59e0b @ 0.1 | bg-amber-500/10, from-amber-500/10, hover:bg-amber-500/10 | 7 | Core brand / accent |
| #f59e0b @ 0.15 | bg-amber-500/15 | 1 | Core brand / accent |
| #f59e0b @ 0.2 | border-amber-500/20 | 2 | Core brand / accent |
| #f59e0b @ 0.3 | bg-amber-500/30, border-amber-500/30 | 5 | Core brand / accent |
| #f59e0b @ 0.4 | bg-amber-500/40, border-amber-500/40 | 3 | Core brand / accent |
| #f59e0b @ 0.5 | border-amber-500/50, hover:border-amber-500/50 | 2 | Core brand / accent |
| #f59e0b @ 0.6 | bg-amber-500/60, hover:border-amber-500/60, text-amber-500/60 | 3 | Core brand / accent |
| #f59e0b @ 0.7 | text-amber-500/70 | 2 | Core brand / accent |
| #f59e0b @ 0.75 | bg-amber-500/75 | 1 | Core brand / accent |
| #f59e0b @ 0.8 | text-amber-500/80 | 1 | Core brand / accent |
| #f87171 | bg-red-400, text-red-400 | 11 | Semantic risk / alert |
| #f87171 @ 0.3 | border-red-400/30 | 2 | Semantic risk / alert |
| #f8fafc | bg-slate-50, border-slate-50 | 38 | Supporting neutral |
| #f8fafc @ 0.5 | hover:bg-slate-50/50 | 1 | Supporting neutral |
| #f97316 | literal | 1 | Semantic risk / alert |
| #fbbf24 | bg-amber-400, hover:bg-amber-400, hover:text-amber-400, literal, text-amber-400 | 25 | Core brand / accent |
| #fbbf24 @ 0.3 | border-amber-400/30 | 2 | Core brand / accent |
| #fbbf24 @ 0.35 | border-amber-400/35 | 1 | Core brand / accent |
| #fca5a5 | bg-red-300, text-red-300 | 8 | Semantic risk / alert |
| #fca5a5 @ 0.2 | border-red-300/20 | 4 | Semantic risk / alert |
| #fca5a5 @ 0.4 | to-red-300/40 | 2 | Semantic risk / alert |
| #fcd34d | bg-amber-300, hover:border-amber-300, hover:text-amber-300, literal, text-amber-300 | 27 | Core brand / accent |
| #fcd34d @ 0.3 | border-amber-300/30, via-amber-300/30 | 6 | Core brand / accent |
| #fcd34d @ 0.4 | from-amber-300/40 | 2 | Core brand / accent |
| #fcd34d @ 0.6 | text-amber-300/60 | 2 | Core brand / accent |
| #fcd34d @ 0.8 | text-amber-300/80 | 1 | Core brand / accent |
| #fcd34d @ 0.85 | text-amber-300/85 | 2 | Core brand / accent |
| #fcd34d @ 0.9 | text-amber-300/90 | 5 | Core brand / accent |
| #fde68a | hover:text-amber-200 | 2 | Core brand / accent |
| #fde68a @ 0.95 | text-amber-200/95 | 2 | Core brand / accent |
| #fecaca | border-red-200 | 4 | Semantic risk / alert |
| #fee2e2 | text-red-100 | 6 | Semantic risk / alert |
| #fef2f2 | bg-red-50 | 4 | Semantic risk / alert |
| #fef3c7 | bg-amber-100, text-amber-100 | 6 | Core brand / accent |
| #ff0000 | literal | 1 | Semantic risk / alert |
| #ff7f0e | literal | 51 | One-off / decorative / inspect |
| #fffbeb | bg-amber-50 | 4 | Core brand / accent |
| #ffffff | bg-white, from-white, group-hover:bg-white, hover:text-white, literal, text-white | 131 | Neutral utility |
| #ffffff @ 0.06 | bg-white/[0.06] | 2 | Neutral utility |
| #ffffff @ 0.1 | border-white/10 | 8 | Neutral utility |
| #ffffff @ 0.2 | border-white/20 | 3 | Neutral utility |
| #ffffff @ 0.3 | hover:border-white/30 | 4 | Neutral utility |
| #ffffff @ 0.45 | hover:border-white/45, text-white/45 | 7 | Neutral utility |
| #ffffff @ 0.8 | via-white/80 | 2 | Neutral utility |
| #ffffff @ 0.85 | bg-white/85, hover:text-white/85 | 5 | Neutral utility |
| #ffffff @ 0.9 | bg-white/90, text-white/90 | 2 | Neutral utility |
| #ffffff @ 0.95 | text-white/95 | 1 | Neutral utility |
| rgb(${r}, ${g}, ${b}) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgb(100 116 139) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgb(148, 163, 184) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgb(15, 23, 42) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgb(180,130,40) | rgb/rgba literal | 2 | One-off / decorative / inspect |
| rgb(180,130,45) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgb(203, 213, 225) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgb(220, 38, 38) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgb(220,160,50) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgb(245 158 11) | rgb/rgba literal | 2 | One-off / decorative / inspect |
| rgb(245,158,11) | rgb/rgba literal | 5 | Core brand / accent |
| rgb(251,191,36) | rgb/rgba literal | 3 | Core brand / accent |
| rgb(252,211,77) | rgb/rgba literal | 2 | Core brand / accent |
| rgb(253,224,71) | rgb/rgba literal | 10 | One-off / decorative / inspect |
| rgb(254, 226, 226) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgb(254,243,199) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgb(30, 41, 59) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgb(51, 65, 85) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgb(71 85 105) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(0, 0, 0, ${0.4 * chromeOpacity}) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(0,0,0,0.2) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(0,0,0,0.35) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(0,0,0,0.6) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(10,7,3,0.4) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(10,7,3,0.6) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(100,116,139,0.35) | rgb/rgba literal | 2 | One-off / decorative / inspect |
| rgba(100,116,139,0.40) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(110,231,183,0.35) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(148, 163, 184, 0.45) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(148, 163, 184, 0.85) | rgb/rgba literal | 2 | One-off / decorative / inspect |
| rgba(148, 163, 184, 0.95) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(148,163,184,0.30) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(148,163,184,0.45) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(148,163,184,0.55) | rgb/rgba literal | 3 | One-off / decorative / inspect |
| rgba(148,163,184,0.6) | rgb/rgba literal | 2 | One-off / decorative / inspect |
| rgba(15, 23, 42, ${0.85 * chromeOpacity}) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(15,10,5,0.5) | rgb/rgba literal | 2 | One-off / decorative / inspect |
| rgba(15,23,42,0.88) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(160,110,30,0.04) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(180, 83, 9, 1) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(180,120,30,0.05) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(203, 213, 225, 0.9) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(203,213,225,0.85) | rgb/rgba literal | 2 | One-off / decorative / inspect |
| rgba(217,119,6,0.32) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(220, 38, 38, 1) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(220,38,38,0.34) | rgb/rgba literal | 2 | One-off / decorative / inspect |
| rgba(220,38,38,0.4) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(220,38,38,0.45) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(220,38,38,0.5) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(220,38,38,0.55) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(220,38,38,0.7) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(220,38,38,0.85) | rgb/rgba literal | 4 | One-off / decorative / inspect |
| rgba(220,38,38,0.95) | rgb/rgba literal | 2 | One-off / decorative / inspect |
| rgba(226,232,240,0.9) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(239,68,68,0.35) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(245, 158, 11, ${0.25 + morphT * 0.55}) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(245, 158, 11, ${0.40 * chromeOpacity}) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(245, 158, 11, ${0.70 * chromeOpacity}) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(245, 158, 11, 0.78) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(245, 158, 11, 1) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(245,158,11,0.20) | rgb/rgba literal | 2 | Core brand / accent |
| rgba(245,158,11,0.22) | rgb/rgba literal | 2 | Core brand / accent |
| rgba(245,158,11,0.25) | rgb/rgba literal | 2 | Core brand / accent |
| rgba(245,158,11,0.32) | rgb/rgba literal | 3 | Core brand / accent |
| rgba(245,158,11,0.35) | rgb/rgba literal | 3 | Core brand / accent |
| rgba(245,158,11,0.4) | rgb/rgba literal | 3 | Core brand / accent |
| rgba(245,158,11,0.40) | rgb/rgba literal | 1 | Core brand / accent |
| rgba(245,158,11,0.42) | rgb/rgba literal | 1 | Core brand / accent |
| rgba(245,158,11,0.45) | rgb/rgba literal | 1 | Core brand / accent |
| rgba(245,158,11,0.5) | rgb/rgba literal | 2 | Core brand / accent |
| rgba(245,158,11,0.55) | rgb/rgba literal | 3 | Core brand / accent |
| rgba(245,158,11,0.7) | rgb/rgba literal | 1 | Core brand / accent |
| rgba(245,158,11,0.85) | rgb/rgba literal | 3 | Core brand / accent |
| rgba(248, 113, 113, 0.85) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(248,113,113,0.45) | rgb/rgba literal | 2 | One-off / decorative / inspect |
| rgba(25,18,8,0.35) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(251, 191, 36, ${0.80 * chromeOpacity}) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(251, 191, 36, ${chromeOpacity}) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(251,191,36,0.01) | rgb/rgba literal | 2 | Core brand / accent |
| rgba(251,191,36,0.015) | rgb/rgba literal | 1 | Core brand / accent |
| rgba(251,191,36,0.02) | rgb/rgba literal | 1 | Core brand / accent |
| rgba(251,191,36,0.04) | rgb/rgba literal | 1 | Core brand / accent |
| rgba(251,191,36,0.18) | rgb/rgba literal | 1 | Core brand / accent |
| rgba(251,191,36,0.2) | rgb/rgba literal | 1 | Core brand / accent |
| rgba(251,191,36,0.35) | rgb/rgba literal | 1 | Core brand / accent |
| rgba(251,191,36,0.80) | rgb/rgba literal | 1 | Core brand / accent |
| rgba(252, 211, 77, 0.70) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(253,224,71,0.42) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(253,224,71,0.6) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(253,224,71,0.7) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(253,224,71,0.8) | rgb/rgba literal | 2 | One-off / decorative / inspect |
| rgba(253,224,71,0.85) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(253,224,71,0.95) | rgb/rgba literal | 4 | One-off / decorative / inspect |
| rgba(254,226,226,0.95) | rgb/rgba literal | 4 | One-off / decorative / inspect |
| rgba(254,243,199,0.95) | rgb/rgba literal | 2 | One-off / decorative / inspect |
| rgba(255,255,255,0.12) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(255,255,255,0.95) | rgb/rgba literal | 2 | One-off / decorative / inspect |
| rgba(34,211,238,0.35) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(51,65,85,0.3) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| rgba(59,130,246,0.12) | rgb/rgba literal | 4 | One-off / decorative / inspect |
| rgba(71,85,105,0.4) | rgb/rgba literal | 1 | One-off / decorative / inspect |
| transparent | to-transparent, via-transparent | 7 | Neutral utility |
## 5. CSS VARIABLES

No CSS variables are currently defined in the scanned implementation files. No `--token-name: value;` definitions were found in `src`, public SVG assets, or config files.

## 6. TAILWIND THEME

- `tailwind.config.js`: content paths are `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`.
- `theme.extend`: empty object. No custom theme extensions are currently defined.
- Font definitions: none in Tailwind config. Current implementation uses Tailwind default font stack unless overridden elsewhere.
- Color extensions: none. All observed Tailwind color utilities use Tailwind defaults or arbitrary values in class strings.
- Radius extensions: none. Uses Tailwind default radius utilities and a few arbitrary radii.
- Shadows: no custom shadow extensions. Uses Tailwind default shadows and one arbitrary shadow utility.
- Breakpoints: no custom breakpoints. Uses Tailwind default `sm`, `md`, `lg`, `xl`, `2xl`.
- Spacing: no custom spacing scale. Uses Tailwind default spacing and arbitrary values in a few places.
- Plugins: empty array. No Tailwind plugins configured.
- `postcss.config.js`: uses `tailwindcss` and `autoprefixer`.

## 7. TYPOGRAPHY IMPLEMENTATION

- Font loading: no Google Fonts, `@font-face`, or font package usage found in implementation.
- Font stack: Tailwind/browser default sans stack, plus isolated SVG `system-ui,sans-serif` references.
- Global base styles in `src/index.css`: `body` applies antialiasing, font feature settings `kern` and `liga`, optimized legibility, and base color `rgb(30, 41, 59)`; all headings apply `font-bold` and `letter-spacing: -0.02em`; paragraphs apply `leading-relaxed`.
- Data typography: no dedicated project-wide data font implementation found. Data/timeline components use Tailwind text sizing and inline SVG/system font styles.

| Typography utility | Approx frequency | Primary file references |
| --- | --- | --- |
| leading-relaxed | 363 | src/pages/Why.tsx (80), src/pages/Home.tsx (21), src/pages/HomepageConcept.tsx (21), src/pages/CompanyProjectHealth.tsx (14) |
| font-bold | 290 | src/pages/HomepageConcept.tsx (34), src/pages/Home.tsx (33), src/pages/roles/GeneralContractors.tsx (15), src/pages/roles/GeneralContractorsConcept.tsx (15) |
| text-lg | 263 | src/pages/Why.tsx (78), src/pages/roles/GeneralContractors.legacy.tsx (17), src/pages/CompanyProjectHealth.tsx (12), src/pages/Home.tsx (12) |
| text-slate-600 | 235 | src/pages/Why.tsx (76), src/components/Footer.tsx (13), src/pages/roles/ArchitectsEngineers.tsx (12), src/pages/roles/OwnersDevelopers.tsx (12) |
| text-slate-900 | 200 | src/pages/HomepageConcept.tsx (26), src/pages/roles/ArchitectsEngineers.tsx (14), src/pages/roles/OwnersDevelopers.tsx (14), src/pages/roles/ProjectManagers.tsx (14) |
| font-semibold | 171 | src/pages/HomepageConcept.tsx (18), src/pages/BrokenBeforeJobStarts.tsx (16), src/pages/Home.tsx (16), src/pages/Why.tsx (13) |
| text-sm | 153 | src/pages/HomepageConcept.tsx (22), src/pages/Home.tsx (21), src/pages/investor/WhyNow.tsx (9), src/pages/investor/HiddenCost.tsx (8) |
| text-slate-300 | 108 | src/pages/BrokenBeforeJobStarts.tsx (18), src/pages/investor/WhyNow.tsx (9), src/pages/investor/HiddenCost.tsx (8), src/pages/investor/MarketOpportunity.tsx (8) |
| text-xl | 103 | src/pages/roles/ArchitectsEngineers.tsx (9), src/pages/roles/OwnersDevelopers.tsx (9), src/pages/roles/ProjectManagers.tsx (9), src/pages/roles/Subcontractors.tsx (9) |
| text-slate-400 | 91 | src/pages/investor/InvestorAppendix.tsx (15), src/pages/Home.tsx (13), src/components/investor/AccessRequestForm.tsx (6), src/pages/TheRealProcurementTimeline.tsx (5) |
| uppercase | 91 | src/pages/Home.tsx (12), src/pages/HomepageConcept.tsx (12), src/pages/investor/InvestorDeckPage.tsx (6), src/pages/roles/GeneralContractors.tsx (6) |
| text-slate-100 | 79 | src/pages/Home.tsx (25), src/pages/BrokenBeforeJobStarts.tsx (15), src/pages/CompanyProjectHealth.tsx (7), src/pages/investor/InvestorDeckPage.tsx (7) |
| text-2xl | 77 | src/pages/BrokenBeforeJobStarts.tsx (8), src/pages/Why.tsx (8), src/pages/Home.tsx (7), src/pages/HomepageConcept.tsx (7) |
| text-3xl | 77 | src/pages/Home.tsx (7), src/pages/HomepageConcept.tsx (7), src/pages/roles/GeneralContractors.legacy.tsx (7), src/pages/roles/GeneralContractors.tsx (7) |
| font-medium | 72 | src/pages/investor/InvestorAppendix.tsx (12), src/components/hero/ProcurementFlowHero.tsx (7), src/pages/Admin.tsx (7), src/pages/Home.legacy.tsx (7) |
| text-xs | 71 | src/pages/investor/InvestorAppendix.tsx (11), src/pages/BrokenBeforeJobStarts.tsx (9), src/pages/Admin.tsx (5), src/pages/TheRealProcurementTimeline.tsx (5) |
| text-slate-500 | 67 | src/pages/Admin.tsx (12), src/pages/investor/InvestorAppendix.tsx (10), src/pages/investor/HiddenCost.tsx (5), src/pages/investor/EconomicCase.tsx (4) |
| text-center | 66 | src/pages/HomepageConcept.tsx (6), src/pages/Home.tsx (5), src/components/hero/MobileHeroSequence.tsx (4), src/pages/investor/HiddenCost.tsx (4) |
| tracking-tight | 57 | src/pages/Home.tsx (11), src/pages/HomepageConcept.tsx (11), src/pages/roles/GeneralContractors.tsx (8), src/pages/roles/GeneralContractorsConcept.tsx (8) |
| text-amber-500 | 54 | src/pages/BrokenBeforeJobStarts.tsx (21), src/pages/Home.tsx (10), src/pages/investor/InvestorAppendix.tsx (4), src/pages/investor/WhyNow.tsx (4) |
| text-white | 51 | src/pages/HomepageConcept.tsx (8), src/pages/Home.tsx (6), src/pages/roles/GeneralContractors.tsx (6), src/pages/roles/GeneralContractorsConcept.tsx (6) |
| leading-tight | 50 | src/pages/Home.tsx (7), src/pages/HomepageConcept.tsx (7), src/pages/roles/GeneralContractors.tsx (7), src/pages/roles/GeneralContractorsConcept.tsx (7) |
| tracking-[0.2em] | 46 | src/pages/Home.tsx (9), src/pages/HomepageConcept.tsx (9), src/pages/roles/GeneralContractors.tsx (5), src/pages/roles/GeneralContractorsConcept.tsx (5) |
| text-base | 35 | src/pages/BrokenBeforeJobStarts.tsx (13), src/pages/TheRealProcurementTimeline.tsx (5), src/pages/investor/InvestorDeckPage.tsx (3), src/components/timeline/TimelineShow.tsx (2) |
| text-4xl | 33 | src/pages/investor/HiddenCost.tsx (3), src/pages/Demo.tsx (2), src/components/hero/MobileHeroSequence.tsx (1), src/pages/About.tsx (1) |
| text-amber-600 | 30 | src/pages/HomepageConcept.tsx (8), src/pages/roles/GeneralContractors.tsx (5), src/pages/roles/GeneralContractorsConcept.tsx (5), src/pages/Home.legacy.tsx (2) |
| text-slate-200 | 28 | src/pages/Home.tsx (5), src/pages/HomepageConcept.tsx (5), src/pages/CompanyProjectHealth.tsx (3), src/components/TypicalScheduleSection.tsx (2) |
| whitespace-nowrap | 24 | src/components/TypicalScheduleSection.tsx (5), src/components/hero/ProcurementFlowHero.tsx (5), src/components/ControlledProcurementSection.tsx (4), src/components/InteractiveProcurementSchedule.tsx (2) |
| tracking-wider | 23 | src/pages/investor/InvestorDeckPage.tsx (5), src/pages/investor/WhyNow.tsx (4), src/pages/investor/InvestorAppendix.tsx (3), src/components/investor/InvestorNav.tsx (2) |
| text-amber-300 | 21 | src/pages/Home.tsx (8), src/pages/HomepageConcept.tsx (8), src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2) |
| text-slate-700 | 20 | src/pages/roles/GeneralContractors.legacy.tsx (5), src/pages/FounderStory.tsx (4), src/pages/HomepageConcept.tsx (3), src/pages/Home.legacy.tsx (2) |
| leading-snug | 19 | src/pages/FounderStory.tsx (4), src/pages/Home.legacy.tsx (3), src/components/TypicalScheduleSection.tsx (2), src/pages/BrokenBeforeJobStarts.tsx (2) |
| text-[10px] | 15 | src/components/InteractiveProcurementSchedule.tsx (3), src/components/TypicalScheduleSection.tsx (3), src/components/ControlledProcurementSection.tsx (2), src/components/hero/_archive/JitproGanttAnimation.tsx (2) |
| text-[11px] | 15 | src/components/hero/ProcurementFlowHero.tsx (6), src/components/hero/MobileHeroSequence.tsx (3), src/components/ControlledProcurementSection.tsx (2), src/pages/TheRealProcurementTimeline.tsx (2) |
| text-slate-950 | 14 | src/pages/HomepageConcept.tsx (3), src/pages/roles/GeneralContractorsConcept.tsx (3), src/pages/BrokenBeforeJobStarts.tsx (2), src/pages/roles/GeneralContractors.tsx (2) |
| text-right | 11 | src/components/hero/ProcurementFlowHero.tsx (2), src/components/hero/_archive/JitproGanttAnimation.tsx (2), src/pages/investor/HiddenCost.tsx (2), src/components/ControlledProcurementSection.tsx (1) |
| text-red-400 | 10 | src/pages/Admin.tsx (3), src/pages/investor/HiddenCost.tsx (2), src/pages/investor/WhyNow.tsx (2), src/components/TypicalScheduleSection.tsx (1) |
| text-slate-800 | 9 | src/pages/Why.tsx (6), src/pages/roles/GeneralContractors.legacy.tsx (2), src/components/TypicalScheduleSection.tsx (1) |
| text-red-300 | 7 | src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2), src/components/hero/ProcurementFlowHero.tsx (1), src/pages/Home.tsx (1) |
| tracking-[0.18em] | 7 | src/components/hero/MobileHeroSequence.tsx (4), src/components/hero/ProcurementFlowHero.tsx (2), src/components/TypicalScheduleSection.tsx (1) |
| tracking-[0.22em] | 7 | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/components/TypicalScheduleSection.tsx (1), src/pages/roles/GeneralContractors.tsx (1) |
| text-red-100 | 6 | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| truncate | 6 | src/components/InteractiveProcurementSchedule.tsx (2), src/pages/TheRealProcurementTimeline.tsx (2), src/components/hero/_archive/JitproGanttAnimation.tsx (1), src/pages/Admin.tsx (1) |
| text-[9px] | 5 | src/components/ControlledProcurementSection.tsx (1), src/components/TypicalScheduleSection.tsx (1), src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| text-amber-300/90 | 5 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2), src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| text-left | 5 | src/components/faq/FaqAccordionItem.tsx (1), src/pages/Admin.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1), src/pages/investor/InvestorAppendix.tsx (1) |
| italic | 4 | src/components/TypicalScheduleSection.tsx (1), src/components/timeline/TimelineShow.tsx (1), src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/Why.tsx (1) |
| leading-[1.02] | 4 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| text-amber-100 | 4 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| text-amber-700 | 4 | src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2) |
| text-red-800 | 4 | src/pages/Demo.tsx (1), src/pages/contact/ArchitectContact.tsx (1), src/pages/contact/ContractorContact.tsx (1), src/pages/contact/OwnerContact.tsx (1) |
| text-white/45 | 4 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| tracking-[0.16em] | 4 | src/components/ControlledProcurementSection.tsx (1), src/components/TypicalScheduleSection.tsx (1), src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| tracking-wide | 3 | src/components/ControlledProcurementSection.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| leading-[1.05] | 2 | src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| text-5xl | 2 | src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| text-[8px] | 2 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| text-amber-200/95 | 2 | src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| text-amber-300/60 | 2 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| text-amber-300/85 | 2 | src/components/hero/_archive/JitproGanttAnimation.tsx (2) |
| text-amber-400 | 2 | src/components/timeline/TimelineShow.tsx (1), src/pages/Home.legacy.tsx (1) |
| text-amber-500/70 | 2 | src/pages/investor/InvestorAppendix.tsx (1), src/pages/investor/InvestorDeckPage.tsx (1) |
| text-slate-300/85 | 2 | src/components/hero/_archive/JitproGanttAnimation.tsx (2) |
| font-normal | 1 | src/components/investor/InvestorStatCard.tsx (1) |
| leading-[1.08] | 1 | src/components/hero/MobileHeroSequence.tsx (1) |
| leading-none | 1 | src/components/Footer.tsx (1) |
| text-[12px] | 1 | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| text-amber-300/80 | 1 | src/components/TypicalScheduleSection.tsx (1) |
| text-amber-500/60 | 1 | src/pages/investor/WhyNow.tsx (1) |
| text-amber-500/80 | 1 | src/pages/investor/InvestorDeckPage.tsx (1) |
| text-emerald-200/95 | 1 | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| text-white/90 | 1 | src/components/TypicalScheduleSection.tsx (1) |
| text-white/95 | 1 | src/components/ControlledProcurementSection.tsx (1) |
| tracking-[0.15em] | 1 | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| tracking-[0.24em] | 1 | src/pages/CompanyProjectHealth.tsx (1) |
| tracking-[0.25em] | 1 | src/pages/investor/InvestorDeckPage.tsx (1) |
## 8. SPACING SYSTEM

Observed repeated spacing patterns include page gutters (`px-6`), centered containers (`mx-auto` + `max-w-*`), section spacing (`py-16`, `py-20`, `py-24`), card padding (`p-6`, `p-8`), form spacing (`space-y-6`, `space-y-12`), and grid gaps (`gap-5`, `gap-6`, `gap-12`). This is a snapshot, not a recommendation.

| Spacing/layout utility | Approx frequency | Primary file references |
| --- | --- | --- |
| mx-auto | 227 | src/pages/Home.tsx (14), src/pages/HomepageConcept.tsx (14), src/pages/investor/HiddenCost.tsx (10), src/pages/investor/MarketOpportunity.tsx (10) |
| px-6 | 219 | src/pages/investor/InvestorHome.tsx (12), src/pages/investor/HiddenCost.tsx (11), src/pages/HomepageConcept.tsx (9), src/pages/investor/EconomicCase.tsx (9) |
| mb-4 | 135 | src/pages/Why.tsx (46), src/pages/Home.tsx (12), src/pages/HomepageConcept.tsx (12), src/pages/Documentation.tsx (8) |
| mb-6 | 130 | src/pages/Why.tsx (12), src/pages/roles/GeneralContractors.tsx (11), src/pages/roles/GeneralContractorsConcept.tsx (11), src/pages/Home.tsx (9) |
| max-w-3xl | 89 | src/pages/investor/MarketOpportunity.tsx (8), src/pages/investor/EconomicCase.tsx (7), src/pages/investor/HiddenCost.tsx (7), src/pages/investor/WhyNow.tsx (7) |
| py-20 | 85 | src/pages/Home.tsx (7), src/pages/HomepageConcept.tsx (7), src/pages/roles/GeneralContractors.tsx (6), src/pages/roles/GeneralContractorsConcept.tsx (6) |
| max-w-4xl | 78 | src/pages/Why.tsx (8), src/pages/roles/GeneralContractors.legacy.tsx (8), src/pages/CompanyProjectHealth.tsx (6), src/pages/roles/ArchitectsEngineers.tsx (6) |
| mb-8 | 73 | src/pages/roles/GeneralContractors.legacy.tsx (8), src/pages/Home.tsx (5), src/pages/HomepageConcept.tsx (5), src/pages/investor/HiddenCost.tsx (4) |
| py-3 | 72 | src/pages/Admin.tsx (16), src/pages/investor/InvestorAppendix.tsx (16), src/pages/Home.tsx (8), src/pages/HomepageConcept.tsx (8) |
| mb-3 | 69 | src/pages/Home.tsx (8), src/pages/HomepageConcept.tsx (8), src/pages/roles/ArchitectsEngineers.tsx (8), src/pages/roles/OwnersDevelopers.tsx (8) |
| py-16 | 69 | src/pages/Why.tsx (6), src/pages/roles/GeneralContractors.legacy.tsx (6), src/pages/investor/HiddenCost.tsx (5), src/pages/CompanyProjectHealth.tsx (4) |
| w-full | 63 | src/pages/Home.tsx (10), src/pages/HomepageConcept.tsx (10), src/components/investor/AccessRequestForm.tsx (6), src/pages/Demo.tsx (6) |
| px-4 | 62 | src/pages/Admin.tsx (15), src/pages/investor/InvestorAppendix.tsx (14), src/pages/Home.tsx (9), src/pages/HomepageConcept.tsx (9) |
| gap-2 | 57 | src/pages/investor/InvestorAppendix.tsx (12), src/pages/HomepageConcept.tsx (6), src/components/timeline/TimelineShow.tsx (5), src/pages/Home.legacy.tsx (5) |
| gap-3 | 55 | src/pages/BrokenBeforeJobStarts.tsx (15), src/pages/Home.tsx (6), src/pages/HomepageConcept.tsx (6), src/pages/roles/GeneralContractors.legacy.tsx (6) |
| max-w-6xl | 39 | src/pages/Home.tsx (6), src/pages/HomepageConcept.tsx (6), src/pages/roles/GeneralContractors.tsx (5), src/pages/roles/GeneralContractorsConcept.tsx (5) |
| mb-2 | 34 | src/pages/Home.tsx (8), src/pages/HomepageConcept.tsx (8), src/pages/Demo.tsx (5), src/pages/Why.tsx (4) |
| mb-5 | 33 | src/pages/Home.tsx (9), src/pages/HomepageConcept.tsx (9), src/pages/BrokenBeforeJobStarts.tsx (8), src/components/hero/MobileHeroSequence.tsx (2) |
| py-4 | 32 | src/pages/roles/GeneralContractors.tsx (4), src/pages/roles/GeneralContractorsConcept.tsx (4), src/pages/HomepageConcept.tsx (3), src/pages/Home.legacy.tsx (2) |
| mb-1 | 30 | src/pages/Why.tsx (20), src/components/investor/AccessRequestForm.tsx (4), src/pages/investor/InvestorDeckPage.tsx (3), src/pages/investor/InvestorProduct.tsx (1) |
| p-8 | 30 | src/pages/roles/ArchitectsEngineers.tsx (4), src/pages/roles/OwnersDevelopers.tsx (4), src/pages/roles/ProjectManagers.tsx (4), src/pages/roles/Subcontractors.tsx (4) |
| p-6 | 29 | src/pages/Home.tsx (7), src/pages/HomepageConcept.tsx (7), src/pages/roles/GeneralContractors.tsx (4), src/pages/roles/GeneralContractorsConcept.tsx (4) |
| inset-0 | 28 | src/components/hero/MobileHeroSequence.tsx (5), src/components/TypicalScheduleSection.tsx (4), src/components/hero/ProcurementFlowHero.tsx (4), src/components/hero/ProcurementFlowHero.legacy.tsx (3) |
| h-full | 27 | src/components/InteractiveProcurementSchedule.tsx (12), src/components/hero/_archive/JitproGanttAnimation.tsx (3), src/components/hero/ProcurementFlowHero.tsx (2), src/pages/investor/WhyNow.tsx (2) |
| space-y-4 | 26 | src/pages/BrokenBeforeJobStarts.tsx (8), src/pages/investor/InvestorHome.tsx (3), src/pages/FounderStory.tsx (2), src/pages/roles/GeneralContractors.tsx (2) |
| px-8 | 25 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2), src/components/hero/_archive/JitproGanttAnimation.tsx (2), src/pages/Home.legacy.tsx (2) |
| mb-12 | 24 | src/pages/Home.tsx (4), src/pages/HomepageConcept.tsx (4), src/pages/investor/MarketOpportunity.tsx (2), src/pages/roles/GeneralContractors.tsx (2) |
| gap-4 | 23 | src/pages/roles/GeneralContractors.legacy.tsx (5), src/pages/investor/InvestorProduct.tsx (3), src/pages/investor/HiddenCost.tsx (2), src/pages/investor/InvestorHome.tsx (2) |
| gap-6 | 22 | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/pages/investor/HiddenCost.tsx (2), src/pages/investor/InvestorHome.tsx (2) |
| mb-10 | 22 | src/components/investor/AccessRequestForm.tsx (2), src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/pages/roles/GeneralContractors.tsx (2) |
| pb-4 | 22 | src/pages/roles/GeneralContractors.legacy.tsx (6), src/pages/roles/ArchitectsEngineers.tsx (4), src/pages/roles/OwnersDevelopers.tsx (4), src/pages/roles/ProjectManagers.tsx (4) |
| top-0 | 22 | src/components/InteractiveProcurementSchedule.tsx (11), src/components/timeline/TimelineShow.tsx (2), src/pages/FAQ.tsx (2), src/pages/TheRealProcurementTimeline.tsx (2) |
| right-0 | 21 | src/components/hero/ProcurementFlowHero.tsx (3), src/components/hero/_archive/JitproGanttAnimation.tsx (3), src/components/InteractiveProcurementSchedule.tsx (2), src/components/hero/MobileHeroSequence.tsx (2) |
| space-y-6 | 20 | src/pages/contact/ArchitectContact.tsx (3), src/pages/contact/ContractorContact.tsx (3), src/pages/contact/OwnerContact.tsx (3), src/pages/roles/GeneralContractors.legacy.tsx (3) |
| left-0 | 17 | src/components/hero/MobileHeroSequence.tsx (4), src/components/hero/ProcurementFlowHero.tsx (3), src/components/hero/_archive/JitproGanttAnimation.tsx (3), src/components/TypicalScheduleSection.tsx (2) |
| space-y-2 | 17 | src/pages/Why.tsx (6), src/components/Footer.tsx (3), src/pages/BrokenBeforeJobStarts.tsx (3), src/pages/investor/InvestorAppendix.tsx (3) |
| space-y-3 | 17 | src/pages/investor/WhyNow.tsx (4), src/pages/roles/GeneralContractors.legacy.tsx (3), src/pages/FounderStory.tsx (2), src/pages/Home.tsx (2) |
| py-24 | 16 | src/pages/Home.legacy.tsx (2), src/components/ControlledProcurementSection.tsx (1), src/components/TypicalScheduleSection.tsx (1), src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| h-2 | 15 | src/pages/roles/GeneralContractors.legacy.tsx (5), src/components/ControlledProcurementSection.tsx (1), src/components/TypicalScheduleSection.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| py-2 | 15 | src/components/InteractiveProcurementSchedule.tsx (2), src/components/timeline/TimelineShow.tsx (2), src/pages/HomepageConcept.tsx (2), src/components/Navigation.tsx (1) |
| w-2 | 14 | src/pages/roles/GeneralContractors.legacy.tsx (5), src/components/InteractiveProcurementSchedule.tsx (2), src/components/TypicalScheduleSection.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| max-w-5xl | 13 | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| gap-5 | 12 | src/pages/Home.tsx (4), src/pages/HomepageConcept.tsx (4), src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2) |
| max-w-2xl | 12 | src/components/timeline/TimelineShow.tsx (2), src/pages/Demo.tsx (2), src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| mt-0.5 | 12 | src/pages/Home.tsx (3), src/pages/HomepageConcept.tsx (3), src/components/TypicalScheduleSection.tsx (1), src/components/faq/FaqAccordionItem.tsx (1) |
| mt-1.5 | 12 | src/pages/BrokenBeforeJobStarts.tsx (8), src/pages/investor/InvestorHome.tsx (2), src/pages/investor/MarketOpportunity.tsx (1), src/pages/investor/WhyNow.tsx (1) |
| mt-2 | 12 | src/components/investor/InvestorNav.tsx (3), src/pages/investor/HiddenCost.tsx (3), src/pages/investor/EconomicCase.tsx (2), src/pages/investor/InvestorAppendix.tsx (2) |
| p-4 | 12 | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/components/InteractiveProcurementSchedule.tsx (1), src/components/timeline/TimelineShow.tsx (1) |
| p-7 | 12 | src/pages/Home.tsx (4), src/pages/HomepageConcept.tsx (4), src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2) |
| pb-3 | 12 | src/pages/contact/ArchitectContact.tsx (4), src/pages/contact/ContractorContact.tsx (4), src/pages/contact/OwnerContact.tsx (4) |
| top-1/2 | 12 | src/components/hero/ProcurementFlowHero.tsx (4), src/components/hero/_archive/JitproGanttAnimation.tsx (3), src/pages/TheRealProcurementTimeline.tsx (3), src/components/timeline/TimelineShow.tsx (1) |
| bottom-0 | 11 | src/components/timeline/TimelineShow.tsx (2), src/pages/FAQ.tsx (2), src/pages/TheRealProcurementTimeline.tsx (2), src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| mt-2.5 | 11 | src/pages/roles/GeneralContractors.legacy.tsx (6), src/pages/investor/InvestorDeckPage.tsx (1), src/pages/roles/ArchitectsEngineers.tsx (1), src/pages/roles/OwnersDevelopers.tsx (1) |
| gap-12 | 10 | src/pages/Home.tsx (3), src/pages/HomepageConcept.tsx (3), src/components/Footer.tsx (1), src/components/TypicalScheduleSection.tsx (1) |
| gap-8 | 10 | src/components/Navigation.tsx (1), src/pages/HowItWorks.tsx (1), src/pages/Why.tsx (1), src/pages/investor/EconomicCase.tsx (1) |
| h-px | 10 | src/components/hero/_archive/JitproGanttAnimation.tsx (2), src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/components/ControlledProcurementSection.tsx (1) |
| min-h-screen | 10 | src/components/investor/AccessRequestForm.tsx (2), src/components/investor/InvestorLayout.tsx (2), src/pages/Admin.tsx (2), src/components/MainLayout.tsx (1) |
| pt-12 | 10 | src/pages/BrokenBeforeJobStarts.tsx (8), src/pages/Demo.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| px-3 | 10 | src/components/investor/InvestorNav.tsx (4), src/components/timeline/TimelineShow.tsx (2), src/pages/Admin.tsx (2), src/components/InteractiveProcurementSchedule.tsx (1) |
| mt-4 | 9 | src/pages/investor/MarketOpportunity.tsx (2), src/pages/investor/WhyNow.tsx (2), src/components/ControlledProcurementSection.tsx (1), src/pages/AdminApproved.tsx (1) |
| mt-6 | 9 | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/components/timeline/TimelineShow.tsx (1), src/pages/investor/EconomicCase.tsx (1) |
| h-1.5 | 8 | src/pages/investor/InvestorHome.tsx (2), src/components/TypicalScheduleSection.tsx (1), src/pages/investor/InvestorAppendix.tsx (1), src/pages/investor/InvestorDeckPage.tsx (1) |
| max-w-7xl | 8 | src/components/investor/InvestorFooter.tsx (2), src/components/Footer.tsx (1), src/components/Navigation.tsx (1), src/components/investor/InvestorNav.tsx (1) |
| mt-1 | 8 | src/components/investor/InvestorNav.tsx (2), src/pages/investor/WhyNow.tsx (2), src/components/ControlledProcurementSection.tsx (1), src/components/InteractiveProcurementSchedule.tsx (1) |
| pt-2 | 8 | src/components/investor/InvestorNav.tsx (2), src/pages/BrokenBeforeJobStarts.tsx (2), src/components/Navigation.tsx (1), src/pages/HowItWorks.tsx (1) |
| px-7 | 8 | src/pages/roles/GeneralContractors.tsx (3), src/pages/roles/GeneralContractorsConcept.tsx (3), src/pages/HomepageConcept.tsx (2) |
| space-y-8 | 8 | src/pages/FounderStory.tsx (3), src/pages/Roles.tsx (1), src/pages/roles/ArchitectsEngineers.tsx (1), src/pages/roles/OwnersDevelopers.tsx (1) |
| pb-12 | 7 | src/pages/BrokenBeforeJobStarts.tsx (3), src/pages/TheRealProcurementTimeline.tsx (2), src/pages/FounderStory.tsx (1), src/pages/Home.legacy.tsx (1) |
| py-1 | 7 | src/components/investor/InvestorNav.tsx (4), src/pages/Admin.tsx (2), src/pages/investor/InvestorProduct.tsx (1) |
| space-y-5 | 7 | src/pages/Home.legacy.tsx (2), src/components/TypicalScheduleSection.tsx (1), src/components/investor/AccessRequestForm.tsx (1), src/pages/Home.tsx (1) |
| w-1.5 | 7 | src/pages/investor/InvestorHome.tsx (2), src/pages/investor/InvestorAppendix.tsx (1), src/pages/investor/InvestorDeckPage.tsx (1), src/pages/investor/MarketOpportunity.tsx (1) |
| ml-1 | 6 | src/pages/investor/InvestorDeckPage.tsx (2), src/components/TypicalScheduleSection.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1), src/components/investor/InvestorStatCard.tsx (1) |
| mt-14 | 6 | src/pages/BrokenBeforeJobStarts.tsx (6) |
| p-5 | 6 | src/pages/investor/InvestorProduct.tsx (2), src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1), src/pages/investor/HiddenCost.tsx (1) |
| w-24 | 6 | src/pages/BrokenBeforeJobStarts.tsx (6) |
| gap-10 | 5 | src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2), src/pages/FounderStory.tsx (1) |
| h-1 | 5 | src/components/hero/ProcurementFlowHero.tsx (2), src/components/TypicalScheduleSection.tsx (1), src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| h-10 | 5 | src/components/investor/AccessRequestForm.tsx (2), src/components/TypicalScheduleSection.tsx (1), src/pages/investor/InvestorProduct.tsx (1), src/pages/roles/GeneralContractors.legacy.tsx (1) |
| h-4 | 5 | src/components/TypicalScheduleSection.tsx (2), src/components/timeline/TimelineShow.tsx (1), src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| h-5 | 5 | src/components/timeline/TimelineShow.tsx (2), src/components/InteractiveProcurementSchedule.tsx (1), src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| h-auto | 5 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/pages/Home.tsx (1) |
| mt-8 | 5 | src/components/investor/AccessRequestForm.tsx (1), src/pages/ThankYou.tsx (1), src/pages/Why.tsx (1), src/pages/investor/InvestorDeckPage.tsx (1) |
| pb-16 | 5 | src/pages/investor/InvestorDeckPage.tsx (3), src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| pt-8 | 5 | src/pages/investor/InvestorDeckPage.tsx (3), src/components/Footer.tsx (1), src/pages/FounderStory.tsx (1) |
| px-3.5 | 5 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2), src/pages/TheRealProcurementTimeline.tsx (1) |
| py-2.5 | 5 | src/components/timeline/TimelineShow.tsx (2), src/components/investor/InvestorNav.tsx (1), src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| space-y-12 | 5 | src/pages/About.tsx (1), src/pages/HowItWorks.tsx (1), src/pages/contact/ArchitectContact.tsx (1), src/pages/contact/ContractorContact.tsx (1) |
| w-4 | 5 | src/components/TypicalScheduleSection.tsx (2), src/components/ControlledProcurementSection.tsx (1), src/components/timeline/TimelineShow.tsx (1), src/pages/BrokenBeforeJobStarts.tsx (1) |
| w-px | 5 | src/components/ControlledProcurementSection.tsx (1), src/components/TypicalScheduleSection.tsx (1), src/components/timeline/TimelineShow.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| h-6 | 4 | src/pages/TheRealProcurementTimeline.tsx (3), src/pages/BrokenBeforeJobStarts.tsx (1) |
| inset-y-0 | 4 | src/components/hero/MobileHeroSequence.tsx (3), src/components/TypicalScheduleSection.tsx (1) |
| max-w-lg | 4 | src/components/TypicalScheduleSection.tsx (1), src/components/investor/AccessRequestForm.tsx (1), src/components/investor/InvestorFooter.tsx (1), src/pages/investor/MarketOpportunity.tsx (1) |
| mt-10 | 4 | src/pages/investor/InvestorDeckPage.tsx (2), src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| mt-3 | 4 | src/components/investor/InvestorStatCard.tsx (1), src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| pl-0 | 4 | src/pages/BrokenBeforeJobStarts.tsx (3), src/pages/contact/OwnerContact.tsx (1) |
| pr-3 | 4 | src/components/hero/ProcurementFlowHero.tsx (2), src/components/ControlledProcurementSection.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| pr-4 | 4 | src/components/InteractiveProcurementSchedule.tsx (1), src/components/faq/FaqAccordionItem.tsx (1), src/components/hero/MobileHeroSequence.tsx (1), src/pages/FAQ.tsx (1) |
| py-1.5 | 4 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| py-10 | 4 | src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| py-5 | 4 | src/pages/TheRealProcurementTimeline.tsx (2), src/components/faq/FaqAccordionItem.tsx (1), src/pages/BrokenBeforeJobStarts.tsx (1) |
| space-y-1 | 4 | src/components/Navigation.tsx (2), src/components/investor/InvestorNav.tsx (1), src/pages/investor/InvestorDeckPage.tsx (1) |
| top-1 | 4 | src/components/InteractiveProcurementSchedule.tsx (2), src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| w-1 | 4 | src/components/hero/ProcurementFlowHero.tsx (2), src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| w-20 | 4 | src/pages/investor/WhyNow.tsx (2), src/components/TypicalScheduleSection.tsx (1), src/pages/investor/HiddenCost.tsx (1) |
| gap-1 | 3 | src/components/InteractiveProcurementSchedule.tsx (1), src/components/investor/InvestorNav.tsx (1), src/pages/investor/InvestorAppendix.tsx (1) |
| gap-y-1 | 3 | src/components/ControlledProcurementSection.tsx (1), src/components/timeline/TimelineShow.tsx (1), src/pages/BrokenBeforeJobStarts.tsx (1) |
| h-16 | 3 | src/pages/investor/EconomicCase.tsx (2), src/pages/HowItWorks.tsx (1) |
| h-2.5 | 3 | src/components/ControlledProcurementSection.tsx (2), src/pages/investor/InvestorDeckPage.tsx (1) |
| h-20 | 3 | src/components/Navigation.tsx (1), src/components/TypicalScheduleSection.tsx (1), src/components/investor/InvestorNav.tsx (1) |
| h-8 | 3 | src/components/InteractiveProcurementSchedule.tsx (1), src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| max-w-md | 3 | src/components/hero/MobileHeroSequence.tsx (1), src/components/investor/AccessRequestForm.tsx (1), src/pages/AdminApproved.tsx (1) |
| max-w-sm | 3 | src/pages/Admin.tsx (1), src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| mb-7 | 3 | src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| min-h-0 | 3 | src/components/InteractiveProcurementSchedule.tsx (3) |
| mr-1.5 | 3 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| my-6 | 3 | src/pages/investor/InvestorDeckPage.tsx (2), src/pages/BrokenBeforeJobStarts.tsx (1) |
| p-10 | 3 | src/components/timeline/TimelineShow.tsx (2), src/pages/AdminApproved.tsx (1) |
| pb-6 | 3 | src/components/faq/FaqAccordionItem.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1), src/pages/roles/GeneralContractors.legacy.tsx (1) |
| pl-4 | 3 | src/components/Navigation.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/pages/FAQ.tsx (1) |
| pt-10 | 3 | src/pages/investor/InvestorDeckPage.tsx (2), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| pt-20 | 3 | src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/FounderStory.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| pt-24 | 3 | src/components/hero/ProcurementFlowHero.tsx (1), src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| px-2 | 3 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/pages/investor/InvestorAppendix.tsx (1) |
| px-5 | 3 | src/components/timeline/TimelineShow.tsx (2), src/components/ControlledProcurementSection.tsx (1) |
| py-0.5 | 3 | src/components/hero/MobileHeroSequence.tsx (1), src/pages/investor/InvestorAppendix.tsx (1), src/pages/investor/InvestorDeckPage.tsx (1) |
| right-4 | 3 | src/components/hero/MobileHeroSequence.tsx (2), src/pages/investor/InvestorDeckPage.tsx (1) |
| space-y-10 | 3 | src/pages/FounderStory.tsx (2), src/pages/Home.legacy.tsx (1) |
| w-10 | 3 | src/components/TypicalScheduleSection.tsx (1), src/pages/investor/InvestorProduct.tsx (1), src/pages/roles/GeneralContractors.legacy.tsx (1) |
| w-16 | 3 | src/pages/investor/EconomicCase.tsx (2), src/pages/HowItWorks.tsx (1) |
| w-5 | 3 | src/components/timeline/TimelineShow.tsx (1), src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| bottom-1 | 2 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| gap-0 | 2 | src/pages/investor/HiddenCost.tsx (1), src/pages/investor/InvestorProduct.tsx (1) |
| gap-1.5 | 2 | src/components/investor/InvestorNav.tsx (2) |
| gap-x-3 | 2 | src/components/timeline/TimelineShow.tsx (1), src/pages/BrokenBeforeJobStarts.tsx (1) |
| h-11 | 2 | src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| h-12 | 2 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| h-28 | 2 | src/components/Navigation.tsx (1), src/components/investor/InvestorNav.tsx (1) |
| h-7 | 2 | src/components/TypicalScheduleSection.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| h-9 | 2 | src/components/Footer.tsx (1), src/components/TypicalScheduleSection.tsx (1) |
| left-8 | 2 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| min-h-36 | 2 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| mr-2 | 2 | src/pages/investor/InvestorAppendix.tsx (1), src/pages/investor/InvestorProduct.tsx (1) |
| mt-12 | 2 | src/pages/Demo.tsx (1), src/pages/investor/MarketOpportunity.tsx (1) |
| mt-16 | 2 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| mx-6 | 2 | src/components/timeline/TimelineShow.tsx (2) |
| p-1.5 | 2 | src/pages/FAQ.tsx (2) |
| pb-2 | 2 | src/components/Navigation.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| pl-2 | 2 | src/components/InteractiveProcurementSchedule.tsx (2) |
| pl-5 | 2 | src/components/faq/FaqAccordionItem.tsx (1), src/pages/BrokenBeforeJobStarts.tsx (1) |
| pl-6 | 2 | src/pages/FounderStory.tsx (1), src/pages/roles/GeneralContractors.legacy.tsx (1) |
| pr-2 | 2 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| px-1 | 2 | src/components/InteractiveProcurementSchedule.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| px-1.5 | 2 | src/components/ControlledProcurementSection.tsx (1), src/components/hero/MobileHeroSequence.tsx (1) |
| py-12 | 2 | src/pages/Admin.tsx (1), src/pages/FounderStory.tsx (1) |
| py-8 | 2 | src/components/InteractiveProcurementSchedule.tsx (1), src/components/timeline/TimelineShow.tsx (1) |
| right-5 | 2 | src/components/hero/ProcurementFlowHero.tsx (2) |
| right-8 | 2 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| space-y-0 | 2 | src/pages/investor/HiddenCost.tsx (1), src/pages/investor/InvestorProduct.tsx (1) |
| space-y-16 | 2 | src/pages/Documentation.tsx (1), src/pages/Product.tsx (1) |
| space-y-2.5 | 2 | src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/investor/InvestorDeckPage.tsx (1) |
| top-4 | 2 | src/components/hero/MobileHeroSequence.tsx (2) |
| top-5 | 2 | src/components/hero/ProcurementFlowHero.tsx (2) |
| top-[2.35rem] | 2 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| w-11 | 2 | src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| w-12 | 2 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| w-2.5 | 2 | src/components/ControlledProcurementSection.tsx (1), src/pages/investor/InvestorDeckPage.tsx (1) |
| w-32 | 2 | src/pages/investor/HiddenCost.tsx (1), src/pages/investor/InvestorAppendix.tsx (1) |
| w-40 | 2 | src/components/investor/InvestorNav.tsx (2) |
| w-6 | 2 | src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| w-8 | 2 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| w-9 | 2 | src/components/Footer.tsx (1), src/components/TypicalScheduleSection.tsx (1) |
| w-[3px] | 2 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| w-[58%] | 2 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| bottom-10 | 1 | src/components/TypicalScheduleSection.tsx (1) |
| bottom-3 | 1 | src/components/TypicalScheduleSection.tsx (1) |
| gap-0.5 | 1 | src/components/hero/MobileHeroSequence.tsx (1) |
| gap-2.5 | 1 | src/pages/investor/InvestorDeckPage.tsx (1) |
| gap-x-2 | 1 | src/pages/TheRealProcurementTimeline.tsx (1) |
| gap-x-6 | 1 | src/components/ControlledProcurementSection.tsx (1) |
| gap-y-1.5 | 1 | src/pages/TheRealProcurementTimeline.tsx (1) |
| gap-y-2 | 1 | src/components/ControlledProcurementSection.tsx (1) |
| h-0 | 1 | src/components/InteractiveProcurementSchedule.tsx (1) |
| h-3 | 1 | src/pages/investor/MarketOpportunity.tsx (1) |
| h-3.5 | 1 | src/pages/TheRealProcurementTimeline.tsx (1) |
| h-[18px] | 1 | src/components/TypicalScheduleSection.tsx (1) |
| h-[600px] | 1 | src/components/InteractiveProcurementSchedule.tsx (1) |
| left-1 | 1 | src/components/InteractiveProcurementSchedule.tsx (1) |
| left-1/2 | 1 | src/components/hero/MobileHeroSequence.tsx (1) |
| left-3 | 1 | src/components/TypicalScheduleSection.tsx (1) |
| left-6 | 1 | src/components/hero/MobileHeroSequence.tsx (1) |
| left-[16.75rem] | 1 | src/components/timeline/TimelineShow.tsx (1) |
| left-[29rem] | 1 | src/pages/TheRealProcurementTimeline.tsx (1) |
| m-auto | 1 | src/components/timeline/TimelineShow.tsx (1) |
| max-w-48 | 1 | src/pages/Admin.tsx (1) |
| max-w-[1080px] | 1 | src/components/timeline/TimelineShow.tsx (1) |
| max-w-xs | 1 | src/pages/FounderStory.tsx (1) |
| ml-0.5 | 1 | src/components/TypicalScheduleSection.tsx (1) |
| ml-1.5 | 1 | src/components/hero/ProcurementFlowHero.tsx (1) |
| ml-2 | 1 | src/components/investor/InvestorNav.tsx (1) |
| my-1 | 1 | src/pages/investor/InvestorProduct.tsx (1) |
| p-1 | 1 | src/components/InteractiveProcurementSchedule.tsx (1) |
| pb-10 | 1 | src/pages/investor/InvestorProduct.tsx (1) |
| pb-24 | 1 | src/pages/FAQ.tsx (1) |
| pl-3 | 1 | src/components/hero/MobileHeroSequence.tsx (1) |
| pl-7 | 1 | src/pages/investor/InvestorDeckPage.tsx (1) |
| pr-5 | 1 | src/components/hero/ProcurementFlowHero.tsx (1) |
| pt-3 | 1 | src/components/investor/InvestorNav.tsx (1) |
| px-10 | 1 | src/components/TypicalScheduleSection.tsx (1) |
| py-14 | 1 | src/pages/BrokenBeforeJobStarts.tsx (1) |
| py-3.5 | 1 | src/pages/TheRealProcurementTimeline.tsx (1) |
| py-6 | 1 | src/components/investor/InvestorFooter.tsx (1) |
| py-px | 1 | src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| right-6 | 1 | src/components/hero/MobileHeroSequence.tsx (1) |
| space-y-1.5 | 1 | src/components/faq/FaqAccordionItem.tsx (1) |
| top-20 | 1 | src/pages/FAQ.tsx (1) |
| top-[24px] | 1 | src/components/timeline/TimelineShow.tsx (1) |
| top-[30px] | 1 | src/pages/TheRealProcurementTimeline.tsx (1) |
| top-full | 1 | src/components/Navigation.tsx (1) |
| w-2/5 | 1 | src/pages/investor/HiddenCost.tsx (1) |
| w-3.5 | 1 | src/pages/TheRealProcurementTimeline.tsx (1) |
| w-64 | 1 | src/components/Navigation.tsx (1) |
| w-[18px] | 1 | src/components/TypicalScheduleSection.tsx (1) |
| w-[90%] | 1 | src/components/hero/MobileHeroSequence.tsx (1) |
## 9. BORDER RADIUS

| Radius utility | Approx frequency | Primary file references |
| --- | --- | --- |
| rounded-lg | 63 | src/pages/HomepageConcept.tsx (11), src/pages/Home.tsx (9), src/pages/investor/WhyNow.tsx (5), src/pages/investor/HiddenCost.tsx (4), src/pages/roles/GeneralContractors.tsx (4) |
| rounded-full | 50 | src/pages/roles/GeneralContractors.legacy.tsx (6), src/components/hero/ProcurementFlowHero.tsx (5), src/components/hero/MobileHeroSequence.tsx (4), src/pages/investor/WhyNow.tsx (4), src/pages/Home.tsx (3) |
| rounded-2xl | 34 | src/pages/Home.tsx (13), src/pages/HomepageConcept.tsx (13), src/components/timeline/TimelineShow.tsx (2), src/pages/BrokenBeforeJobStarts.tsx (2), src/pages/roles/GeneralContractors.tsx (2) |
| rounded | 26 | src/components/investor/AccessRequestForm.tsx (5), src/pages/investor/InvestorHome.tsx (5), src/components/investor/InvestorNav.tsx (4), src/pages/Admin.tsx (4), src/components/Footer.tsx (1) |
| rounded-xl | 25 | src/pages/roles/ArchitectsEngineers.tsx (4), src/pages/roles/OwnersDevelopers.tsx (4), src/pages/roles/ProjectManagers.tsx (4), src/pages/roles/Subcontractors.tsx (4), src/components/ControlledProcurementSection.tsx (1) |
| rounded-md | 11 | src/components/timeline/TimelineShow.tsx (4), src/components/InteractiveProcurementSchedule.tsx (2), src/components/TypicalScheduleSection.tsx (1), src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| rounded-3xl | 10 | src/pages/roles/GeneralContractors.tsx (4), src/pages/roles/GeneralContractorsConcept.tsx (4), src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| rounded-sm | 4 | src/components/ControlledProcurementSection.tsx (2), src/components/InteractiveProcurementSchedule.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| rounded-[2px] | 2 | src/components/TypicalScheduleSection.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| rounded-[3px] | 2 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| rounded-l | 2 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| rounded-t | 2 | src/pages/investor/EconomicCase.tsx (2) |
## 10. SHADOW SYSTEM

| Shadow utility | Approx frequency | Primary file references |
| --- | --- | --- |
| shadow-sm | 12 | src/pages/Home.tsx (3), src/pages/HomepageConcept.tsx (3), src/components/ControlledProcurementSection.tsx (1), src/components/InteractiveProcurementSchedule.tsx (1), src/pages/CompanyProjectHealth.tsx (1) |
| shadow-lg | 10 | src/components/investor/InvestorNav.tsx (2), src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/components/InteractiveProcurementSchedule.tsx (1), src/components/Navigation.tsx (1) |
| shadow-2xl | 5 | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/components/TypicalScheduleSection.tsx (1) |
| shadow-[0_4px_14px_rgba(0,0,0,0.35)] | 1 | src/components/TypicalScheduleSection.tsx (1) |
| shadow-amber-500/10 | 1 | src/pages/TheRealProcurementTimeline.tsx (1) |
| shadow-xl | 1 | src/pages/TheRealProcurementTimeline.tsx (1) |
## 11. GRADIENT SYSTEM

### 11.1 Gradient utilities

| Gradient utility | Approx frequency | Approx value | Primary file references |
| --- | --- | --- | --- |
| bg-gradient-to-br | 2 |  | src/pages/BrokenBeforeJobStarts.tsx (2) |
| bg-gradient-to-l | 1 |  | src/pages/FAQ.tsx (1) |
| bg-gradient-to-r | 8 |  | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/pages/FAQ.tsx (1) |
| bg-gradient-to-t | 4 |  | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| from-[#030a19] | 2 | #030a19 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| from-[#030a19]/55 | 2 | #030a19 @ 0.55 | src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| from-[#030a19]/60 | 2 | #030a19 @ 0.6 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| from-[#030a19]/85 | 1 | #030a19 @ 0.85 | src/components/hero/ProcurementFlowHero.tsx (1) |
| from-[#030a19]/90 | 1 | #030a19 @ 0.9 | src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| from-amber-300/40 | 2 | #fcd34d @ 0.4 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| from-amber-500 | 1 | #f59e0b | src/pages/investor/HiddenCost.tsx (1) |
| from-amber-500/10 | 2 | #f59e0b @ 0.1 | src/pages/BrokenBeforeJobStarts.tsx (2) |
| from-white | 2 | #ffffff | src/pages/FAQ.tsx (2) |
| to-[#030a19]/30 | 3 | #030a19 @ 0.3 | src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| to-[#030a19]/60 | 2 | #030a19 @ 0.6 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| to-[#030a19]/70 | 1 | #030a19 @ 0.7 | src/components/hero/MobileHeroSequence.tsx (1) |
| to-red-300/40 | 2 | #fca5a5 @ 0.4 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| to-red-500 | 1 | #ef4444 | src/pages/investor/HiddenCost.tsx (1) |
| to-slate-900/40 | 2 | #0f172a @ 0.4 | src/pages/BrokenBeforeJobStarts.tsx (2) |
| to-transparent | 4 | transparent | src/pages/FAQ.tsx (2), src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| via-[#030a19]/20 | 1 | #030a19 @ 0.2 | src/components/hero/ProcurementFlowHero.tsx (1) |
| via-[#030a19]/30 | 2 | #030a19 @ 0.3 | src/components/hero/MobileHeroSequence.tsx (1), src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| via-[#030a19]/92 | 2 | #030a19 @ 0.92 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| via-amber-300/30 | 2 | #fcd34d @ 0.3 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| via-transparent | 3 | transparent | src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| via-white/80 | 2 | #ffffff @ 0.8 | src/pages/FAQ.tsx (2) |

### 11.2 Gradient implementation lines

| File | Line | Implementation excerpt |
| --- | --- | --- |
| src/components/TypicalScheduleSection.tsx | 678 | ? 'repeating-linear-gradient(45deg, transparent 0 4px, rgba(148,163,184,0.30) 4px 6px)' |
| src/components/hero/MobileHeroSequence.tsx | 277 | ? 'linear-gradient(to bottom, rgba(220,38,38,0.95), rgba(220,38,38,0.5))' |
| src/components/hero/MobileHeroSequence.tsx | 278 | : 'linear-gradient(to bottom, rgba(253,224,71,0.95), rgba(245,158,11,0.5))'; |
| src/components/hero/MobileHeroSequence.tsx | 296 | className="absolute inset-0 bg-gradient-to-t from-[#030a19]/60 via-[#030a19]/30 to-[#030a19]/70 pointer-events-none" |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 161 | maskImage: 'linear-gradient(to right, transparent 0%, black 8%), linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)', |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 162 | WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%), linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)', |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 365 | <div className="absolute inset-0 bg-gradient-to-r from-[#030a19]/90 via-[#030a19]/30 to-transparent pointer-events-none" /> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 366 | <div className="absolute inset-0 bg-gradient-to-t from-[#030a19]/60 via-transparent to-[#030a19]/30 pointer-events-none" /> |
| src/components/hero/ProcurementFlowHero.tsx | 177 | maskImage: 'linear-gradient(to right, transparent 0%, black 8%), linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)', |
| src/components/hero/ProcurementFlowHero.tsx | 178 | WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%), linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)', |
| src/components/hero/ProcurementFlowHero.tsx | 198 | <div className="absolute inset-0 bg-gradient-to-r from-[#030a19]/85 via-[#030a19]/20 to-transparent pointer-events-none" /> |
| src/components/hero/ProcurementFlowHero.tsx | 199 | <div className="absolute inset-0 bg-gradient-to-t from-[#030a19]/55 via-transparent to-[#030a19]/30 pointer-events-none" /> |
| src/components/hero/ProcurementFlowHero.tsx | 845 | ? 'linear-gradient(to bottom, rgba(220,38,38,0.95), rgba(220,38,38,0.55))' |
| src/components/hero/ProcurementFlowHero.tsx | 846 | : 'linear-gradient(to bottom, rgba(253,224,71,0.95), rgba(245,158,11,0.55))', |
| src/components/hero/_archive/JitproGanttAnimation.tsx | 237 | <div className="absolute inset-0 bg-gradient-to-t from-[#030a19]/55 via-transparent to-[#030a19]/30 pointer-events-none" /> |
| src/components/hero/_archive/JitproGanttAnimation.tsx | 355 | ? 'linear-gradient(180deg, rgba(253,224,71,0.42), rgba(245,158,11,0.32))' |
| src/components/hero/_archive/JitproGanttAnimation.tsx | 357 | ? 'linear-gradient(180deg, rgba(245,158,11,0.42), rgba(217,119,6,0.32))' |
| src/components/hero/_archive/JitproGanttAnimation.tsx | 358 | : 'linear-gradient(180deg, rgba(71,85,105,0.4), rgba(51,65,85,0.3))'; |
| src/components/hero/_archive/JitproGanttAnimation.tsx | 401 | background: 'linear-gradient(to bottom, rgba(253,224,71,0.95), rgba(245,158,11,0.55))', |
| src/pages/BrokenBeforeJobStarts.tsx | 161 | <div className="border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-slate-900/40 rounded-2xl p-8 md:p-10"> |
| src/pages/BrokenBeforeJobStarts.tsx | 259 | <div className="border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-slate-900/40 rounded-2xl p-8 md:p-12 text-center"> |
| src/pages/FAQ.tsx | 166 | <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-white via-white/80 to-transparent pr-4"> |
| src/pages/FAQ.tsx | 200 | <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-white via-white/80 to-transparent pl-4"> |
| src/pages/Home.tsx | 106 | 'radial-gradient(circle at 20% 20%, rgba(245,158,11,0.22), transparent 32%), radial-gradient(circle at 80% 30%, rgba(59,130,246,0.12), transparent 30%)', |
| src/pages/Home.tsx | 117 | <div className="absolute inset-0 bg-gradient-to-r from-[#030a19] via-[#030a19]/92 to-[#030a19]/60" /> |
| src/pages/Home.tsx | 151 | <div className="absolute left-8 right-8 top-[2.35rem] h-px bg-gradient-to-r from-amber-300/40 via-amber-300/30 to-red-300/40" /> |
| src/pages/HomepageConcept.tsx | 102 | 'radial-gradient(circle at 20% 20%, rgba(245,158,11,0.22), transparent 32%), radial-gradient(circle at 80% 30%, rgba(59,130,246,0.12), transparent 30%)', |
| src/pages/HomepageConcept.tsx | 113 | <div className="absolute inset-0 bg-gradient-to-r from-[#030a19] via-[#030a19]/92 to-[#030a19]/60" /> |
| src/pages/HomepageConcept.tsx | 162 | <div className="absolute left-8 right-8 top-[2.35rem] h-px bg-gradient-to-r from-amber-300/40 via-amber-300/30 to-red-300/40" /> |
| src/pages/investor/HiddenCost.tsx | 151 | className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full" |
| src/pages/roles/GeneralContractors.tsx | 60 | 'radial-gradient(circle at 18% 22%, rgba(245,158,11,0.20), transparent 30%), radial-gradient(circle at 80% 8%, rgba(59,130,246,0.12), transparent 28%)', |
| src/pages/roles/GeneralContractorsConcept.tsx | 64 | 'radial-gradient(circle at 18% 22%, rgba(245,158,11,0.20), transparent 30%), radial-gradient(circle at 80% 8%, rgba(59,130,246,0.12), transparent 28%)', |
## 12. MOTION TOKENS

The implementation currently uses Tailwind transitions, CSS keyframes, Framer Motion, requestAnimationFrame-driven hero timing, IntersectionObserver reveal, hover state utilities, and duration/easing classes. No centralized motion token file was found.

### 12.1 Motion-related utility classes

| Motion/hover utility | Approx frequency | Primary file references |
| --- | --- | --- |
| transition-colors | 93 | src/components/Footer.tsx (13), src/pages/HomepageConcept.tsx (6), src/components/investor/AccessRequestForm.tsx (5), src/pages/Home.legacy.tsx (5), src/pages/investor/InvestorHome.tsx (5) |
| hover:bg-amber-400 | 16 | src/pages/Admin.tsx (2), src/pages/BrokenBeforeJobStarts.tsx (2), src/pages/investor/InvestorHome.tsx (2), src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2) |
| hover:text-slate-900 | 12 | src/components/Footer.tsx (11), src/pages/ThankYou.tsx (1) |
| hover:bg-slate-800 | 11 | src/pages/Demo.tsx (1), src/pages/Home.legacy.tsx (1), src/pages/HomepageConcept.tsx (1), src/pages/Product.tsx (1), src/pages/Roles.tsx (1) |
| hover:bg-slate-100 | 9 | src/components/InteractiveProcurementSchedule.tsx (2), src/pages/FAQ.tsx (2), src/pages/roles/ArchitectsEngineers.tsx (1), src/pages/roles/GeneralContractors.legacy.tsx (1), src/pages/roles/OwnersDevelopers.tsx (1) |
| transition-transform | 7 | src/components/Navigation.tsx (2), src/components/investor/InvestorNav.tsx (2), src/components/faq/FaqAccordionItem.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1), src/pages/roles/GeneralContractors.legacy.tsx (1) |
| hover:border-slate-400 | 6 | src/pages/investor/InvestorHome.tsx (3), src/components/InteractiveProcurementSchedule.tsx (2), src/pages/Roles.tsx (1) |
| duration-300 | 5 | src/components/hero/_archive/JitproGanttAnimation.tsx (3), src/components/hero/ProcurementFlowHero.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| transition-opacity | 5 | src/components/hero/_archive/JitproGanttAnimation.tsx (3), src/components/timeline/TimelineShow.tsx (2) |
| duration-200 | 4 | src/components/investor/InvestorNav.tsx (2), src/pages/roles/GeneralContractors.legacy.tsx (2) |
| hover:border-white/30 | 4 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| hover:text-amber-400 | 4 | src/components/timeline/TimelineShow.tsx (2), src/pages/Home.tsx (2) |
| hover:text-amber-700 | 4 | src/pages/Home.legacy.tsx (2), src/pages/HomepageConcept.tsx (2) |
| hover:text-white/85 | 4 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| duration-500 | 3 | src/components/faq/FaqAccordionItem.tsx (2), src/components/TypicalScheduleSection.tsx (1) |
| hover:border-amber-300 | 3 | src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| hover:border-white/45 | 3 | src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| hover:text-amber-500 | 3 | src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1), src/pages/investor/InvestorAppendix.tsx (1) |
| hover:text-slate-100 | 3 | src/pages/investor/InvestorHome.tsx (3) |
| group-hover:text-amber-600 | 2 | src/pages/Roles.tsx (2) |
| hover:bg-amber-500/10 | 2 | src/components/investor/InvestorNav.tsx (2) |
| hover:bg-slate-900/60 | 2 | src/components/timeline/TimelineShow.tsx (2) |
| hover:text-amber-200 | 2 | src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| hover:text-slate-200 | 2 | src/components/investor/InvestorNav.tsx (1), src/pages/Admin.tsx (1) |
| hover:text-slate-700 | 2 | src/pages/FAQ.tsx (2) |
| transition | 2 | src/components/TypicalScheduleSection.tsx (2) |
| transition-[grid-template-rows] | 2 | src/components/faq/FaqAccordionItem.tsx (1), src/pages/roles/GeneralContractors.legacy.tsx (1) |
| ease-in-out | 1 | src/components/faq/FaqAccordionItem.tsx (1) |
| ease-out | 1 | src/components/timeline/TimelineShow.tsx (1) |
| group-hover:!bg-slate-400 | 1 | src/pages/investor/InvestorDeckPage.tsx (1) |
| group-hover:!opacity-100 | 1 | src/pages/investor/InvestorDeckPage.tsx (1) |
| group-hover:bg-white | 1 | src/components/TypicalScheduleSection.tsx (1) |
| group-hover:text-slate-700 | 1 | src/components/faq/FaqAccordionItem.tsx (1) |
| hover:bg-[#004182] | 1 | src/components/Footer.tsx (1) |
| hover:bg-black/75 | 1 | src/components/TypicalScheduleSection.tsx (1) |
| hover:bg-red-500/30 | 1 | src/pages/Admin.tsx (1) |
| hover:bg-slate-50/50 | 1 | src/components/InteractiveProcurementSchedule.tsx (1) |
| hover:bg-slate-900/70 | 1 | src/pages/TheRealProcurementTimeline.tsx (1) |
| hover:border-amber-500/50 | 1 | src/pages/Home.tsx (1) |
| hover:border-amber-500/60 | 1 | src/components/timeline/TimelineShow.tsx (1) |
| hover:border-slate-900 | 1 | src/pages/Home.legacy.tsx (1) |
| hover:shadow-md | 1 | src/pages/roles/GeneralContractors.legacy.tsx (1) |
| hover:text-amber-300 | 1 | src/pages/Home.legacy.tsx (1) |
| hover:text-slate-300 | 1 | src/components/investor/InvestorFooter.tsx (1) |
| hover:text-slate-600 | 1 | src/components/Footer.tsx (1) |
| hover:text-white | 1 | src/components/timeline/TimelineShow.tsx (1) |
| transition-shadow | 1 | src/pages/roles/GeneralContractors.legacy.tsx (1) |

### 12.2 Motion implementation references

| File | Line | Implementation excerpt |
| --- | --- | --- |
| package.json | 15 | "framer-motion": "^12.40.0", |
| src/components/ControlledProcurementSection.tsx | 128 | const observer = new IntersectionObserver(([entry]) => { |
| src/components/ControlledProcurementSection.tsx | 148 | if (e < TOTAL_ANIM_MS) raf = requestAnimationFrame(step); |
| src/components/ControlledProcurementSection.tsx | 150 | raf = requestAnimationFrame(step); |
| src/components/Footer.tsx | 18 | className="inline-flex items-center justify-center w-9 h-9 rounded bg-[#0A66C2] hover:bg-[#004182] transition-colors" |
| src/components/Footer.tsx | 29 | <Link to="/product" className="text-slate-600 hover:text-slate-900 transition-colors"> |
| src/components/Footer.tsx | 34 | <Link to="/how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors"> |
| src/components/Footer.tsx | 45 | <Link to="/roles/general-contractors" className="text-slate-600 hover:text-slate-900 transition-colors"> |
| src/components/Footer.tsx | 50 | <Link to="/roles/architects-engineers" className="text-slate-600 hover:text-slate-900 transition-colors"> |
| src/components/Footer.tsx | 55 | <Link to="/roles/subcontractors" className="text-slate-600 hover:text-slate-900 transition-colors"> |
| src/components/Footer.tsx | 60 | <Link to="/roles/owners-developers" className="text-slate-600 hover:text-slate-900 transition-colors"> |
| src/components/Footer.tsx | 65 | <Link to="/roles/project-managers" className="text-slate-600 hover:text-slate-900 transition-colors"> |
| src/components/Footer.tsx | 76 | <Link to="/why" className="text-slate-600 hover:text-slate-900 transition-colors"> |
| src/components/Footer.tsx | 81 | <Link to="/documentation" className="text-slate-600 hover:text-slate-900 transition-colors"> |
| src/components/Footer.tsx | 86 | <Link to="/about" className="text-slate-600 hover:text-slate-900 transition-colors"> |
| src/components/Footer.tsx | 91 | <Link to="/faq" className="text-slate-600 hover:text-slate-900 transition-colors"> |
| src/components/Footer.tsx | 105 | className="text-sm text-slate-400 hover:text-slate-600 transition-colors" |
| src/components/InteractiveProcurementSchedule.tsx | 328 | className={`rounded px-3 py-1 text-xs font-medium transition-colors ${ |
| src/components/InteractiveProcurementSchedule.tsx | 355 | className="absolute top-0 right-0 h-full w-2 cursor-col-resize border-r border-slate-200 hover:border-slate-400 hover:bg-slate-100 transition-colors" |
| src/components/InteractiveProcurementSchedule.tsx | 426 | className="flex border-b border-slate-50 hover:bg-slate-50/50 transition-colors" |
| src/components/InteractiveProcurementSchedule.tsx | 439 | className="absolute top-0 right-0 h-full w-2 cursor-col-resize border-r border-slate-200 hover:border-slate-400 hover:bg-slate-100 transition-colors" |
| src/components/Navigation.tsx | 80 | className={`text-sm font-medium transition-colors inline-flex items-center gap-1 ${ |
| src/components/Navigation.tsx | 87 | <ChevronDown size={14} className={`transition-transform ${openDesktop === key ? 'rotate-180' : ''}`} /> |
| src/components/Navigation.tsx | 97 | className={`block px-4 py-2.5 text-sm transition-colors ${ |
| src/components/Navigation.tsx | 142 | <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} /> |
| src/components/TypicalScheduleSection.tsx | 99 | type: 'motion' \| 'pause' \| 'transition' \| 'closing'; |
| src/components/TypicalScheduleSection.tsx | 133 | segs.push({ type: 'transition', startMs: t, endMs: t + TRANSITION_MS }); |
| src/components/TypicalScheduleSection.tsx | 195 | function getCurrentScene(elapsedMs: number): Scene \| 'transition' \| 'closing' { |
| src/components/TypicalScheduleSection.tsx | 198 | if (s.type === 'transition') return 'transition'; |
| src/components/TypicalScheduleSection.tsx | 293 | const seg = SEGMENTS.find(s => s.type === 'transition'); |
| src/components/TypicalScheduleSection.tsx | 324 | rafRef.current = requestAnimationFrame(step); |
| src/components/TypicalScheduleSection.tsx | 326 | rafRef.current = requestAnimationFrame(step); |
| src/components/TypicalScheduleSection.tsx | 399 | scene === 'transition' ? "What Actually Happens…"        : |
| src/components/TypicalScheduleSection.tsx | 434 | <span className="w-20 h-20 rounded-full bg-white/90 group-hover:bg-white shadow-2xl flex items-center justify-center transition"> |
| src/components/TypicalScheduleSection.tsx | 450 | className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center transition" |
| src/components/TypicalScheduleSection.tsx | 470 | scene: Scene \| 'transition' \| 'closing'; |
| src/components/TypicalScheduleSection.tsx | 513 | className={`absolute text-[10px] md:text-[11px] uppercase tracking-wider font-medium pr-2 text-right transition-opacity duration-500 ${ |
| src/components/TypicalScheduleSection.tsx | 534 | // Crossfade between planned and actual bar sets during the transition. |
| src/components/TypicalScheduleSection.tsx | 689 | className="absolute transition-colors duration-500" |
| src/components/faq/FaqAccordionItem.tsx | 22 | <span className="text-base font-semibold text-slate-900 pr-4 leading-snug group-hover:text-slate-700 transition-colors"> |
| src/components/faq/FaqAccordionItem.tsx | 27 | className={`mt-0.5 flex-shrink-0 text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} |
| src/components/faq/FaqAccordionItem.tsx | 32 | className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`} |
| src/components/hero/ArchitecturalOutcome.tsx | 61 | style={{ opacity: p * 0.9, transition: 'opacity 2s' }} /> |
| src/components/hero/ArchitecturalOutcome.tsx | 64 | <g style={{ opacity: lo(p, 0), transition: 'opacity 1.5s' }}> |
| src/components/hero/ArchitecturalOutcome.tsx | 73 | <g style={{ opacity: lo(p, 0.1), transition: 'opacity 1.5s' }}> |
| src/components/hero/ArchitecturalOutcome.tsx | 87 | <g style={{ opacity: lo(p, 0.18), transition: 'opacity 1.5s' }}> |
| src/components/hero/ArchitecturalOutcome.tsx | 102 | <g style={{ opacity: lo(p, 0.2), transition: 'opacity 1.5s' }}> |
| src/components/hero/ArchitecturalOutcome.tsx | 134 | <g style={{ opacity: lo(p, 0.38), transition: 'opacity 1.5s' }}> |
| src/components/hero/ArchitecturalOutcome.tsx | 195 | <g style={{ opacity: lo(p, 0.52), transition: 'opacity 2s' }}> |
| src/components/hero/ArchitecturalOutcome.tsx | 201 | style={{ animation: 'heroWindowPulse 7s ease-in-out infinite' }} /> |
| src/components/hero/ArchitecturalOutcome.tsx | 206 | style={{ animation: 'heroWindowPulse 8s ease-in-out infinite', animationDelay: '1s' }} /> |
| src/components/hero/ArchitecturalOutcome.tsx | 209 | style={{ animation: 'heroWindowPulse 6.5s ease-in-out infinite', animationDelay: '2s' }} /> |
| src/components/hero/ArchitecturalOutcome.tsx | 211 | style={{ animation: 'heroWindowPulse 7.5s ease-in-out infinite', animationDelay: '0.5s' }} /> |
| src/components/hero/ArchitecturalOutcome.tsx | 217 | style={{ animation: 'heroWindowPulse 9s ease-in-out infinite', animationDelay: '3s' }} /> |
| src/components/hero/ArchitecturalOutcome.tsx | 219 | style={{ animation: 'heroWindowPulse 7s ease-in-out infinite', animationDelay: '1.5s' }} /> |
| src/components/hero/ArchitecturalOutcome.tsx | 231 | style={{ animation: 'heroWindowPulse 10s ease-in-out infinite', animationDelay: '2s' }} /> |
| src/components/hero/ArchitecturalOutcome.tsx | 237 | <g style={{ opacity: lo(p, 0.7), transition: 'opacity 2s' }}> |
| src/components/hero/MobileHeroSequence.tsx | 19 | import { motion, AnimatePresence } from 'framer-motion'; |
| src/components/hero/MobileHeroSequence.tsx | 182 | if (e < TOTAL_MS) rafRef.current = requestAnimationFrame(step); |
| src/components/hero/MobileHeroSequence.tsx | 184 | rafRef.current = requestAnimationFrame(step); |
| src/components/hero/MobileHeroSequence.tsx | 303 | <AnimatePresence mode="wait"> |
| src/components/hero/MobileHeroSequence.tsx | 305 | <motion.div |
| src/components/hero/MobileHeroSequence.tsx | 310 | transition={{ duration: 0.32 }} |
| src/components/hero/MobileHeroSequence.tsx | 321 | </motion.div> |
| src/components/hero/MobileHeroSequence.tsx | 323 | </AnimatePresence> |
| src/components/hero/MobileHeroSequence.tsx | 345 | transition: 'background 300ms, border-color 300ms', |
| src/components/hero/MobileHeroSequence.tsx | 360 | transition: 'background 400ms, border-color 400ms', |
| src/components/hero/MobileHeroSequence.tsx | 410 | <AnimatePresence mode="wait"> |
| src/components/hero/MobileHeroSequence.tsx | 412 | <motion.p |
| src/components/hero/MobileHeroSequence.tsx | 417 | transition={{ duration: 0.3 }} |
| src/components/hero/MobileHeroSequence.tsx | 423 | </motion.p> |
| src/components/hero/MobileHeroSequence.tsx | 425 | </AnimatePresence> |
| src/components/hero/MobileHeroSequence.tsx | 478 | className="absolute top-4 right-4 z-30 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] font-medium text-white/45 hover:text-white/85 border border-white/10 hover:border-white/30 rounded-full transition-colors bg-[#030a19]/40 backdrop- |
| src/components/hero/MobileHeroSequence.tsx | 486 | className="absolute top-4 right-4 z-30 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] font-medium text-white/45 hover:text-white/85 border border-white/10 hover:border-white/30 rounded-full transition-colors bg-[#030a19]/40 backdrop- |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 5 | import { motion, AnimatePresence } from 'framer-motion'; |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 157 | <motion.div |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 168 | transition={{ duration: phase === 'houseFade' \|\| phase === 'idle' ? 3 : 2 }} |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 176 | </motion.div> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 197 | style={{ animation: `heroAmbientGlow ${g.dur}s ease-in-out infinite`, animationDelay: `${i * 1.5}s` }} /> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 205 | <motion.g |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 209 | transition={{ duration: 1.8 }} |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 227 | </motion.g> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 231 | <g opacity={networkOpacity} style={{ transition: 'opacity 3s' }}> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 238 | <AnimatePresence> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 240 | <motion.g key={`card-${cardCycleKey}`} exit={{ opacity: 0, transition: { duration: 1.5 } }}> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 243 | <motion.g |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 246 | transition={{ duration: phase === 'chaos' ? 0.8 : 2 }} |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 257 | </motion.g> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 273 | <motion.path d={stream.pathStr} fill="none" stroke="rgb(245,158,11)" strokeWidth={glowSw} filter="url(#lineGlow)" |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 274 | initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: dur, ease: 'linear' }} opacity={glowOp} /> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 275 | <motion.path d={stream.pathStr} fill="none" stroke="rgb(245,158,11)" strokeWidth={lineSw} |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 276 | initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: dur, ease: 'linear' }} opacity={lineOp} /> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 291 | <motion.path d={merged.pathStr} fill="none" stroke="rgb(251,191,36)" strokeWidth={glowSw} filter="url(#lineGlow)" |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 292 | initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: dur, delay, ease: 'linear' }} opacity={0.2 + t * 0.15} /> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 293 | <motion.path d={merged.pathStr} fill="none" stroke="rgb(253,224,71)" strokeWidth={sw} |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 294 | initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: dur, delay, ease: 'linear' }} opacity={0.6 + t * 0.3} /> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 302 | <motion.g |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 305 | transition={{ duration: phase === 'fading' ? 0.5 : 0.6 }} |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 332 | <motion.rect x={cardX + 6} y={cardY - 22} width={199} height={46} rx={6} |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 335 | transition={{ duration: 0.8 }} |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 338 | </motion.g> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 340 | </motion.g> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 342 | </AnimatePresence> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 344 | <AnimatePresence> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 346 | <motion.g key={note.id} |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 348 | transition={{ duration: 0.35 }}> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 359 | </motion.g> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 361 | </AnimatePresence> |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 369 | <motion.div |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 373 | transition={{ duration: 5 }} |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 386 | </motion.div> |
| src/components/hero/ProcurementFlowHero.tsx | 17 | import { motion } from 'framer-motion'; |
| src/components/hero/ProcurementFlowHero.tsx | 109 | // Drive elapsed via requestAnimationFrame |
| src/components/hero/ProcurementFlowHero.tsx | 120 | rafRef.current = requestAnimationFrame(step); |
| src/components/hero/ProcurementFlowHero.tsx | 123 | rafRef.current = requestAnimationFrame(step); |
| src/components/hero/ProcurementFlowHero.tsx | 172 | <motion.div |
| src/components/hero/ProcurementFlowHero.tsx | 184 | transition={{ duration: 0.5, ease: 'linear' }} |
| src/components/hero/ProcurementFlowHero.tsx | 192 | </motion.div> |
| src/components/hero/ProcurementFlowHero.tsx | 228 | className="absolute top-5 right-5 z-30 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] font-medium text-white/45 hover:text-white/85 border border-white/10 hover:border-white/30 rounded-full transition-colors bg-[#030a19]/40 backdrop- |
| src/components/hero/ProcurementFlowHero.tsx | 238 | className="absolute top-5 right-5 z-30 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] font-medium text-white/45 hover:text-white/85 border border-white/10 hover:border-white/30 rounded-full transition-colors bg-[#030a19]/40 backdrop- |
| src/components/hero/ProcurementFlowHero.tsx | 284 | No CSS transition here; opacity is driven per-frame from phaseProgress so adding a transition |
| src/components/hero/ProcurementFlowHero.tsx | 320 | {/* Chart area — opacity is rAF-driven; no CSS transition. */} |
| src/components/hero/ProcurementFlowHero.tsx | 343 | // failure phase). One card per failure note, transitions are SEQUENTIAL: |
| src/components/hero/ProcurementFlowHero.tsx | 384 | /** Which package is currently on screen (or transitioning). */ |
| src/components/hero/ProcurementFlowHero.tsx | 436 | // Walk arrival transitions. Cards 0..failureLastIdx cycle through the |
| src/components/hero/ProcurementFlowHero.tsx | 456 | // After the final failure-note transition the last failure card persists |
| src/components/hero/ProcurementFlowHero.tsx | 793 | className="absolute top-1/2 -translate-y-1/2 rounded-[3px] border transition-colors duration-300 flex items-center px-2 overflow-hidden" |
| src/components/hero/ProcurementFlowHero.tsx | 828 | transition: 'background 400ms, border-color 400ms', |
| src/components/hero/_archive/JitproGanttAnimation.tsx | 176 | rafRef.current = requestAnimationFrame(step); |
| src/components/hero/_archive/JitproGanttAnimation.tsx | 182 | rafRef.current = requestAnimationFrame(step); |
| src/components/hero/_archive/JitproGanttAnimation.tsx | 216 | className="text-lg md:text-xl lg:text-2xl font-semibold text-amber-200/95 tracking-tight transition-opacity" |
| src/components/hero/_archive/JitproGanttAnimation.tsx | 217 | style={{ opacity: titleOpacity, transitionDuration: '400ms' }} |
| src/components/hero/_archive/JitproGanttAnimation.tsx | 227 | <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity: detailedOpacity }}> |
| src/components/hero/_archive/JitproGanttAnimation.tsx | 230 | <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity: compressedOpacity }}> |
| src/components/hero/_archive/JitproGanttAnimation.tsx | 368 | className="absolute transition-colors duration-300" |
| src/components/investor/AccessRequestForm.tsx | 124 | className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors" |
| src/components/investor/AccessRequestForm.tsx | 137 | className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors" |
| src/components/investor/AccessRequestForm.tsx | 150 | className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors" |
| src/components/investor/AccessRequestForm.tsx | 164 | className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors resize-none" |
| src/components/investor/AccessRequestForm.tsx | 191 | className="w-full py-3 bg-amber-500 text-slate-900 font-semibold rounded hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" |
| src/components/investor/InvestorFooter.tsx | 25 | <Link to="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors"> |
| src/components/investor/InvestorNav.tsx | 71 | className={`px-3 py-2 text-sm rounded transition-colors flex items-center gap-1 ${ |
| src/components/investor/InvestorNav.tsx | 80 | className={`transition-transform duration-200 ${briefOpen ? 'rotate-180' : ''}`} |
| src/components/investor/InvestorNav.tsx | 90 | className={`block px-4 py-2 text-sm transition-colors ${ |
| src/components/investor/InvestorNav.tsx | 106 | className={`px-3 py-2 text-sm rounded transition-colors ${ |
| src/components/investor/InvestorNav.tsx | 119 | className={`px-3 py-2 text-sm rounded transition-colors flex items-center gap-1 ${ |
| src/components/investor/InvestorNav.tsx | 128 | className={`transition-transform duration-200 ${dataRoomOpen ? 'rotate-180' : ''}`} |
| src/components/investor/InvestorNav.tsx | 138 | className={`block px-4 py-2 text-sm transition-colors ${ |
| src/components/investor/InvestorNav.tsx | 157 | className="ml-2 px-3 py-2 text-sm rounded border border-amber-500/40 text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center gap-1.5" |
| src/components/investor/InvestorNav.tsx | 186 | className={`block px-3 py-2 rounded text-sm transition-colors ${ |
| src/components/investor/InvestorNav.tsx | 199 | className={`block px-3 py-2 rounded text-sm transition-colors ${ |
| src/components/investor/InvestorNav.tsx | 217 | className={`block px-3 py-2 rounded text-sm transition-colors ${ |
| src/components/investor/InvestorNav.tsx | 234 | className="w-full px-3 py-2.5 text-sm rounded border border-amber-500/40 text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center justify-center gap-1.5" |
| src/components/investor/InvestorStatCard.tsx | 15 | const observer = new IntersectionObserver( |
| src/components/investor/InvestorStatCard.tsx | 26 | className={`bg-slate-800 border border-slate-700 rounded-lg p-6 transition-all duration-700 ${ |
| src/components/timeline/TimelineShow.tsx | 137 | className={`transition-opacity duration-[${SCHEDULE_FADE_MS}ms] ${ |
| src/components/timeline/TimelineShow.tsx | 140 | style={{ transitionDuration: `${SCHEDULE_FADE_MS}ms` }} |
| src/components/timeline/TimelineShow.tsx | 207 | className={`${c.text} font-semibold truncate text-[11px] transition-colors ${ |
| src/components/timeline/TimelineShow.tsx | 215 | className={`relative h-5 transition-colors duration-300 rounded-sm ${ |
| src/components/timeline/TimelineShow.tsx | 220 | className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${c.bg} border ${c.border} transition-all ${ |
| src/components/timeline/TimelineShow.tsx | 243 | className={`text-slate-300 truncate text-[11px] transition-colors ${ |
| src/components/timeline/TimelineShow.tsx | 252 | className={`relative h-5 transition-colors duration-300 rounded-sm ${ |
| src/components/timeline/TimelineShow.tsx | 257 | className={`absolute top-1/2 -translate-y-1/2 h-3 rounded-sm border transition-all duration-300 ${colorForBar( |
| src/components/timeline/TimelineShow.tsx | 280 | className={`max-w-3xl mx-auto text-center transition-opacity ease-out`} |
| src/components/timeline/TimelineShow.tsx | 282 | transitionDuration: `${PHASE_TEXT_FADE_MS}ms`, |
| src/components/timeline/TimelineShow.tsx | 484 | className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-amber-400 transition-colors px-3 py-2 rounded-md hover:bg-slate-900/60" |
| src/components/timeline/TimelineShow.tsx | 494 | className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-slate-900/60" |
| src/components/timeline/TimelineShow.tsx | 580 | className="px-5 py-2.5 rounded-md border border-slate-700 hover:border-amber-500/60 text-slate-300 hover:text-amber-400 transition-colors text-sm" |
| src/components/timeline/TimelineShow.tsx | 587 | className="px-5 py-2.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors text-sm" |
| src/components/timeline/TimelineShow.tsx | 627 | className="relative transition-opacity" |
| src/components/timeline/TimelineShow.tsx | 629 | transitionDuration: `${SCHEDULE_FADE_MS}ms`, |
| src/components/timeline/TimelineShow.tsx | 686 | )} animate-bubble-in mx-4`} |
| src/index.css | 6 | @keyframes bubble-in { |
| src/index.css | 17 | .animate-bubble-in { |
| src/index.css | 23 | @keyframes heroPulse1 { 0%,100% { opacity: 0.07; } 50% { opacity: 0.16; } } |
| src/index.css | 24 | @keyframes heroPulse2 { 0%,100% { opacity: 0.09; } 50% { opacity: 0.24; } } |
| src/index.css | 25 | @keyframes heroPulse3 { 0%,100% { opacity: 0.14; } 50% { opacity: 0.38; } } |
| src/index.css | 26 | @keyframes heroNodeSlow  { 0%,100% { opacity: 0.15; } 50% { opacity: 0.5; } } |
| src/index.css | 27 | @keyframes heroNodeMed   { 0%,100% { opacity: 0.2; }  50% { opacity: 0.65; } } |
| src/index.css | 28 | @keyframes heroNodeFast  { 0%,100% { opacity: 0.3; }  50% { opacity: 0.85; } } |
| src/index.css | 29 | @keyframes heroHouseBuild { 0%,8% { opacity: 0.06; } 70%,88% { opacity: 0.8; } 100% { opacity: 0.06; } } |
| src/index.css | 30 | @keyframes heroWindowPulse { 0%,100% { opacity: 0.18; } 50% { opacity: 0.38; } } |
| src/index.css | 31 | @keyframes heroAmbientGlow { 0%,100% { opacity: 0.03; } 50% { opacity: 0.08; } } |
| src/index.css | 32 | @keyframes heroFlowMove { from { stroke-dashoffset: 1400; } to { stroke-dashoffset: 0; } } |
| src/pages/Admin.tsx | 140 | className="w-full py-3 bg-amber-500 text-slate-900 font-semibold rounded hover:bg-amber-400 transition-colors disabled:opacity-50" |
| src/pages/Admin.tsx | 170 | className={`px-4 py-2 text-sm rounded transition-colors ${ |
| src/pages/BrokenBeforeJobStarts.tsx | 25 | className="text-sm text-slate-400 hover:text-amber-500 transition-colors" |
| src/pages/BrokenBeforeJobStarts.tsx | 173 | className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition-colors" |
| src/pages/BrokenBeforeJobStarts.tsx | 269 | className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-8 py-4 rounded-lg transition-colors text-lg" |
| src/pages/CompanyProjectHealth.tsx | 134 | className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-6 py-3 text-base font-semibold text-slate-950 transition-colors hover:bg-amber-400" |
| src/pages/Demo.tsx | 175 | className="w-full bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed" |
| src/pages/FAQ.tsx | 69 | rafId = requestAnimationFrame(step); |
| src/pages/FAQ.tsx | 74 | rafId = requestAnimationFrame(step); |
| src/pages/FAQ.tsx | 112 | const observer = new IntersectionObserver( |
| src/pages/FAQ.tsx | 169 | className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" |
| src/pages/FAQ.tsx | 188 | className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${ |
| src/pages/FAQ.tsx | 203 | className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" |
| src/pages/Home.legacy.tsx | 87 | className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors" |
| src/pages/Home.legacy.tsx | 98 | className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors" |
| src/pages/Home.legacy.tsx | 115 | className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors" |
| src/pages/Home.legacy.tsx | 128 | className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors" |
| src/pages/Home.legacy.tsx | 136 | className="inline-flex items-center gap-2 border border-slate-300 text-slate-900 px-8 py-4 text-lg font-medium hover:border-slate-900 transition-colors" |
| src/pages/Home.tsx | 258 | Projects arrive with unresolved selections, incomplete details, open approvals, missing information, and decisions still in motion. |
| src/pages/Home.tsx | 272 | <a href="#next-project-review" className="inline-flex items-center gap-2 text-slate-100 font-bold hover:text-amber-400 transition-colors"> |
| src/pages/Home.tsx | 367 | <div key={item.title} className="rounded-2xl border border-slate-700 p-6 bg-slate-800 hover:border-amber-500/50 transition-colors"> |
| src/pages/Home.tsx | 412 | <Link to="/founder-story" className="inline-flex items-center gap-2 text-amber-500 font-bold hover:text-amber-400 transition-colors"> |
| src/pages/Home.tsx | 504 | <button type="submit" className="w-full bg-amber-500 text-slate-950 px-8 py-4 rounded-lg text-lg font-bold hover:bg-amber-400 transition-colors"> |
| src/pages/HomepageConcept.tsx | 132 | className="inline-flex items-center justify-center gap-2 bg-amber-500 text-slate-950 px-7 py-4 text-base md:text-lg font-bold rounded-lg hover:bg-amber-400 transition-colors" |
| src/pages/HomepageConcept.tsx | 139 | className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-7 py-4 text-base md:text-lg font-semibold rounded-lg hover:border-white/45 transition-colors" |
| src/pages/HomepageConcept.tsx | 269 | Projects often arrive with unresolved selections, incomplete details, open approvals, missing information, and decisions still in motion. |
| src/pages/HomepageConcept.tsx | 283 | <a href="#next-project-review" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:text-amber-700 transition-colors"> |
| src/pages/HomepageConcept.tsx | 378 | <div key={item.title} className="rounded-2xl border border-slate-200 p-6 bg-white hover:border-amber-300 transition-colors"> |
| src/pages/HomepageConcept.tsx | 423 | <Link to="/founder-story" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:text-amber-700 transition-colors"> |
| src/pages/HomepageConcept.tsx | 515 | <button type="submit" className="w-full bg-slate-900 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-slate-800 transition-colors"> |
| src/pages/Product.tsx | 80 | className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors" |
| src/pages/Roles.tsx | 57 | className="block border border-slate-200 rounded-xl p-8 bg-white hover:border-slate-400 transition-colors group" |
| src/pages/Roles.tsx | 61 | <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors"> |
| src/pages/Roles.tsx | 68 | <ArrowRight className="text-slate-400 group-hover:text-amber-600 transition-colors flex-shrink-0 mt-1" size={24} /> |
| src/pages/Roles.tsx | 85 | className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors" |
| src/pages/ThankYou.tsx | 29 | className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors" |
| src/pages/ThankYou.tsx | 37 | className={`inline-flex items-center gap-2 px-8 py-4 text-lg font-medium transition-colors ${ |
| src/pages/ThankYou.tsx | 54 | className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-lg transition-colors" |
| src/pages/TheRealProcurementTimeline.tsx | 137 | className={`absolute top-1/2 -translate-y-1/2 h-4 rounded-sm border transition-colors cursor-help focus:outline-none focus:ring-2 focus:ring-white/40 ${colorForBar(color)}`} |
| src/pages/TheRealProcurementTimeline.tsx | 258 | className={`w-full text-left flex items-start gap-4 group rounded-lg border ${accentBorder} bg-slate-900/40 hover:bg-slate-900/70 px-6 py-5 transition-colors`} |
| src/pages/TheRealProcurementTimeline.tsx | 273 | className={`shrink-0 w-6 h-6 mt-1 ${accentText} transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} |
| src/pages/TheRealProcurementTimeline.tsx | 280 | className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-out ${ |
| src/pages/TheRealProcurementTimeline.tsx | 373 | className="text-sm text-slate-400 hover:text-amber-500 transition-colors" |
| src/pages/TheRealProcurementTimeline.tsx | 400 | className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-3.5 rounded-lg transition-colors text-base md:text-lg shadow-lg shadow-amber-500/10" |
| src/pages/contact/ArchitectContact.tsx | 264 | className="w-full bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed" |
| src/pages/contact/ContractorContact.tsx | 264 | className="w-full bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed" |
| src/pages/contact/OwnerContact.tsx | 247 | className="w-full bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed" |
| src/pages/investor/InvestorAppendix.tsx | 47 | className={`px-4 py-2 text-sm rounded transition-colors ${ |
| src/pages/investor/InvestorDeckPage.tsx | 16 | const observer = new IntersectionObserver( |
| src/pages/investor/InvestorDeckPage.tsx | 43 | transition: 'opacity 450ms ease-out, transform 450ms ease-out', |
| src/pages/investor/InvestorDeckPage.tsx | 44 | transitionDelay: visible ? `${delay}ms` : '0ms', |
| src/pages/investor/InvestorDeckPage.tsx | 65 | transition: 'transform 900ms ease-out', |
| src/pages/investor/InvestorDeckPage.tsx | 66 | transitionDelay: visible ? '80ms' : '0ms', |
| src/pages/investor/InvestorDeckPage.tsx | 85 | transition: 'opacity 300ms ease-out, transform 300ms ease-out', |
| src/pages/investor/InvestorDeckPage.tsx | 86 | transitionDelay: visible ? `${delay}ms` : '0ms', |
| src/pages/investor/InvestorDeckPage.tsx | 93 | transition: 'opacity 450ms ease-out, transform 450ms ease-out', |
| src/pages/investor/InvestorDeckPage.tsx | 94 | transitionDelay: visible ? `${delay}ms` : '0ms', |
| src/pages/investor/InvestorDeckPage.tsx | 252 | transition: 'color 500ms cubic-bezier(0.4,0,0.2,1), opacity 500ms cubic-bezier(0.4,0,0.2,1)', |
| src/pages/investor/InvestorDeckPage.tsx | 264 | transition: 'all 500ms cubic-bezier(0.4,0,0.2,1)', |
| src/pages/investor/InvestorDeckPage.tsx | 325 | transition: 'opacity 600ms ease-out, transform 600ms ease-out', |
| src/pages/investor/InvestorDeckPage.tsx | 336 | transition: 'opacity 600ms ease-out, transform 600ms ease-out', |
| src/pages/investor/InvestorDeckPage.tsx | 337 | transitionDelay: heroVisible ? '200ms' : '0ms', |
| src/pages/investor/InvestorHome.tsx | 65 | className="inline-block px-6 py-3 bg-amber-500 text-slate-900 font-semibold rounded hover:bg-amber-400 transition-colors" |
| src/pages/investor/InvestorHome.tsx | 71 | className="inline-block px-6 py-3 border border-slate-600 text-slate-300 font-semibold rounded hover:border-slate-400 hover:text-slate-100 transition-colors" |
| src/pages/investor/InvestorHome.tsx | 230 | className="px-6 py-3 bg-amber-500 text-slate-900 font-semibold rounded hover:bg-amber-400 transition-colors" |
| src/pages/investor/InvestorHome.tsx | 236 | className="px-6 py-3 border border-slate-600 text-slate-300 font-semibold rounded hover:border-slate-400 hover:text-slate-100 transition-colors" |
| src/pages/investor/InvestorHome.tsx | 242 | className="px-6 py-3 border border-slate-600 text-slate-300 font-semibold rounded hover:border-slate-400 hover:text-slate-100 transition-colors" |
| src/pages/roles/ArchitectsEngineers.tsx | 138 | className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 text-lg font-medium hover:bg-slate-100 transition-colors" |
| src/pages/roles/GeneralContractors.legacy.tsx | 19 | <div className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-shadow hover:shadow-md"> |
| src/pages/roles/GeneralContractors.legacy.tsx | 32 | className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`} |
| src/pages/roles/GeneralContractors.legacy.tsx | 36 | className={`grid transition-[grid-template-rows] duration-200 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`} |
| src/pages/roles/GeneralContractors.legacy.tsx | 278 | className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 text-lg font-medium hover:bg-slate-100 transition-colors" |
| src/pages/roles/GeneralContractors.tsx | 79 | className="inline-flex items-center justify-center gap-2 bg-amber-500 text-slate-950 px-7 py-4 text-base md:text-lg font-bold rounded-lg hover:bg-amber-400 transition-colors" |
| src/pages/roles/GeneralContractors.tsx | 86 | className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-7 py-4 text-base md:text-lg font-semibold rounded-lg hover:border-white/45 transition-colors" |
| src/pages/roles/GeneralContractors.tsx | 202 | <div key={item.title} className="rounded-2xl border border-slate-200 p-6 bg-white hover:border-amber-300 transition-colors"> |
| src/pages/roles/GeneralContractors.tsx | 234 | className="inline-flex items-center gap-2 bg-slate-900 text-white px-7 py-4 rounded-lg text-lg font-bold hover:bg-slate-800 transition-colors" |
| src/pages/roles/GeneralContractors.tsx | 257 | className="inline-flex items-center justify-center gap-2 bg-amber-500 text-slate-950 px-8 py-4 text-lg font-bold rounded-lg hover:bg-amber-400 transition-colors" |
| src/pages/roles/GeneralContractorsConcept.tsx | 83 | className="inline-flex items-center justify-center gap-2 bg-amber-500 text-slate-950 px-7 py-4 text-base md:text-lg font-bold rounded-lg hover:bg-amber-400 transition-colors" |
| src/pages/roles/GeneralContractorsConcept.tsx | 90 | className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-7 py-4 text-base md:text-lg font-semibold rounded-lg hover:border-white/45 transition-colors" |
| src/pages/roles/GeneralContractorsConcept.tsx | 206 | <div key={item.title} className="rounded-2xl border border-slate-200 p-6 bg-white hover:border-amber-300 transition-colors"> |
| src/pages/roles/GeneralContractorsConcept.tsx | 238 | className="inline-flex items-center gap-2 bg-slate-900 text-white px-7 py-4 rounded-lg text-lg font-bold hover:bg-slate-800 transition-colors" |
| src/pages/roles/GeneralContractorsConcept.tsx | 261 | className="inline-flex items-center justify-center gap-2 bg-amber-500 text-slate-950 px-8 py-4 text-lg font-bold rounded-lg hover:bg-amber-400 transition-colors" |
| src/pages/roles/OwnersDevelopers.tsx | 138 | className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 text-lg font-medium hover:bg-slate-100 transition-colors" |
| src/pages/roles/ProjectManagers.tsx | 138 | className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 text-lg font-medium hover:bg-slate-100 transition-colors" |
| src/pages/roles/Subcontractors.tsx | 138 | className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 text-lg font-medium hover:bg-slate-100 transition-colors" |
## 13. DESIGN TOKEN CANDIDATES

This section identifies repeated implementation patterns that appear suitable to evaluate as future tokens. It does not invent token names or recommend values.

### Repeated backgrounds/borders/text color utilities

| Observed pattern | Approx frequency | Primary file references |
| --- | --- | --- |
| text-slate-600 | 235 | src/pages/Why.tsx (76), src/components/Footer.tsx (13), src/pages/roles/ArchitectsEngineers.tsx (12), src/pages/roles/OwnersDevelopers.tsx (12) |
| text-slate-900 | 200 | src/pages/HomepageConcept.tsx (26), src/pages/roles/ArchitectsEngineers.tsx (14), src/pages/roles/OwnersDevelopers.tsx (14), src/pages/roles/ProjectManagers.tsx (14) |
| text-slate-300 | 108 | src/pages/BrokenBeforeJobStarts.tsx (18), src/pages/investor/WhyNow.tsx (9), src/pages/investor/HiddenCost.tsx (8), src/pages/investor/MarketOpportunity.tsx (8) |
| text-slate-400 | 91 | src/pages/investor/InvestorAppendix.tsx (15), src/pages/Home.tsx (13), src/components/investor/AccessRequestForm.tsx (6), src/pages/TheRealProcurementTimeline.tsx (5) |
| border-slate-200 | 80 | src/components/InteractiveProcurementSchedule.tsx (8), src/pages/roles/ArchitectsEngineers.tsx (8), src/pages/roles/OwnersDevelopers.tsx (8), src/pages/roles/ProjectManagers.tsx (8) |
| text-slate-100 | 79 | src/pages/Home.tsx (25), src/pages/BrokenBeforeJobStarts.tsx (15), src/pages/CompanyProjectHealth.tsx (7), src/pages/investor/InvestorDeckPage.tsx (7) |
| bg-slate-900 | 70 | src/pages/Home.tsx (13), src/pages/investor/HiddenCost.tsx (5), src/pages/investor/EconomicCase.tsx (4), src/pages/investor/InvestorProduct.tsx (4) |
| text-slate-500 | 67 | src/pages/Admin.tsx (12), src/pages/investor/InvestorAppendix.tsx (10), src/pages/investor/HiddenCost.tsx (5), src/pages/investor/EconomicCase.tsx (4) |
| bg-white | 55 | src/pages/HomepageConcept.tsx (9), src/pages/roles/GeneralContractors.tsx (6), src/pages/roles/GeneralContractorsConcept.tsx (6), src/pages/roles/ArchitectsEngineers.tsx (5) |
| text-amber-500 | 54 | src/pages/BrokenBeforeJobStarts.tsx (21), src/pages/Home.tsx (10), src/pages/investor/InvestorAppendix.tsx (4), src/pages/investor/WhyNow.tsx (4) |
| text-white | 51 | src/pages/HomepageConcept.tsx (8), src/pages/Home.tsx (6), src/pages/roles/GeneralContractors.tsx (6), src/pages/roles/GeneralContractorsConcept.tsx (6) |
| bg-slate-800 | 40 | src/pages/Home.tsx (7), src/pages/investor/WhyNow.tsx (5), src/components/investor/AccessRequestForm.tsx (4), src/pages/investor/InvestorProduct.tsx (4) |
| bg-slate-50 | 37 | src/pages/Why.tsx (5), src/components/ControlledProcurementSection.tsx (3), src/pages/HomepageConcept.tsx (3), src/pages/roles/GeneralContractors.legacy.tsx (3) |
| border-slate-700 | 36 | src/pages/Home.tsx (6), src/components/investor/AccessRequestForm.tsx (4), src/pages/investor/InvestorAppendix.tsx (4), src/pages/Admin.tsx (3) |
| bg-amber-500 | 33 | src/pages/roles/GeneralContractors.legacy.tsx (6), src/pages/investor/InvestorHome.tsx (3), src/pages/roles/GeneralContractorsConcept.tsx (3), src/pages/Admin.tsx (2) |
| text-amber-600 | 30 | src/pages/HomepageConcept.tsx (8), src/pages/roles/GeneralContractors.tsx (5), src/pages/roles/GeneralContractorsConcept.tsx (5), src/pages/Home.legacy.tsx (2) |
| text-slate-200 | 28 | src/pages/Home.tsx (5), src/pages/HomepageConcept.tsx (5), src/pages/CompanyProjectHealth.tsx (3), src/components/TypicalScheduleSection.tsx (2) |
| bg-slate-950 | 25 | src/pages/Home.tsx (5), src/pages/CompanyProjectHealth.tsx (4), src/pages/HomepageConcept.tsx (3), src/components/investor/AccessRequestForm.tsx (2) |
| text-amber-300 | 21 | src/pages/Home.tsx (8), src/pages/HomepageConcept.tsx (8), src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2) |
| text-slate-700 | 20 | src/pages/roles/GeneralContractors.legacy.tsx (5), src/pages/FounderStory.tsx (4), src/pages/HomepageConcept.tsx (3), src/pages/Home.legacy.tsx (2) |
| border-slate-800 | 18 | src/components/investor/InvestorNav.tsx (7), src/pages/BrokenBeforeJobStarts.tsx (3), src/pages/TheRealProcurementTimeline.tsx (3), src/components/investor/InvestorFooter.tsx (2) |
| hover:bg-amber-400 | 16 | src/pages/Admin.tsx (2), src/pages/BrokenBeforeJobStarts.tsx (2), src/pages/investor/InvestorHome.tsx (2), src/pages/roles/GeneralContractors.tsx (2) |
| border-slate-300 | 15 | src/pages/HomepageConcept.tsx (7), src/pages/Demo.tsx (5), src/components/TypicalScheduleSection.tsx (2), src/pages/Home.legacy.tsx (1) |
| text-slate-950 | 14 | src/pages/HomepageConcept.tsx (3), src/pages/roles/GeneralContractorsConcept.tsx (3), src/pages/BrokenBeforeJobStarts.tsx (2), src/pages/roles/GeneralContractors.tsx (2) |
| accent-slate-900 | 12 | src/pages/contact/ArchitectContact.tsx (4), src/pages/contact/ContractorContact.tsx (4), src/pages/contact/OwnerContact.tsx (4) |
| border-slate-600 | 12 | src/pages/Home.tsx (7), src/pages/investor/InvestorHome.tsx (3), src/components/Navigation.tsx (1), src/components/TypicalScheduleSection.tsx (1) |
| focus:border-amber-500 | 12 | src/pages/Home.tsx (7), src/components/investor/AccessRequestForm.tsx (4), src/pages/Admin.tsx (1) |
| focus:border-slate-900 | 12 | src/pages/HomepageConcept.tsx (7), src/pages/Demo.tsx (5) |
| hover:text-slate-900 | 12 | src/components/Footer.tsx (11), src/pages/ThankYou.tsx (1) |
| border-slate-800/60 | 11 | src/pages/BrokenBeforeJobStarts.tsx (9), src/components/timeline/TimelineShow.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| hover:bg-slate-800 | 11 | src/pages/Demo.tsx (1), src/pages/Home.legacy.tsx (1), src/pages/HomepageConcept.tsx (1), src/pages/Product.tsx (1) |
| text-red-400 | 10 | src/pages/Admin.tsx (3), src/pages/investor/HiddenCost.tsx (2), src/pages/investor/WhyNow.tsx (2), src/components/TypicalScheduleSection.tsx (1) |
| hover:bg-slate-100 | 9 | src/components/InteractiveProcurementSchedule.tsx (2), src/pages/FAQ.tsx (2), src/pages/roles/ArchitectsEngineers.tsx (1), src/pages/roles/GeneralContractors.legacy.tsx (1) |
| text-slate-800 | 9 | src/pages/Why.tsx (6), src/pages/roles/GeneralContractors.legacy.tsx (2), src/components/TypicalScheduleSection.tsx (1) |
| bg-slate-700 | 8 | src/pages/investor/HiddenCost.tsx (2), src/components/ControlledProcurementSection.tsx (1), src/components/Navigation.tsx (1), src/components/TypicalScheduleSection.tsx (1) |
| border-white/10 | 8 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2), src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2) |
| bg-[#030a19] | 7 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.legacy.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1), src/components/hero/_archive/JitproGanttAnimation.tsx (1) |
| bg-red-500/10 | 7 | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/pages/investor/HiddenCost.tsx (1), src/pages/roles/GeneralContractors.tsx (1) |
| text-red-300 | 7 | src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2), src/components/hero/ProcurementFlowHero.tsx (1), src/pages/Home.tsx (1) |
| hover:border-slate-400 | 6 | src/pages/investor/InvestorHome.tsx (3), src/components/InteractiveProcurementSchedule.tsx (2), src/pages/Roles.tsx (1) |

### Repeated typography utilities

| Observed pattern | Approx frequency | Primary file references |
| --- | --- | --- |
| leading-relaxed | 363 | src/pages/Why.tsx (80), src/pages/Home.tsx (21), src/pages/HomepageConcept.tsx (21), src/pages/CompanyProjectHealth.tsx (14) |
| font-bold | 290 | src/pages/HomepageConcept.tsx (34), src/pages/Home.tsx (33), src/pages/roles/GeneralContractors.tsx (15), src/pages/roles/GeneralContractorsConcept.tsx (15) |
| text-lg | 263 | src/pages/Why.tsx (78), src/pages/roles/GeneralContractors.legacy.tsx (17), src/pages/CompanyProjectHealth.tsx (12), src/pages/Home.tsx (12) |
| text-slate-600 | 235 | src/pages/Why.tsx (76), src/components/Footer.tsx (13), src/pages/roles/ArchitectsEngineers.tsx (12), src/pages/roles/OwnersDevelopers.tsx (12) |
| text-slate-900 | 200 | src/pages/HomepageConcept.tsx (26), src/pages/roles/ArchitectsEngineers.tsx (14), src/pages/roles/OwnersDevelopers.tsx (14), src/pages/roles/ProjectManagers.tsx (14) |
| font-semibold | 171 | src/pages/HomepageConcept.tsx (18), src/pages/BrokenBeforeJobStarts.tsx (16), src/pages/Home.tsx (16), src/pages/Why.tsx (13) |
| text-sm | 153 | src/pages/HomepageConcept.tsx (22), src/pages/Home.tsx (21), src/pages/investor/WhyNow.tsx (9), src/pages/investor/HiddenCost.tsx (8) |
| text-slate-300 | 108 | src/pages/BrokenBeforeJobStarts.tsx (18), src/pages/investor/WhyNow.tsx (9), src/pages/investor/HiddenCost.tsx (8), src/pages/investor/MarketOpportunity.tsx (8) |
| text-xl | 103 | src/pages/roles/ArchitectsEngineers.tsx (9), src/pages/roles/OwnersDevelopers.tsx (9), src/pages/roles/ProjectManagers.tsx (9), src/pages/roles/Subcontractors.tsx (9) |
| text-slate-400 | 91 | src/pages/investor/InvestorAppendix.tsx (15), src/pages/Home.tsx (13), src/components/investor/AccessRequestForm.tsx (6), src/pages/TheRealProcurementTimeline.tsx (5) |
| uppercase | 91 | src/pages/Home.tsx (12), src/pages/HomepageConcept.tsx (12), src/pages/investor/InvestorDeckPage.tsx (6), src/pages/roles/GeneralContractors.tsx (6) |
| text-slate-100 | 79 | src/pages/Home.tsx (25), src/pages/BrokenBeforeJobStarts.tsx (15), src/pages/CompanyProjectHealth.tsx (7), src/pages/investor/InvestorDeckPage.tsx (7) |
| text-2xl | 77 | src/pages/BrokenBeforeJobStarts.tsx (8), src/pages/Why.tsx (8), src/pages/Home.tsx (7), src/pages/HomepageConcept.tsx (7) |
| text-3xl | 77 | src/pages/Home.tsx (7), src/pages/HomepageConcept.tsx (7), src/pages/roles/GeneralContractors.legacy.tsx (7), src/pages/roles/GeneralContractors.tsx (7) |
| font-medium | 72 | src/pages/investor/InvestorAppendix.tsx (12), src/components/hero/ProcurementFlowHero.tsx (7), src/pages/Admin.tsx (7), src/pages/Home.legacy.tsx (7) |
| text-xs | 71 | src/pages/investor/InvestorAppendix.tsx (11), src/pages/BrokenBeforeJobStarts.tsx (9), src/pages/Admin.tsx (5), src/pages/TheRealProcurementTimeline.tsx (5) |
| text-slate-500 | 67 | src/pages/Admin.tsx (12), src/pages/investor/InvestorAppendix.tsx (10), src/pages/investor/HiddenCost.tsx (5), src/pages/investor/EconomicCase.tsx (4) |
| text-center | 66 | src/pages/HomepageConcept.tsx (6), src/pages/Home.tsx (5), src/components/hero/MobileHeroSequence.tsx (4), src/pages/investor/HiddenCost.tsx (4) |
| tracking-tight | 57 | src/pages/Home.tsx (11), src/pages/HomepageConcept.tsx (11), src/pages/roles/GeneralContractors.tsx (8), src/pages/roles/GeneralContractorsConcept.tsx (8) |
| text-amber-500 | 54 | src/pages/BrokenBeforeJobStarts.tsx (21), src/pages/Home.tsx (10), src/pages/investor/InvestorAppendix.tsx (4), src/pages/investor/WhyNow.tsx (4) |
| text-white | 51 | src/pages/HomepageConcept.tsx (8), src/pages/Home.tsx (6), src/pages/roles/GeneralContractors.tsx (6), src/pages/roles/GeneralContractorsConcept.tsx (6) |
| leading-tight | 50 | src/pages/Home.tsx (7), src/pages/HomepageConcept.tsx (7), src/pages/roles/GeneralContractors.tsx (7), src/pages/roles/GeneralContractorsConcept.tsx (7) |
| tracking-[0.2em] | 46 | src/pages/Home.tsx (9), src/pages/HomepageConcept.tsx (9), src/pages/roles/GeneralContractors.tsx (5), src/pages/roles/GeneralContractorsConcept.tsx (5) |
| text-base | 35 | src/pages/BrokenBeforeJobStarts.tsx (13), src/pages/TheRealProcurementTimeline.tsx (5), src/pages/investor/InvestorDeckPage.tsx (3), src/components/timeline/TimelineShow.tsx (2) |
| text-4xl | 33 | src/pages/investor/HiddenCost.tsx (3), src/pages/Demo.tsx (2), src/components/hero/MobileHeroSequence.tsx (1), src/pages/About.tsx (1) |
| text-amber-600 | 30 | src/pages/HomepageConcept.tsx (8), src/pages/roles/GeneralContractors.tsx (5), src/pages/roles/GeneralContractorsConcept.tsx (5), src/pages/Home.legacy.tsx (2) |
| text-slate-200 | 28 | src/pages/Home.tsx (5), src/pages/HomepageConcept.tsx (5), src/pages/CompanyProjectHealth.tsx (3), src/components/TypicalScheduleSection.tsx (2) |
| whitespace-nowrap | 24 | src/components/TypicalScheduleSection.tsx (5), src/components/hero/ProcurementFlowHero.tsx (5), src/components/ControlledProcurementSection.tsx (4), src/components/InteractiveProcurementSchedule.tsx (2) |
| tracking-wider | 23 | src/pages/investor/InvestorDeckPage.tsx (5), src/pages/investor/WhyNow.tsx (4), src/pages/investor/InvestorAppendix.tsx (3), src/components/investor/InvestorNav.tsx (2) |
| text-amber-300 | 21 | src/pages/Home.tsx (8), src/pages/HomepageConcept.tsx (8), src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2) |
| text-slate-700 | 20 | src/pages/roles/GeneralContractors.legacy.tsx (5), src/pages/FounderStory.tsx (4), src/pages/HomepageConcept.tsx (3), src/pages/Home.legacy.tsx (2) |
| leading-snug | 19 | src/pages/FounderStory.tsx (4), src/pages/Home.legacy.tsx (3), src/components/TypicalScheduleSection.tsx (2), src/pages/BrokenBeforeJobStarts.tsx (2) |
| text-[10px] | 15 | src/components/InteractiveProcurementSchedule.tsx (3), src/components/TypicalScheduleSection.tsx (3), src/components/ControlledProcurementSection.tsx (2), src/components/hero/_archive/JitproGanttAnimation.tsx (2) |
| text-[11px] | 15 | src/components/hero/ProcurementFlowHero.tsx (6), src/components/hero/MobileHeroSequence.tsx (3), src/components/ControlledProcurementSection.tsx (2), src/pages/TheRealProcurementTimeline.tsx (2) |
| text-slate-950 | 14 | src/pages/HomepageConcept.tsx (3), src/pages/roles/GeneralContractorsConcept.tsx (3), src/pages/BrokenBeforeJobStarts.tsx (2), src/pages/roles/GeneralContractors.tsx (2) |
| text-right | 11 | src/components/hero/ProcurementFlowHero.tsx (2), src/components/hero/_archive/JitproGanttAnimation.tsx (2), src/pages/investor/HiddenCost.tsx (2), src/components/ControlledProcurementSection.tsx (1) |
| text-red-400 | 10 | src/pages/Admin.tsx (3), src/pages/investor/HiddenCost.tsx (2), src/pages/investor/WhyNow.tsx (2), src/components/TypicalScheduleSection.tsx (1) |
| text-slate-800 | 9 | src/pages/Why.tsx (6), src/pages/roles/GeneralContractors.legacy.tsx (2), src/components/TypicalScheduleSection.tsx (1) |
| text-red-300 | 7 | src/pages/roles/GeneralContractors.tsx (2), src/pages/roles/GeneralContractorsConcept.tsx (2), src/components/hero/ProcurementFlowHero.tsx (1), src/pages/Home.tsx (1) |
| tracking-[0.18em] | 7 | src/components/hero/MobileHeroSequence.tsx (4), src/components/hero/ProcurementFlowHero.tsx (2), src/components/TypicalScheduleSection.tsx (1) |

### Repeated spacing/layout utilities

| Observed pattern | Approx frequency | Primary file references |
| --- | --- | --- |
| mx-auto | 227 | src/pages/Home.tsx (14), src/pages/HomepageConcept.tsx (14), src/pages/investor/HiddenCost.tsx (10), src/pages/investor/MarketOpportunity.tsx (10) |
| px-6 | 219 | src/pages/investor/InvestorHome.tsx (12), src/pages/investor/HiddenCost.tsx (11), src/pages/HomepageConcept.tsx (9), src/pages/investor/EconomicCase.tsx (9) |
| mb-4 | 135 | src/pages/Why.tsx (46), src/pages/Home.tsx (12), src/pages/HomepageConcept.tsx (12), src/pages/Documentation.tsx (8) |
| mb-6 | 130 | src/pages/Why.tsx (12), src/pages/roles/GeneralContractors.tsx (11), src/pages/roles/GeneralContractorsConcept.tsx (11), src/pages/Home.tsx (9) |
| max-w-3xl | 89 | src/pages/investor/MarketOpportunity.tsx (8), src/pages/investor/EconomicCase.tsx (7), src/pages/investor/HiddenCost.tsx (7), src/pages/investor/WhyNow.tsx (7) |
| py-20 | 85 | src/pages/Home.tsx (7), src/pages/HomepageConcept.tsx (7), src/pages/roles/GeneralContractors.tsx (6), src/pages/roles/GeneralContractorsConcept.tsx (6) |
| max-w-4xl | 78 | src/pages/Why.tsx (8), src/pages/roles/GeneralContractors.legacy.tsx (8), src/pages/CompanyProjectHealth.tsx (6), src/pages/roles/ArchitectsEngineers.tsx (6) |
| mb-8 | 73 | src/pages/roles/GeneralContractors.legacy.tsx (8), src/pages/Home.tsx (5), src/pages/HomepageConcept.tsx (5), src/pages/investor/HiddenCost.tsx (4) |
| py-3 | 72 | src/pages/Admin.tsx (16), src/pages/investor/InvestorAppendix.tsx (16), src/pages/Home.tsx (8), src/pages/HomepageConcept.tsx (8) |
| mb-3 | 69 | src/pages/Home.tsx (8), src/pages/HomepageConcept.tsx (8), src/pages/roles/ArchitectsEngineers.tsx (8), src/pages/roles/OwnersDevelopers.tsx (8) |
| py-16 | 69 | src/pages/Why.tsx (6), src/pages/roles/GeneralContractors.legacy.tsx (6), src/pages/investor/HiddenCost.tsx (5), src/pages/CompanyProjectHealth.tsx (4) |
| w-full | 63 | src/pages/Home.tsx (10), src/pages/HomepageConcept.tsx (10), src/components/investor/AccessRequestForm.tsx (6), src/pages/Demo.tsx (6) |
| px-4 | 62 | src/pages/Admin.tsx (15), src/pages/investor/InvestorAppendix.tsx (14), src/pages/Home.tsx (9), src/pages/HomepageConcept.tsx (9) |
| gap-2 | 57 | src/pages/investor/InvestorAppendix.tsx (12), src/pages/HomepageConcept.tsx (6), src/components/timeline/TimelineShow.tsx (5), src/pages/Home.legacy.tsx (5) |
| gap-3 | 55 | src/pages/BrokenBeforeJobStarts.tsx (15), src/pages/Home.tsx (6), src/pages/HomepageConcept.tsx (6), src/pages/roles/GeneralContractors.legacy.tsx (6) |
| max-w-6xl | 39 | src/pages/Home.tsx (6), src/pages/HomepageConcept.tsx (6), src/pages/roles/GeneralContractors.tsx (5), src/pages/roles/GeneralContractorsConcept.tsx (5) |
| mb-2 | 34 | src/pages/Home.tsx (8), src/pages/HomepageConcept.tsx (8), src/pages/Demo.tsx (5), src/pages/Why.tsx (4) |
| mb-5 | 33 | src/pages/Home.tsx (9), src/pages/HomepageConcept.tsx (9), src/pages/BrokenBeforeJobStarts.tsx (8), src/components/hero/MobileHeroSequence.tsx (2) |
| py-4 | 32 | src/pages/roles/GeneralContractors.tsx (4), src/pages/roles/GeneralContractorsConcept.tsx (4), src/pages/HomepageConcept.tsx (3), src/pages/Home.legacy.tsx (2) |
| mb-1 | 30 | src/pages/Why.tsx (20), src/components/investor/AccessRequestForm.tsx (4), src/pages/investor/InvestorDeckPage.tsx (3), src/pages/investor/InvestorProduct.tsx (1) |
| p-8 | 30 | src/pages/roles/ArchitectsEngineers.tsx (4), src/pages/roles/OwnersDevelopers.tsx (4), src/pages/roles/ProjectManagers.tsx (4), src/pages/roles/Subcontractors.tsx (4) |
| p-6 | 29 | src/pages/Home.tsx (7), src/pages/HomepageConcept.tsx (7), src/pages/roles/GeneralContractors.tsx (4), src/pages/roles/GeneralContractorsConcept.tsx (4) |
| inset-0 | 28 | src/components/hero/MobileHeroSequence.tsx (5), src/components/TypicalScheduleSection.tsx (4), src/components/hero/ProcurementFlowHero.tsx (4), src/components/hero/ProcurementFlowHero.legacy.tsx (3) |
| h-full | 27 | src/components/InteractiveProcurementSchedule.tsx (12), src/components/hero/_archive/JitproGanttAnimation.tsx (3), src/components/hero/ProcurementFlowHero.tsx (2), src/pages/investor/WhyNow.tsx (2) |
| space-y-4 | 26 | src/pages/BrokenBeforeJobStarts.tsx (8), src/pages/investor/InvestorHome.tsx (3), src/pages/FounderStory.tsx (2), src/pages/roles/GeneralContractors.tsx (2) |
| px-8 | 25 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2), src/components/hero/_archive/JitproGanttAnimation.tsx (2), src/pages/Home.legacy.tsx (2) |
| mb-12 | 24 | src/pages/Home.tsx (4), src/pages/HomepageConcept.tsx (4), src/pages/investor/MarketOpportunity.tsx (2), src/pages/roles/GeneralContractors.tsx (2) |
| gap-4 | 23 | src/pages/roles/GeneralContractors.legacy.tsx (5), src/pages/investor/InvestorProduct.tsx (3), src/pages/investor/HiddenCost.tsx (2), src/pages/investor/InvestorHome.tsx (2) |
| gap-6 | 22 | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/pages/investor/HiddenCost.tsx (2), src/pages/investor/InvestorHome.tsx (2) |
| mb-10 | 22 | src/components/investor/AccessRequestForm.tsx (2), src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/pages/roles/GeneralContractors.tsx (2) |
| pb-4 | 22 | src/pages/roles/GeneralContractors.legacy.tsx (6), src/pages/roles/ArchitectsEngineers.tsx (4), src/pages/roles/OwnersDevelopers.tsx (4), src/pages/roles/ProjectManagers.tsx (4) |
| top-0 | 22 | src/components/InteractiveProcurementSchedule.tsx (11), src/components/timeline/TimelineShow.tsx (2), src/pages/FAQ.tsx (2), src/pages/TheRealProcurementTimeline.tsx (2) |
| right-0 | 21 | src/components/hero/ProcurementFlowHero.tsx (3), src/components/hero/_archive/JitproGanttAnimation.tsx (3), src/components/InteractiveProcurementSchedule.tsx (2), src/components/hero/MobileHeroSequence.tsx (2) |
| space-y-6 | 20 | src/pages/contact/ArchitectContact.tsx (3), src/pages/contact/ContractorContact.tsx (3), src/pages/contact/OwnerContact.tsx (3), src/pages/roles/GeneralContractors.legacy.tsx (3) |
| left-0 | 17 | src/components/hero/MobileHeroSequence.tsx (4), src/components/hero/ProcurementFlowHero.tsx (3), src/components/hero/_archive/JitproGanttAnimation.tsx (3), src/components/TypicalScheduleSection.tsx (2) |
| space-y-2 | 17 | src/pages/Why.tsx (6), src/components/Footer.tsx (3), src/pages/BrokenBeforeJobStarts.tsx (3), src/pages/investor/InvestorAppendix.tsx (3) |
| space-y-3 | 17 | src/pages/investor/WhyNow.tsx (4), src/pages/roles/GeneralContractors.legacy.tsx (3), src/pages/FounderStory.tsx (2), src/pages/Home.tsx (2) |
| py-24 | 16 | src/pages/Home.legacy.tsx (2), src/components/ControlledProcurementSection.tsx (1), src/components/TypicalScheduleSection.tsx (1), src/components/hero/ProcurementFlowHero.legacy.tsx (1) |
| h-2 | 15 | src/pages/roles/GeneralContractors.legacy.tsx (5), src/components/ControlledProcurementSection.tsx (1), src/components/TypicalScheduleSection.tsx (1), src/components/hero/ProcurementFlowHero.tsx (1) |
| py-2 | 15 | src/components/InteractiveProcurementSchedule.tsx (2), src/components/timeline/TimelineShow.tsx (2), src/pages/HomepageConcept.tsx (2), src/components/Navigation.tsx (1) |

### Repeated radius utilities

| Observed pattern | Approx frequency | Primary file references |
| --- | --- | --- |
| rounded-lg | 63 | src/pages/HomepageConcept.tsx (11), src/pages/Home.tsx (9), src/pages/investor/WhyNow.tsx (5), src/pages/investor/HiddenCost.tsx (4) |
| rounded-full | 50 | src/pages/roles/GeneralContractors.legacy.tsx (6), src/components/hero/ProcurementFlowHero.tsx (5), src/components/hero/MobileHeroSequence.tsx (4), src/pages/investor/WhyNow.tsx (4) |
| rounded-2xl | 34 | src/pages/Home.tsx (13), src/pages/HomepageConcept.tsx (13), src/components/timeline/TimelineShow.tsx (2), src/pages/BrokenBeforeJobStarts.tsx (2) |
| rounded | 26 | src/components/investor/AccessRequestForm.tsx (5), src/pages/investor/InvestorHome.tsx (5), src/components/investor/InvestorNav.tsx (4), src/pages/Admin.tsx (4) |
| rounded-xl | 25 | src/pages/roles/ArchitectsEngineers.tsx (4), src/pages/roles/OwnersDevelopers.tsx (4), src/pages/roles/ProjectManagers.tsx (4), src/pages/roles/Subcontractors.tsx (4) |
| rounded-md | 11 | src/components/timeline/TimelineShow.tsx (4), src/components/InteractiveProcurementSchedule.tsx (2), src/components/TypicalScheduleSection.tsx (1), src/components/hero/MobileHeroSequence.tsx (1) |
| rounded-3xl | 10 | src/pages/roles/GeneralContractors.tsx (4), src/pages/roles/GeneralContractorsConcept.tsx (4), src/pages/Home.tsx (1), src/pages/HomepageConcept.tsx (1) |
| rounded-sm | 4 | src/components/ControlledProcurementSection.tsx (2), src/components/InteractiveProcurementSchedule.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |

### Repeated shadow utilities

| Observed pattern | Approx frequency | Primary file references |
| --- | --- | --- |
| shadow-sm | 12 | src/pages/Home.tsx (3), src/pages/HomepageConcept.tsx (3), src/components/ControlledProcurementSection.tsx (1), src/components/InteractiveProcurementSchedule.tsx (1) |
| shadow-lg | 10 | src/components/investor/InvestorNav.tsx (2), src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/components/InteractiveProcurementSchedule.tsx (1) |
| shadow-2xl | 5 | src/pages/Home.tsx (2), src/pages/HomepageConcept.tsx (2), src/components/TypicalScheduleSection.tsx (1) |

### Repeated motion utilities

| Observed pattern | Approx frequency | Primary file references |
| --- | --- | --- |
| transition-colors | 93 | src/components/Footer.tsx (13), src/pages/HomepageConcept.tsx (6), src/components/investor/AccessRequestForm.tsx (5), src/pages/Home.legacy.tsx (5) |
| hover:bg-amber-400 | 16 | src/pages/Admin.tsx (2), src/pages/BrokenBeforeJobStarts.tsx (2), src/pages/investor/InvestorHome.tsx (2), src/pages/roles/GeneralContractors.tsx (2) |
| hover:text-slate-900 | 12 | src/components/Footer.tsx (11), src/pages/ThankYou.tsx (1) |
| hover:bg-slate-800 | 11 | src/pages/Demo.tsx (1), src/pages/Home.legacy.tsx (1), src/pages/HomepageConcept.tsx (1), src/pages/Product.tsx (1) |
| hover:bg-slate-100 | 9 | src/components/InteractiveProcurementSchedule.tsx (2), src/pages/FAQ.tsx (2), src/pages/roles/ArchitectsEngineers.tsx (1), src/pages/roles/GeneralContractors.legacy.tsx (1) |
| transition-transform | 7 | src/components/Navigation.tsx (2), src/components/investor/InvestorNav.tsx (2), src/components/faq/FaqAccordionItem.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| hover:border-slate-400 | 6 | src/pages/investor/InvestorHome.tsx (3), src/components/InteractiveProcurementSchedule.tsx (2), src/pages/Roles.tsx (1) |
| duration-300 | 5 | src/components/hero/_archive/JitproGanttAnimation.tsx (3), src/components/hero/ProcurementFlowHero.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1) |
| transition-opacity | 5 | src/components/hero/_archive/JitproGanttAnimation.tsx (3), src/components/timeline/TimelineShow.tsx (2) |
| duration-200 | 4 | src/components/investor/InvestorNav.tsx (2), src/pages/roles/GeneralContractors.legacy.tsx (2) |
| hover:border-white/30 | 4 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| hover:text-amber-400 | 4 | src/components/timeline/TimelineShow.tsx (2), src/pages/Home.tsx (2) |
| hover:text-amber-700 | 4 | src/pages/Home.legacy.tsx (2), src/pages/HomepageConcept.tsx (2) |
| hover:text-white/85 | 4 | src/components/hero/MobileHeroSequence.tsx (2), src/components/hero/ProcurementFlowHero.tsx (2) |
| duration-500 | 3 | src/components/faq/FaqAccordionItem.tsx (2), src/components/TypicalScheduleSection.tsx (1) |
| hover:border-amber-300 | 3 | src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| hover:border-white/45 | 3 | src/pages/HomepageConcept.tsx (1), src/pages/roles/GeneralContractors.tsx (1), src/pages/roles/GeneralContractorsConcept.tsx (1) |
| hover:text-amber-500 | 3 | src/pages/BrokenBeforeJobStarts.tsx (1), src/pages/TheRealProcurementTimeline.tsx (1), src/pages/investor/InvestorAppendix.tsx (1) |
| hover:text-slate-100 | 3 | src/pages/investor/InvestorHome.tsx (3) |

## 14. FILE REFERENCES

Primary implementation files scanned and referenced in this audit:

| File | Approx visual-theme hit count |
| --- | --- |
| public/assets/logo/JiTpro_Amber.svg | 27 |
| public/assets/logo/JiTpro_Amber_white_text.svg | 45 |
| public/jitpro-logo_(1).svg | 3 |
| src/components/ControlledProcurementSection.tsx | 73 |
| src/components/Footer.tsx | 88 |
| src/components/InteractiveProcurementSchedule.tsx | 117 |
| src/components/JiTproWordmark.tsx | 9 |
| src/components/MainLayout.tsx | 3 |
| src/components/Navigation.tsx | 50 |
| src/components/Turnstile.tsx | 1 |
| src/components/TypicalScheduleSection.tsx | 168 |
| src/components/faq/FaqAccordionItem.tsx | 22 |
| src/components/hero/ArchitecturalOutcome.tsx | 54 |
| src/components/hero/MobileHeroSequence.tsx | 151 |
| src/components/hero/ProcurementFlowHero.legacy.tsx | 110 |
| src/components/hero/ProcurementFlowHero.tsx | 191 |
| src/components/hero/_archive/JitproGanttAnimation.tsx | 98 |
| src/components/investor/AccessRequestForm.tsx | 84 |
| src/components/investor/InvestorFooter.tsx | 32 |
| src/components/investor/InvestorLayout.tsx | 9 |
| src/components/investor/InvestorNav.tsx | 127 |
| src/components/investor/InvestorSectionHeader.tsx | 9 |
| src/components/investor/InvestorStatCard.tsx | 18 |
| src/components/timeline/TimelineShow.tsx | 173 |
| src/content/procurementScheduleSnapshot.json | 792 |
| src/index.css | 2 |
| src/pages/About.tsx | 50 |
| src/pages/Admin.tsx | 108 |
| src/pages/AdminApproved.tsx | 19 |
| src/pages/BrokenBeforeJobStarts.tsx | 291 |
| src/pages/CompanyProjectHealth.tsx | 110 |
| src/pages/Demo.tsx | 85 |
| src/pages/Documentation.tsx | 59 |
| src/pages/FAQ.tsx | 66 |
| src/pages/FounderStory.tsx | 84 |
| src/pages/Home.legacy.tsx | 82 |
| src/pages/Home.tsx | 480 |
| src/pages/HomepageConcept.tsx | 482 |
| src/pages/HowItWorks.tsx | 36 |
| src/pages/ProcurementSchedule.tsx | 10 |
| src/pages/Product.tsx | 60 |
| src/pages/Roles.tsx | 46 |
| src/pages/ThankYou.tsx | 33 |
| src/pages/TheRealProcurementTimeline.tsx | 158 |
| src/pages/Why.tsx | 317 |
| src/pages/contact/ArchitectContact.tsx | 91 |
| src/pages/contact/ContractorContact.tsx | 91 |
| src/pages/contact/OwnerContact.tsx | 90 |
| src/pages/investor/EconomicCase.tsx | 96 |
| src/pages/investor/HiddenCost.tsx | 146 |
| src/pages/investor/InvestorAppendix.tsx | 186 |
| src/pages/investor/InvestorDeckPage.tsx | 117 |
| src/pages/investor/InvestorHome.tsx | 124 |
| src/pages/investor/InvestorProduct.tsx | 109 |
| src/pages/investor/MarketOpportunity.tsx | 91 |
| src/pages/investor/WhyNow.tsx | 133 |
| src/pages/roles/ArchitectsEngineers.tsx | 136 |
| src/pages/roles/GeneralContractors.legacy.tsx | 183 |
| src/pages/roles/GeneralContractors.tsx | 219 |
| src/pages/roles/GeneralContractorsConcept.tsx | 224 |
| src/pages/roles/OwnersDevelopers.tsx | 136 |
| src/pages/roles/ProjectManagers.tsx | 136 |
| src/pages/roles/Subcontractors.tsx | 136 |
