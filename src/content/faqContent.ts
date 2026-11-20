/**
 * The ten founder-approved questions and answers of the FAQ page (/faq,
 * Design System §65), transcribed verbatim from the approved reference
 * `docs/design/assets/faq-preview/JiTpro_FAQ_Interactive_Mockup.html`, with one
 * founder-approved correction (2026-11-17): the callout in answers 03 and 09
 * reads "In construction, upfront investment in planning and quality control
 * is consistently far less expensive than the cost of rework and delays."
 * Do not edit the wording here without founder approval.
 *
 * The original FAQ, preserved at /faq-legacy, keeps its own content in
 * faqData.ts.
 */

/** A run of text, plain or bold (the reference's <strong>). */
export type Segment = string | { strong: string };

export type AnswerBlock =
  | { kind: 'p'; segments: Segment[] }
  | { kind: 'callout'; text: string }
  | { kind: 'link'; text: string; to: string };

export interface Faq {
  number: string;
  question: string;
  answer: AnswerBlock[];
}

const p = (...segments: Segment[]): AnswerBlock => ({ kind: 'p', segments });
const callout = (text: string): AnswerBlock => ({ kind: 'callout', text });
const strong = (text: string): Segment => ({ strong: text });

export const FAQS: Faq[] = [
  {
    number: '01',
    question: 'What exactly does JiTpro do?',
    answer: [
      p('JiTpro helps general contractors take control of their projects before problems reach the field.'),
      p(
        'We start by identifying the products, materials, and services your project needs. Then we establish the information, decisions, approvals, and other requirements needed to get everything ready for construction.',
      ),
      p(
        "We organize and sequence that work around when each item is needed on site, so everyone knows what needs to happen, who's responsible, and when it needs to be done.",
      ),
      p(strong('The result is early clarity, better planning, and fewer preventable disruptions.')),
      callout('Our goal is simple: Get the field what it needs, when it needs it.'),
    ],
  },
  {
    number: '02',
    question: "How is JiTpro different from what we're already doing?",
    answer: [
      p('Most general contractors already have experienced teams, established processes, and software to manage their projects.'),
      p("But managing project information isn't the same as making sure everything the field needs will be ready when it's needed."),
      p(
        'JiTpro goes deeper. We identify the products, materials, services, and supporting requirements your project needs, then connect the decisions, approvals, and commitments that must happen before each item can be delivered.',
      ),
      p('We establish the proper sequence and timing of that work early, giving your team a clear plan instead of another list of things to chase.'),
      callout("We don't replace your people or systems. We help them work more effectively by bringing clarity and control to the work ahead."),
    ],
  },
  {
    number: '03',
    question: 'How does JiTpro help protect our schedule and profits?',
    answer: [
      p(
        'Construction delays are expensive. Missing information, late decisions, delayed materials, and uncoordinated work lead to idle crews, overtime, rework, and costly schedule recovery.',
      ),
      p('These costs accumulate throughout a project, quietly consuming the profits contractors worked so hard to earn.'),
      p(
        'JiTpro helps prevent these disruptions by identifying what your project needs, sequencing the work required to deliver it, and establishing clear responsibilities and deadlines before problems reach the field.',
      ),
      callout('In construction, upfront investment in planning and quality control is consistently far less expensive than the cost of rework and delays.'),
      p("By identifying requirements early, assigning responsibility, and controlling the sequence, JiTpro helps protect your schedule, your people, and the profits you've earned."),
    ],
  },
  {
    number: '04',
    question: 'When is the best time to bring JiTpro into a project?',
    answer: [
      p(strong("The earlier, the better. Ideally, as soon as you're awarded the contract.")),
      p(
        'The beginning of a project is when your team has the most to do and the greatest opportunity to get ahead. Unfortunately, critical planning often takes a back seat to more immediate demands.',
      ),
      p("That's where JiTpro comes in."),
      p(
        'We get to work early, digging into your project documents, identifying missing information, organizing procurement requirements, and establishing the decisions and commitments needed to keep construction moving.',
      ),
      callout("Your team can focus on getting the project started while we help make sure they're not inheriting tomorrow's problems."),
      p('The result is a stronger start, fewer preventable surprises, and a significant advantage over contractors who wait until problems reach the field.'),
    ],
  },
  {
    number: '05',
    question: 'What does working with JiTpro actually look like?',
    answer: [
      p(
        'We start by reviewing your project documents and construction schedule to identify the products, materials, services, and supporting requirements your project needs.',
      ),
      p(
        'We identify missing information, establish responsibilities, and develop a detailed procurement plan that sequences the work around when everything is needed on site.',
      ),
      p(strong("But our work doesn't stop with the initial plan.")),
      p(
        'We remain actively involved throughout the procurement process, helping your team stay ahead as owner decisions change, new information becomes available, and project requirements evolve.',
      ),
      callout(
        'The result is a clear plan established early, with ongoing attention to keeping it accurate, actionable, and aligned with your construction schedule.',
      ),
      p('Your team stays focused on building while JiTpro helps keep procurement on track.'),
    ],
  },
  {
    number: '06',
    question: 'Will JiTpro replace our project management team?',
    answer: [
      p(
        'Absolutely not. JiTpro works alongside your existing team, providing dedicated procurement expertise and support when it matters most: at the very beginning of your project.',
      ),
      p(
        'Your project managers and superintendents already have demanding responsibilities. Critical early planning often gets pushed aside as more immediate needs consume their time.',
      ),
      p(
        'JiTpro takes that work off their shoulders, getting started immediately to identify requirements, define missing information, and establish a properly sequenced procurement plan.',
      ),
      p('We remain involved throughout procurement, helping your team stay ahead as the project evolves.'),
      callout('We do the critical planning early, so your team can focus on building instead of constantly catching up.'),
    ],
  },
  {
    number: '07',
    question: 'What kinds of construction projects benefit most from JiTpro?',
    answer: [
      p(
        'JiTpro is especially valuable on projects with complex designs, numerous products and materials, multiple trade partners, and significant coordination requirements.',
      ),
      p(
        'Custom homes, major renovations, commercial buildings, and other projects requiring extensive owner decisions, design coordination, and specialized materials are excellent candidates.',
      ),
      p('The more complex the project, the more opportunities there are for missing information, delayed decisions, and procurement problems to disrupt construction.'),
      callout('If your project depends on hundreds of decisions and commitments coming together at the right time, JiTpro can help you bring order to that complexity.'),
    ],
  },
  {
    number: '08',
    question: "What happens if we don't have a dedicated procurement planning process?",
    answer: [
      p(strong("That's exactly the problem JiTpro is here to solve.")),
      p(
        "Many general contractors don't have the dedicated staff, time, or established processes needed to manage detailed procurement planning. Their teams are already stretched thin, and critical planning often gets pushed aside by more immediate demands.",
      ),
      p('JiTpro brings the expertise, structure, and dedicated attention needed to get that work done early and keep it on track.'),
      p(
        'And the benefits go beyond a single project. As we work alongside your team, they gain greater visibility into the process, develop better planning practices, and begin building systems they can carry into future projects.',
      ),
      callout('We help you build better projects today and a stronger construction business for tomorrow.'),
    ],
  },
  {
    number: '09',
    question: 'How much does JiTpro cost, and is it worth the investment?',
    answer: [
      p("Every construction project is different, so JiTpro's services are tailored to the size, complexity, and procurement requirements of your project."),
      p("Here's something worth considering: ", strong("You're already paying for procurement management.")),
      p(
        'Your team is already responsible for buying out the project, coordinating decisions and approvals, and procuring every product, material, and service needed for construction.',
      ),
      p('The question is whether that work gets planned and organized early or handled reactively as problems arise.'),
      p(
        'Reactive management comes at a much higher cost. Delays, wasted labor, rework, expediting, and constant firefighting consume valuable resources and erode your profits.',
      ),
      callout('In construction, upfront investment in planning and quality control is consistently far less expensive than the cost of rework and delays.'),
      p(
        "JiTpro provides dedicated early planning and ongoing procurement support to help your team work more efficiently, protect your schedule, and retain more of the profits you've earned.",
      ),
      p("We'll discuss your project and provide a clear proposal based on its specific needs."),
    ],
  },
  {
    number: '10',
    question: 'How do we get started with JiTpro?',
    answer: [
      p('It starts with a simple conversation.'),
      p(
        "We'll talk about your upcoming project, where you are in the planning process, and the challenges your team typically faces with procurement and project readiness.",
      ),
      p("From there, we'll discuss how JiTpro can help, what an engagement would look like, and the best time to get started."),
      callout(
        'The goal is simple: Get involved early, establish a clear plan, and give your team the advantage of being prepared before construction begins.',
      ),
      { kind: 'link', text: "Let's talk about your project ↗", to: '/contact' },
    ],
  },
];

/** An answer as plain text, in reading order (for tests and checks). */
export const answerText = (faq: Faq) =>
  faq.answer
    .map((b) => (b.kind === 'p' ? b.segments.map((s) => (typeof s === 'string' ? s : s.strong)).join('') : b.text))
    .join('\n');
