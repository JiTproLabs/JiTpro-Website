import {
  buildItem,
  type CommitmentSpec,
  type RiskSpec,
  type ScheduleItem,
  type StepSpec,
} from './scheduleModel';

/**
 * The fifteen representative procurement items, ordered by Required On-Site
 * date. That ordering is the file's contract, so a new package is inserted at
 * its date rather than appended - the board is meant to read down the page in
 * the order the field actually needs the material.
 *
 * FIFTEEN RENDERED, 153 REPRESENTED. The pagination line reports 153 items on
 * the fictional project. Only these fifteen are authored: a representative
 * screen has to show a plausible slice of a large project without pretending
 * to carry all of it.
 *
 * EVERY PATH IS DIFFERENT, by instruction and on purpose. The Building Permit
 * runs an agency-review path with no buyout, fabrication, shipping or delivery
 * at all. Tile runs a short owner-selection-and-order path with no shop-drawing
 * cycle. Heritage Steel runs two full review/revision rounds plus a final
 * review and the longest fabrication in the set. Twelve rows that all looked
 * alike would misrepresent how procurement actually behaves. The three most
 * recent additions continue that: HVAC equipment ends in factory testing, the
 * elevator carries two parallel reviewers - a vertical-transportation
 * consultant for the equipment and the architect for the cab finishes - and
 * ornamental metal cannot detail at all until field dimensions are verified.
 *
 * Durations are working days, chosen to be believable for high-end residential
 * construction. Nothing is a pixel width: the Gantt derives every position from
 * the dates these specs produce, so changing a duration here moves the bar and
 * rewrites the inspection popover together.
 */

const P = (
  id: string,
  name: string,
  family: StepSpec['family'],
  days: number,
  org: StepSpec['org'],
  owner: StepSpec['owner'],
  owed: string,
  gap = 1,
): StepSpec => ({ id, name, family, kind: 'phase', days, org, owner, owed, gap });

const M = (
  id: string,
  name: string,
  family: StepSpec['family'],
  org: StepSpec['org'],
  owner: StepSpec['owner'],
  owed: string,
  gap = 1,
): StepSpec => ({ id, name, family, kind: 'milestone', org, owner, owed, gap });

/* 1 ------------------------------------------------------- Building Permit */
const permit: StepSpec[] = [
  P('pm-1', 'Design Coordination', 'coordination', 15, 'architect', 'JS',
    'Coordinate the permit set across disciplines and resolve open code and zoning questions.'),
  P('pm-2', 'Permit Preparation', 'preparation', 10, 'architect', 'JS',
    'Assemble the permit application, drawings, calculations and supporting documents.'),
  M('pm-3', 'Permit Submission', 'preparation', 'architect', 'JS',
    'Submit the complete permit package to the building department.'),
  P('pm-4', 'Agency Review 1', 'review', 30, 'authority', 'LM',
    'Complete first-cycle plan check and return consolidated correction comments.'),
  P('pm-5', 'Corrections', 'revision', 15, 'architect', 'JS',
    'Resolve every plan-check comment and revise the permit set accordingly.'),
  M('pm-6', 'Resubmittal', 'revision', 'architect', 'JS',
    'Return the corrected permit set with a written response to each comment.'),
  P('pm-7', 'Agency Review 2', 'review', 20, 'authority', 'LM',
    'Verify the corrections and clear the application for issuance.'),
  M('pm-8', 'Permit Issuance', 'approval', 'authority', 'LM',
    'Issue the building permit.'),
  M('pm-9', 'Required On-Site', 'required', 'gc', 'MO',
    'Permit in hand so the field can start work without an inspection hold.'),
];

/* 2 --------------------------------------- Concrete & Reinforcing Package */
const concrete: StepSpec[] = [
  P('cr-1', 'Buyout', 'buyout', 15, 'gc', 'AW',
    'Scope, negotiate and award the concrete and reinforcing subcontract.'),
  P('cr-2', 'Submittal Coordination', 'coordination', 8, 'concrete', 'RH',
    'Coordinate mix designs, reinforcing details, embeds and accessory requirements.'),
  P('cr-3', 'Submittal Preparation', 'preparation', 10, 'concrete', 'RH',
    'Prepare mix design submittals, reinforcing shop drawings and embed layouts.'),
  M('cr-4', 'Initial Submittal', 'preparation', 'concrete', 'RH',
    'Transmit the complete concrete and reinforcing submittal package.'),
  P('cr-5', 'Structural Review', 'review', 12, 'structural', 'MC',
    'Review mix designs and reinforcing drawings against the structural documents.'),
  P('cr-6', 'Revision', 'revision', 7, 'concrete', 'RH',
    'Incorporate review comments and correct the reinforcing drawings.'),
  M('cr-7', 'Resubmittal', 'revision', 'concrete', 'RH',
    'Return the corrected package for final review.'),
  M('cr-8', 'Approval', 'approval', 'structural', 'MC',
    'Approve the reinforcing and mix design submittals for fabrication.'),
  M('cr-9', 'Release / Order', 'approval', 'gc', 'DB',
    'Release the approved package and authorise material fabrication.'),
  P('cr-10', 'Reinforcing Fabrication / Material Preparation', 'production', 20, 'concrete', 'RH',
    'Cut, bend and bundle reinforcing and stage embeds and accessories for delivery.'),
  M('cr-11', 'Delivery', 'logistics', 'logistics', 'CB',
    'Deliver reinforcing, embeds and accessories to the site.'),
  M('cr-12', 'Required On-Site', 'required', 'gc', 'MO',
    'Reinforcing and embeds on site so foundation placement can proceed.'),
];

/* 3 ------------------------------------------------ Structural Steel Package */
const steel: StepSpec[] = [
  P('ss-1', 'Buyout', 'buyout', 20, 'gc', 'AW',
    'Scope, negotiate and award the structural steel subcontract.'),
  P('ss-2', 'Detailed Coordination', 'coordination', 15, 'steel', 'TW',
    'Coordinate connections, framing interfaces and embed locations with the structural documents.'),
  P('ss-3', 'Shop Drawing Preparation', 'preparation', 25, 'steel', 'TW',
    'Produce erection drawings, connection details and piece drawings for review.'),
  M('ss-4', 'Initial Submittal', 'preparation', 'steel', 'TW',
    'Transmit the complete structural steel shop drawing package.'),
  P('ss-5', 'Structural Review 1', 'review', 15, 'structural', 'MC',
    'Review connections and member sizes and return coordinated comments.'),
  P('ss-6', 'Revision 1', 'revision', 10, 'steel', 'TW',
    'Correct the detailing to resolve every first-cycle review comment.'),
  M('ss-7', 'Resubmittal 1', 'revision', 'steel', 'TW',
    'Return corrected shop drawings with a response to each comment.'),
  P('ss-8', 'Structural Review 2', 'review', 10, 'structural', 'MC',
    'Verify the corrections and confirm the package is ready for approval.'),
  M('ss-9', 'Approval', 'approval', 'structural', 'MC',
    'Approve the structural steel shop drawings.'),
  M('ss-10', 'Release for Fabrication', 'approval', 'gc', 'DB',
    'Release the approved drawings and authorise fabrication to begin.'),
  P('ss-11', 'Fabrication', 'production', 45, 'steel', 'TW',
    'Fabricate, weld and prime all structural steel members and connection assemblies.'),
  P('ss-12', 'Shipping', 'logistics', 8, 'logistics', 'CB',
    'Load and transport the fabricated steel in erection sequence.'),
  M('ss-13', 'Delivery', 'logistics', 'logistics', 'CB',
    'Deliver steel to the site in the sequence the erector needs it.'),
  M('ss-14', 'Required On-Site', 'required', 'gc', 'MO',
    'Steel on site so erection can begin on schedule.'),
];

/* 4 -------------------------------- Lumber & Engineered Framing Package */
const framing: StepSpec[] = [
  P('lf-1', 'Buyout', 'buyout', 12, 'gc', 'AW',
    'Scope, negotiate and award the framing material package.'),
  P('lf-2', 'Framing / Engineering Coordination', 'coordination', 12, 'lumber', 'ED',
    'Coordinate LVL, glulam and engineered beam sizing with the structural drawings.'),
  P('lf-3', 'Package Preparation', 'preparation', 10, 'lumber', 'ED',
    'Prepare the framing package: engineered member schedules, hangers, connectors and hardware.'),
  P('lf-4', 'Review', 'review', 10, 'structural', 'MC',
    'Review engineered member selections and connector schedules against the structural design.'),
  P('lf-5', 'Revision if required', 'revision', 5, 'lumber', 'ED',
    'Adjust member sizing and hardware selections to match the reviewed design.'),
  M('lf-6', 'Approval', 'approval', 'structural', 'MC',
    'Approve the engineered framing package for order.'),
  M('lf-7', 'Release / Order', 'approval', 'gc', 'DB',
    'Place the framing material order against the approved package.'),
  P('lf-8', 'Supplier Preparation', 'production', 25, 'lumber', 'ED',
    'Mill, cut and stage dimensional lumber, engineered members, hangers and framing hardware.'),
  M('lf-9', 'Delivery', 'logistics', 'logistics', 'CB',
    'Deliver the framing package to the site in framing sequence.'),
  M('lf-10', 'Required On-Site', 'required', 'gc', 'MO',
    'Framing material on site so the framing crew can start.'),
];

/* 5 -------------------- Heritage Steel Windows & Exterior Doors (longest) */
const heritage: StepSpec[] = [
  P('hw-1', 'Buyout', 'buyout', 20, 'gc', 'AW',
    'Scope, negotiate and award the custom steel window and exterior door package.'),
  P('hw-2', 'Detailed Design Coordination', 'coordination', 25, 'heritage', 'PN',
    'Coordinate opening sizes, sightlines, thermal performance and structural attachment with the architect.'),
  P('hw-3', 'Shop Drawing Preparation', 'preparation', 30, 'heritage', 'PN',
    'Produce elevation, section and jamb detail shop drawings for every opening.'),
  M('hw-4', 'Initial Submittal', 'preparation', 'heritage', 'PN',
    'Transmit the complete steel window and door shop drawing package.'),
  P('hw-5', 'Architect Review 1', 'review', 15, 'architect', 'JS',
    'Review sightlines, profiles and detailing against the design intent and return comments.'),
  P('hw-6', 'Revision 1', 'revision', 12, 'heritage', 'PN',
    'Revise the shop drawings to resolve first-cycle architectural comments.'),
  M('hw-7', 'Resubmittal 1', 'revision', 'heritage', 'PN',
    'Return the first revised package with a response to each comment.'),
  P('hw-8', 'Architect Review 2', 'review', 12, 'architect', 'JS',
    'Review the revised window shop drawings and either approve them or return coordinated comments.'),
  P('hw-9', 'Revision 2', 'revision', 10, 'heritage', 'PN',
    'Resolve the remaining second-cycle comments on jamb and head conditions.'),
  M('hw-10', 'Resubmittal 2', 'revision', 'heritage', 'PN',
    'Return the second revised package for final review.'),
  P('hw-11', 'Final Review', 'review', 8, 'architect', 'JS',
    'Confirm all comments are resolved and the package is ready for approval.'),
  M('hw-12', 'Approval', 'approval', 'architect', 'JS',
    'Approve the steel window and exterior door shop drawings.'),
  M('hw-13', 'Release for Fabrication', 'approval', 'gc', 'DB',
    'Release the approved package and authorise fabrication.'),
  P('hw-14', 'Fabrication', 'production', 70, 'heritage', 'PN',
    'Fabricate, glaze and finish every custom steel window and exterior door unit.'),
  P('hw-15', 'Shipping', 'logistics', 15, 'logistics', 'CB',
    'Crate and transport the finished units without damage to finished surfaces.'),
  M('hw-16', 'Delivery', 'logistics', 'logistics', 'CB',
    'Deliver the window and door units to the site.'),
  M('hw-17', 'Required On-Site', 'required', 'gc', 'MO',
    'Windows and exterior doors on site so the building can be closed in.'),
];

/* 6 ------------------ Electrical Switchgear & Distribution Equipment */
const switchgear: StepSpec[] = [
  P('sw-1', 'Buyout', 'buyout', 15, 'gc', 'AW',
    'Scope, negotiate and award the switchgear and distribution equipment package.'),
  P('sw-2', 'Electrical Coordination', 'coordination', 12, 'electrical', 'NR',
    'Coordinate service size, distribution layout and equipment clearances with the design.'),
  P('sw-3', 'Submittal Preparation', 'preparation', 15, 'switchgear', 'VS',
    'Prepare equipment submittals, one-line diagrams and dimensional drawings.'),
  M('sw-4', 'Initial Submittal', 'preparation', 'switchgear', 'VS',
    'Transmit the switchgear and distribution equipment submittal.'),
  P('sw-5', 'Electrical Engineer Review', 'review', 12, 'electrical', 'NR',
    'Review ratings, breaker schedules and clearances against the electrical design.'),
  P('sw-6', 'Revision', 'revision', 8, 'switchgear', 'VS',
    'Correct the equipment submittal to match the reviewed requirements.'),
  M('sw-7', 'Resubmittal', 'revision', 'switchgear', 'VS',
    'Return the corrected equipment submittal.'),
  M('sw-8', 'Approval', 'approval', 'electrical', 'NR',
    'Approve the switchgear and distribution equipment for manufacture.'),
  M('sw-9', 'Release / Order', 'approval', 'gc', 'DB',
    'Place the equipment order against the approved submittal.'),
  P('sw-10', 'Manufacturing', 'production', 60, 'switchgear', 'VS',
    'Manufacture and factory-test the switchgear and distribution equipment.'),
  P('sw-11', 'Shipping', 'logistics', 10, 'logistics', 'CB',
    'Transport the equipment with the rigging and access requirements confirmed.'),
  M('sw-12', 'Delivery', 'logistics', 'logistics', 'CB',
    'Deliver the equipment to the site.'),
  M('sw-13', 'Required On-Site', 'required', 'gc', 'MO',
    'Switchgear on site so electrical rough-in and service can proceed.'),
];

/* 7 ---------------------------------------------- Exterior Stone Package */
const stone: StepSpec[] = [
  P('st-1', 'Buyout', 'buyout', 12, 'gc', 'AW',
    'Scope, negotiate and award the exterior stone package.'),
  P('st-2', 'Material Selection Coordination', 'coordination', 15, 'architect', 'JS',
    'Confirm stone type, finish, coursing and blend with the design team and owner.'),
  P('st-3', 'Sample Coordination', 'coordination', 12, 'stone', 'MR',
    'Provide range samples and a control sample representing the approved blend.'),
  P('st-4', 'Shop Drawing / Layout Preparation', 'preparation', 18, 'stone', 'MR',
    'Produce elevation layouts, coursing drawings and anchor details.'),
  M('st-5', 'Initial Submittal', 'preparation', 'stone', 'MR',
    'Transmit the stone layout drawings and samples.'),
  P('st-6', 'Architect Review', 'review', 12, 'architect', 'JS',
    'Review coursing, joint layout and blend against the design intent.'),
  P('st-7', 'Revision', 'revision', 8, 'stone', 'MR',
    'Adjust the layout drawings to resolve review comments.'),
  M('st-8', 'Resubmittal if required', 'revision', 'stone', 'MR',
    'Return the corrected layout for confirmation.'),
  M('st-9', 'Approval', 'approval', 'architect', 'JS',
    'Approve the stone layout, blend and control sample.'),
  P('st-10', 'Material Procurement', 'production', 25, 'stone', 'MR',
    'Secure and reserve quarry block matching the approved control sample.'),
  P('st-11', 'Fabrication', 'production', 30, 'stone', 'MR',
    'Cut, finish and crate the stone to the approved coursing layout.'),
  P('st-12', 'Shipping', 'logistics', 12, 'logistics', 'CB',
    'Transport crated stone with breakage protection.'),
  M('st-13', 'Delivery', 'logistics', 'logistics', 'CB',
    'Deliver the stone to the site staged by elevation.'),
  M('st-14', 'Required On-Site', 'required', 'gc', 'MO',
    'Stone on site so exterior veneer installation can begin.'),
];

/* 8 ------------------------------------------------------- Tile Package */
const tile: StepSpec[] = [
  P('tl-1', 'Buyout', 'buyout', 8, 'gc', 'AW',
    'Scope, negotiate and award the tile package.'),
  P('tl-2', 'Owner Selection Coordination', 'coordination', 20, 'owner', 'EM',
    'Select tile materials, sizes and finishes for every wet area and finish location.'),
  M('tl-3', 'Sample Approval', 'approval', 'owner', 'EM',
    'Approve the tile samples that define the final selection.'),
  P('tl-4', 'Quantity / Layout Coordination', 'coordination', 10, 'tile', 'DE',
    'Confirm quantities, overage, trim pieces and layout for each area.'),
  M('tl-5', 'Order', 'approval', 'gc', 'DB',
    'Place the tile order against the approved selections and quantities.'),
  P('tl-6', 'Supplier Lead Time', 'production', 35, 'tile', 'DE',
    'Produce and allocate the ordered tile from the same production run.'),
  P('tl-7', 'Shipping', 'logistics', 8, 'logistics', 'CB',
    'Transport the tile order to the site.'),
  M('tl-8', 'Delivery', 'logistics', 'logistics', 'CB',
    'Deliver the tile to the site.'),
  M('tl-9', 'Required On-Site', 'required', 'gc', 'MO',
    'Tile on site so setting can begin behind the waterproofing inspection.'),
];

/* 9 ------------------------------------------ Custom Cabinetry & Casework */
const casework: StepSpec[] = [
  P('cw-1', 'Buyout', 'buyout', 15, 'gc', 'AW',
    'Scope, negotiate and award the custom cabinetry and casework package.'),
  P('cw-2', 'Design Coordination', 'coordination', 20, 'interiors', 'RM',
    'Coordinate cabinet layouts, appliance fits, hardware and finish intent.'),
  P('cw-3', 'Shop Drawing Preparation', 'preparation', 25, 'casework', 'NA',
    'Produce elevation and section shop drawings for every cabinet run.'),
  M('cw-4', 'Initial Submittal', 'preparation', 'casework', 'NA',
    'Transmit the casework shop drawing package.'),
  P('cw-5', 'Architect Review 1', 'review', 12, 'architect', 'JS',
    'Review cabinet elevations, reveals and hardware against the design intent.'),
  P('cw-6', 'Revision', 'revision', 10, 'casework', 'NA',
    'Revise the shop drawings to resolve review comments.'),
  M('cw-7', 'Resubmittal', 'revision', 'casework', 'NA',
    'Return the revised casework package.'),
  M('cw-8', 'Final Approval', 'approval', 'architect', 'JS',
    'Approve the casework shop drawings for fabrication.'),
  M('cw-9', 'Finish Sample Approval', 'approval', 'owner', 'EM',
    'Approve the final casework finish, colour and sheen on a control sample.'),
  M('cw-10', 'Release for Fabrication', 'approval', 'gc', 'DB',
    'Release the approved drawings and finish and authorise fabrication.'),
  P('cw-11', 'Fabrication', 'production', 50, 'casework', 'NA',
    'Fabricate and finish all custom cabinetry and casework.'),
  M('cw-12', 'Delivery', 'logistics', 'logistics', 'CB',
    'Deliver finished casework to the site under climate-controlled conditions.'),
  M('cw-13', 'Required On-Site', 'required', 'gc', 'MO',
    'Casework on site so installation can follow finished flooring.'),
];

/* 10 ------------------------------------------- Plumbing Fixture Package */
const plumbing: StepSpec[] = [
  P('pl-1', 'Buyout', 'buyout', 8, 'gc', 'AW',
    'Scope, negotiate and award the plumbing fixture package.'),
  P('pl-2', 'Owner Selection Coordination', 'coordination', 25, 'owner', 'EM',
    'Select fixtures, fittings and finishes for every plumbing location.'),
  P('pl-3', 'Fixture Schedule Coordination', 'coordination', 12, 'interiors', 'RM',
    'Assemble the fixture schedule and confirm rough-in requirements for each selection.'),
  M('pl-4', 'Initial Submittal', 'preparation', 'plumbing', 'GK',
    'Transmit the fixture submittal with cut sheets and rough-in dimensions.'),
  P('pl-5', 'Architect / Designer Review', 'review', 10, 'interiors', 'RM',
    'Review the fixture schedule against the selections and confirm finishes.'),
  M('pl-6', 'Approval', 'approval', 'architect', 'JS',
    'Approve the plumbing fixture schedule.'),
  M('pl-7', 'Order', 'approval', 'gc', 'DB',
    'Place the fixture order against the approved schedule.'),
  P('pl-8', 'Supplier Lead Time', 'production', 40, 'plumbing', 'GK',
    'Allocate and stage the ordered fixtures and fittings.'),
  P('pl-9', 'Shipping', 'logistics', 10, 'logistics', 'CB',
    'Transport the fixtures to the site.'),
  M('pl-10', 'Delivery', 'logistics', 'logistics', 'CB',
    'Deliver the fixtures to the site.'),
  M('pl-11', 'Required On-Site', 'required', 'gc', 'MO',
    'Fixtures on site so plumbing trim-out can proceed.'),
];

/* 11 -------------------------------------- Custom Interior Door Package */
const intdoors: StepSpec[] = [
  P('id-1', 'Buyout', 'buyout', 12, 'gc', 'AW',
    'Scope, negotiate and award the custom interior door package.'),
  P('id-2', 'Door / Hardware Coordination', 'coordination', 15, 'doors', 'RP',
    'Coordinate door sizes, cores, hardware sets and swing directions with the door schedule.'),
  P('id-3', 'Shop Drawing Preparation', 'preparation', 20, 'doors', 'RP',
    'Produce door elevations, frame profiles and hardware mounting details.'),
  M('id-4', 'Initial Submittal', 'preparation', 'doors', 'RP',
    'Transmit the interior door and hardware submittal.'),
  P('id-5', 'Architect Review', 'review', 12, 'architect', 'JS',
    'Review door profiles, panel proportions and hardware against the design intent.'),
  P('id-6', 'Revision', 'revision', 8, 'doors', 'RP',
    'Correct the door drawings and hardware sets to resolve comments.'),
  M('id-7', 'Resubmittal', 'revision', 'doors', 'RP',
    'Return the corrected door and hardware package.'),
  M('id-8', 'Approval', 'approval', 'architect', 'JS',
    'Approve the interior door and hardware submittal.'),
  M('id-9', 'Finish Approval', 'approval', 'owner', 'EM',
    'Approve the final door finish on a representative sample.'),
  M('id-10', 'Release for Fabrication', 'approval', 'gc', 'DB',
    'Release the approved package and authorise door fabrication.'),
  P('id-11', 'Fabrication', 'production', 45, 'doors', 'RP',
    'Fabricate, finish and pre-fit the custom interior doors and frames.'),
  M('id-12', 'Delivery', 'logistics', 'logistics', 'CB',
    'Deliver the doors to the site after the building is dried in.'),
  M('id-13', 'Required On-Site', 'required', 'gc', 'MO',
    'Doors on site so interior door installation can begin.'),
];

/* 12 ------------------------------------------ Decorative Lighting Package */
const lighting: StepSpec[] = [
  P('dl-1', 'Buyout', 'buyout', 10, 'gc', 'AW',
    'Scope, negotiate and award the decorative lighting package.'),
  P('dl-2', 'Owner / Designer Selection Coordination', 'coordination', 30, 'owner', 'EM',
    'Select decorative fixtures for every location with the lighting designer.'),
  P('dl-3', 'Fixture Schedule Coordination', 'coordination', 15, 'lighting', 'CF',
    'Assemble the decorative fixture schedule with mounting, lamping and control requirements.'),
  P('dl-4', 'Submittal Preparation', 'preparation', 12, 'lighting', 'CF',
    'Prepare the decorative fixture submittal with cut sheets and mounting details.'),
  M('dl-5', 'Initial Submittal', 'preparation', 'lighting', 'CF',
    'Transmit the decorative lighting submittal.'),
  P('dl-6', 'Designer / Electrical Review', 'review', 12, 'electrical', 'NR',
    'Review fixture loads, control compatibility and mounting against the electrical design.'),
  P('dl-7', 'Revision', 'revision', 8, 'lighting', 'CF',
    'Correct the fixture schedule and submittal to resolve review comments.'),
  M('dl-8', 'Resubmittal if required', 'revision', 'lighting', 'CF',
    'Return the corrected decorative lighting submittal.'),
  M('dl-9', 'Approval', 'approval', 'lighting', 'CF',
    'Approve the decorative lighting schedule and fixtures.'),
  M('dl-10', 'Order', 'approval', 'gc', 'DB',
    'Place the decorative lighting order against the approved schedule.'),
  P('dl-11', 'Manufacturing / Vendor Lead Time', 'production', 45, 'lighting', 'CF',
    'Manufacture and finish the decorative fixtures to the approved specification.'),
  P('dl-12', 'Shipping', 'logistics', 10, 'logistics', 'CB',
    'Transport the decorative fixtures with finish protection.'),
  M('dl-13', 'Delivery', 'logistics', 'logistics', 'CB',
    'Deliver the fixtures to the site.'),
  M('dl-14', 'Required On-Site', 'required', 'gc', 'MO',
    'Decorative fixtures on site so final lighting installation can complete.'),
];

/* 13 --------------------------- Custom Air Handling & HVAC Equipment */
const hvacEquip: StepSpec[] = [
  P('me-1', 'Buyout', 'buyout', 15, 'gc', 'AW',
    'Scope, negotiate and award the custom air handling and mechanical equipment package.'),
  P('me-2', 'Mechanical Coordination', 'coordination', 15, 'mechanical', 'SB',
    'Coordinate equipment capacities, mechanical room clearances, structural support and duct connections.'),
  P('me-3', 'Submittal Preparation', 'preparation', 15, 'hvac', 'LV',
    'Prepare equipment submittals with capacity data, dimensional drawings and rigging requirements.'),
  M('me-4', 'Initial Submittal', 'preparation', 'hvac', 'LV',
    'Transmit the complete air handling and mechanical equipment submittal.'),
  P('me-5', 'Mechanical Engineer Review', 'review', 12, 'mechanical', 'SB',
    'Review capacities, sound data, clearances and control interfaces against the mechanical design.'),
  P('me-6', 'Revision', 'revision', 8, 'hvac', 'LV',
    'Correct the equipment submittal to match the reviewed requirements.'),
  M('me-7', 'Resubmittal', 'revision', 'hvac', 'LV',
    'Return the corrected equipment submittal for final review.'),
  M('me-8', 'Approval', 'approval', 'mechanical', 'SB',
    'Approve the air handling and mechanical equipment for manufacture.'),
  M('me-9', 'Release / Order', 'approval', 'gc', 'DB',
    'Place the equipment order against the approved submittal.'),
  P('me-10', 'Manufacturing', 'production', 65, 'hvac', 'LV',
    'Build the custom air handling units and mechanical equipment to the approved configuration.'),
  P('me-11', 'Factory Testing', 'production', 8, 'hvac', 'LV',
    'Run and document factory acceptance testing before the equipment is released to ship.'),
  P('me-12', 'Shipping', 'logistics', 12, 'logistics', 'CB',
    'Transport the equipment with the crane and rigging access confirmed in advance.'),
  M('me-13', 'Delivery', 'logistics', 'logistics', 'CB',
    'Deliver the equipment to the site on the day the rigging window is open.'),
  M('me-14', 'Required On-Site', 'required', 'gc', 'MO',
    'Air handling equipment on site so it can be set before the mechanical room is closed in.'),
];

/* 14 ------------------------------------------- Passenger Elevator Package */
const elevator: StepSpec[] = [
  P('ev-1', 'Buyout', 'buyout', 15, 'gc', 'AW',
    'Scope, negotiate and award the passenger elevator package.'),
  P('ev-2', 'Hoistway & Structural Coordination', 'coordination', 20, 'vertical', 'HK',
    'Coordinate hoistway dimensions, pit depth, overhead clearance and rail support with the structural documents.'),
  P('ev-3', 'Shop Drawing Preparation', 'preparation', 20, 'elevator', 'OD',
    'Produce hoistway, rail bracket, machine and cab drawings for review.'),
  M('ev-4', 'Initial Submittal', 'preparation', 'elevator', 'OD',
    'Transmit the complete elevator equipment and cab submittal.'),
  P('ev-5', 'Consultant Review', 'review', 12, 'vertical', 'HK',
    'Review clearances, loading, code compliance and equipment selection against the specification.'),
  P('ev-6', 'Cab Finish Review', 'review', 10, 'architect', 'JS',
    'Review cab interior finishes, fixtures and entrance frames against the design intent.'),
  P('ev-7', 'Revision', 'revision', 10, 'elevator', 'OD',
    'Revise the drawings and cab details to resolve consultant and architectural comments.'),
  M('ev-8', 'Resubmittal', 'revision', 'elevator', 'OD',
    'Return the revised elevator package with a response to each comment.'),
  M('ev-9', 'Approval', 'approval', 'vertical', 'HK',
    'Approve the elevator equipment and cab submittal.'),
  M('ev-10', 'Release for Fabrication', 'approval', 'gc', 'DB',
    'Release the approved package and authorise equipment manufacture.'),
  P('ev-11', 'Manufacturing', 'production', 60, 'elevator', 'OD',
    'Manufacture the machine, controller, rails, entrances and finished cab.'),
  P('ev-12', 'Shipping', 'logistics', 12, 'logistics', 'CB',
    'Transport the elevator equipment staged in installation sequence.'),
  M('ev-13', 'Delivery', 'logistics', 'logistics', 'CB',
    'Deliver the elevator equipment to the site.'),
  M('ev-14', 'Required On-Site', 'required', 'gc', 'MO',
    'Elevator equipment on site so hoistway installation can begin without holding interior finishes.'),
];

/* 15 ----------------------- Architectural Metal Railings & Ornamental Metal */
const railings: StepSpec[] = [
  P('om-1', 'Buyout', 'buyout', 12, 'gc', 'AW',
    'Scope, negotiate and award the architectural railing and ornamental metal package.'),
  P('om-2', 'Design Coordination', 'coordination', 18, 'architect', 'JS',
    'Coordinate railing profiles, infill, guard heights and attachment conditions with the design team.'),
  P('om-3', 'Field Dimension Verification', 'coordination', 8, 'ornamental', 'IS',
    'Verify as-built stair, landing and opening dimensions before detailing begins.'),
  P('om-4', 'Shop Drawing Preparation', 'preparation', 20, 'ornamental', 'IS',
    'Produce elevation, section and attachment drawings for every railing and ornamental assembly.'),
  M('om-5', 'Initial Submittal', 'preparation', 'ornamental', 'IS',
    'Transmit the railing and ornamental metal shop drawing package.'),
  P('om-6', 'Architect Review', 'review', 12, 'architect', 'JS',
    'Review profiles, proportions, joinery and finish treatment against the design intent.'),
  P('om-7', 'Structural Review', 'review', 8, 'structural', 'MC',
    'Verify guard loading and attachment details against the structural documents.'),
  P('om-8', 'Revision', 'revision', 10, 'ornamental', 'IS',
    'Revise the drawings to resolve architectural and structural comments.'),
  M('om-9', 'Resubmittal', 'revision', 'ornamental', 'IS',
    'Return the corrected railing and ornamental metal package.'),
  M('om-10', 'Approval', 'approval', 'architect', 'JS',
    'Approve the railing and ornamental metal shop drawings.'),
  M('om-11', 'Finish Sample Approval', 'approval', 'owner', 'EM',
    'Approve the final metal finish and patina on a representative control sample.'),
  M('om-12', 'Release for Fabrication', 'approval', 'gc', 'DB',
    'Release the approved drawings and finish and authorise fabrication.'),
  P('om-13', 'Fabrication', 'production', 40, 'ornamental', 'IS',
    'Fabricate and fit up every railing run and ornamental metal assembly.'),
  P('om-14', 'Finishing', 'production', 12, 'ornamental', 'IS',
    'Apply and cure the approved finish, then crate the assemblies with edge protection.'),
  M('om-15', 'Delivery', 'logistics', 'logistics', 'CB',
    'Deliver the railings to the site after the stair and floor substrates are complete.'),
  M('om-16', 'Required On-Site', 'required', 'gc', 'MO',
    'Railings on site so guard installation can close out the stair inspection.'),
];

/* ==========================================================================
   EXTERNAL COMMITMENT MILESTONES
   ==========================================================================

   What each procurement path depends on that the General Contractor does not
   control. Every one of the fifteen packages was reviewed individually; none
   of these is a template applied across the board, and several packages carry
   two rather than three because only two of their dependencies are genuinely
   consequential.

   THE TEST APPLIED TO EACH ONE. "If this is not in hand by its required date,
   can the path continue normally?" Only a No earns a milestone. That is why
   there is no Owner Selection on Structural Steel (nothing the Owner picks
   gates detailing) and no Final Design on the Tile package (the design is
   settled; the selection is what gates it). It is also why routine
   correspondence, RFIs and ordinary submittal traffic are absent: the bars
   already carry the work, and a schedule that marked every decision would
   simply be a selections checklist drawn sideways.

   NONE OF THESE IS GC-OWNED, by design. The GC's own obligations are the bars.
   The raised diamond answers a different question - what is this path waiting
   on from someone else - and putting GC work there would blunt exactly that.

   `requiredForStepId` never points at a package's FIRST step: a commitment is
   consumed by an activity, and the activity that consumes it has to have
   something in front of it. That also keeps every derived date inside its own
   package's span, so no diamond lands off the left of its row.

   `committedFor` is authored as an absolute date, independent of the derived
   requirement, and is deliberately left off where the team has not yet given
   one - an uncommitted requirement is the normal early state, and showing it
   as blank is the honest depiction.

   WHEN THE CALENDAR CHANGES, THESE MOVE WITH THE REQUIREMENT. Each agreed or
   actual date below was written to express a relationship to the requirement
   it answers - on time, two days early, ten days late. When observed federal
   holidays entered the work calendar (2026-09-06) every derived requirement
   moved earlier, and each authored date here was re-pinned by the same number
   of working days, so the board tells the story it was written to tell on the
   new calendar instead of manufacturing late commitments out of a calendar
   change. The engine still never reads them. */

const C = (
  id: string,
  name: string,
  type: CommitmentSpec['type'],
  ownerRole: CommitmentSpec['ownerRole'],
  owner: CommitmentSpec['owner'],
  org: CommitmentSpec['org'],
  requiredForStepId: string,
  description: string,
  extra: Partial<Pick<CommitmentSpec, 'leadDays' | 'committedFor' | 'baselineRequiredBy' | 'completedOn'>> = {},
): CommitmentSpec => ({
  id, name, type, ownerRole, owner, org, requiredForStepId, description, ...extra,
});

/* 1 - Building Permit. The permit set cannot be assembled until every
   discipline has finished issuing into it. */
const permitC: CommitmentSpec[] = [
  C('permit-c1', 'Final Design Documents Complete', 'design', 'Architect', 'JS', 'architect',
    'pm-2', 'Issue the completed architectural design documents that the permit set is assembled from.',
    { leadDays: 3 }),
  C('permit-c2', 'Structural Design Complete', 'engineering', 'Structural Engineer', 'MC', 'structural',
    'pm-2', 'Issue sealed structural drawings and calculations for inclusion in the permit application.'),
  C('permit-c3', 'Civil & Site Design Complete', 'engineering', 'Civil Engineer', 'TF', 'civil',
    'pm-2', 'Issue the grading, drainage and site utility design the permit application depends on.'),
];

/* 2 - Concrete & Reinforcing. Nothing can be detailed until the foundation
   design and the bearing assumptions behind it are fixed. */
const concreteC: CommitmentSpec[] = [
  C('concrete-c1', 'Foundation Design Issued', 'engineering', 'Structural Engineer', 'MC', 'structural',
    'cr-2', 'Issue the foundation design, reinforcing criteria and embed requirements for detailing.'),
  C('concrete-c2', 'Geotechnical Bearing Confirmation', 'engineering', 'Geotechnical Engineer', 'AK', 'geotech',
    'cr-2', 'Confirm the bearing capacity and subgrade preparation the foundation design relies on.'),
];

/* 3 - Structural Steel. The longest-lead structural path: detailing cannot
   start without the design, and cannot finish without connection criteria. */
const steelC: CommitmentSpec[] = [
  C('steel-c1', 'Structural Design Complete', 'engineering', 'Structural Engineer', 'MC', 'structural',
    'ss-2', 'Issue the completed structural design with member sizes fixed for detailing.'),
  C('steel-c2', 'Connection Design Criteria Issued', 'engineering', 'Structural Engineer', 'MC', 'structural',
    'ss-3', 'Issue connection design criteria and delegated design requirements to the detailer.',
    // Required 21 Sep, issued 28 Sep - five working days late. Detailing
    // started against incomplete criteria and the first review cycle absorbed
    // the difference. Re-pinned with the requirement when the work calendar
    // gained federal holidays, so the miss is still five working days.
    { completedOn: '2026-09-28' }),
  C('steel-c3', 'Architectural Interface Confirmed', 'design', 'Architect', 'JS', 'architect',
    'ss-3', 'Confirm exposed steel conditions, finishes and the interfaces where steel meets enclosure.'),
];

/* 4 - Lumber & Engineered Framing. Member selection is an engineering output;
   the layout it serves is an architectural one. */
const framingC: CommitmentSpec[] = [
  C('framing-c1', 'Engineered Member Design Issued', 'engineering', 'Structural Engineer', 'MC', 'structural',
    'lf-2', 'Issue engineered member sizing, connector schedules and bearing requirements.'),
  C('framing-c2', 'Final Framing Layout Confirmed', 'design', 'Architect', 'JS', 'architect',
    'lf-2', 'Confirm the framing layout, openings and ceiling heights the member schedule is built from.'),
];

/* 5 - Heritage Steel Windows & Exterior Doors. The longest path in the set,
   and the one most exposed to late selections: fabrication is 70 working days
   and every unit is made to order. */
const heritageC: CommitmentSpec[] = [
  C('heritage-c1', 'Final Window & Door Design', 'design', 'Architect', 'JS', 'architect',
    'hw-3', 'Fix opening sizes, sightlines and profiles so shop drawings can be produced against them.',
    { leadDays: 2 }),
  C('heritage-c2', 'Final Frame Finish & Colour Selection', 'selection', 'Owner', 'EM', 'owner',
    'hw-4', 'Select the final frame finish and colour that the fabrication order is placed against.',
    // Originally required and agreed for 23 Oct; provided 2 Nov, six working
    // days late. The current forecast has since re-planned the Initial
    // Submittal around the actual, which is why the derived requirement now
    // reads 2 Nov - the baseline is what keeps the miss visible. Re-pinned
    // with the requirement when the work calendar gained federal holidays.
    { baselineRequiredBy: '2026-10-23', committedFor: '2026-10-23', completedOn: '2026-11-02' }),
  C('heritage-c3', 'Final Glazing Selection', 'selection', 'Architect', 'JS', 'architect',
    'hw-4', 'Confirm the glazing make-up, coating and performance for every opening type.'),
];

/* 6 - Electrical Switchgear. Equipment cannot be sized until the design is
   complete and the Owner's own loads are known. */
const switchgearC: CommitmentSpec[] = [
  C('switchgear-c1', 'Electrical Design & Service Requirements Complete', 'engineering', 'Electrical Engineer', 'NR', 'electrical',
    'sw-2', 'Issue the completed distribution design and confirm the incoming service requirements.'),
  C('switchgear-c2', 'Owner Equipment Loads Confirmed', 'information', 'Owner', 'EM', 'owner',
    'sw-3', 'Confirm owner-furnished equipment loads so the distribution can be sized correctly.'),
];

/* 7 - Exterior Stone. A natural material: the blend has to be chosen before a
   quarry block can be reserved, and the coursing before it can be cut. */
const stoneC: CommitmentSpec[] = [
  C('stone-c1', 'Stone Material & Blend Selection', 'selection', 'Owner', 'EM', 'owner',
    'st-3', 'Select the stone type, finish and blend that the control sample is built to represent.'),
  C('stone-c2', 'Coursing & Joint Pattern Approval', 'approval', 'Architect', 'JS', 'architect',
    'st-4', 'Approve the coursing, joint layout and corner treatment the elevations are drawn to.'),
];

/* 8 - Custom Air Handling & HVAC. Custom-built equipment: the criteria have to
   be right before anything is configured, let alone built. */
const hvacC: CommitmentSpec[] = [
  C('hvac-c1', 'Equipment Criteria Complete', 'engineering', 'Mechanical Engineer', 'SB', 'mechanical',
    'me-2', 'Issue capacities, sound criteria and control requirements for the air handling equipment.'),
  C('hvac-c2', 'Mechanical Room Coordination Information', 'information', 'Architect', 'JS', 'architect',
    'me-2', 'Confirm mechanical room dimensions, access routes and ceiling coordination for equipment fit.'),
  C('hvac-c3', 'Final Equipment Selection Confirmed', 'engineering', 'Mechanical Engineer', 'SB', 'mechanical',
    'me-3', 'Confirm the final equipment selection the submittal and factory build are prepared against.'),
];

/* 9 - Tile. No shop-drawing cycle at all, so the selection IS the schedule:
   miss it and the supplier cannot allocate from one production run. */
const tileC: CommitmentSpec[] = [
  C('tile-c1', 'Final Tile Selection', 'selection', 'Owner', 'EM', 'owner',
    'tl-4', 'Select the final tile for every wet area and finish location so quantities can be taken off.',
    { committedFor: '2027-07-09' }),
  C('tile-c2', 'Pattern & Layout Approval', 'approval', 'Interior Designer', 'RM', 'interiors',
    'tl-4', 'Approve the setting pattern, trim pieces and layout each area is ordered against.'),
];

/* 10 - Passenger Elevator. The hoistway is structure: it has to be right
   before the shaft is built, not when the cab arrives. */
const elevatorC: CommitmentSpec[] = [
  C('elevator-c1', 'Hoistway Structural Design Confirmed', 'engineering', 'Structural Engineer', 'MC', 'structural',
    'ev-2', 'Confirm hoistway structure, pit depth, overhead clearance and rail support loads.'),
  C('elevator-c2', 'Cab Interior Design Complete', 'design', 'Architect', 'JS', 'architect',
    'ev-3', 'Issue the cab interior design, entrance frames and fixture selections for detailing.'),
];

/* 11 - Custom Cabinetry & Casework. Cabinets are built around appliances; an
   appliance changed after detailing is a re-fabricated run. */
const caseworkC: CommitmentSpec[] = [
  C('casework-c1', 'Final Cabinet Layout', 'design', 'Interior Designer', 'RM', 'interiors',
    'cw-3', 'Fix the cabinet layout, elevations and reveals that shop drawings are produced from.'),
  C('casework-c2', 'Appliance Selections Confirmed', 'selection', 'Owner', 'EM', 'owner',
    'cw-3', 'Confirm every appliance so the cabinet openings and clearances can be detailed to fit.'),
  C('casework-c3', 'Cabinet Hardware Selection', 'selection', 'Interior Designer', 'RM', 'interiors',
    'cw-11', 'Select the cabinet hardware that fabrication drills and mounts to.'),
];

/* 12 - Architectural Metal Railings. Guards are a life-safety element, so the
   loading criteria are as binding as the design. */
const railingsC: CommitmentSpec[] = [
  C('railings-c1', 'Final Railing Design', 'design', 'Architect', 'JS', 'architect',
    'om-4', 'Fix railing profiles, infill and guard heights for detailing.'),
  C('railings-c2', 'Guard Loading Criteria Issued', 'engineering', 'Structural Engineer', 'MC', 'structural',
    'om-4', 'Issue guard loading and attachment criteria for the delegated connection design.'),
  C('railings-c3', 'Metal Finish Selection', 'selection', 'Owner', 'EM', 'owner',
    'om-13', 'Select the final metal finish and patina that fabrication is finished to.',
    { committedFor: '2027-08-02' }),
];

/* 13 - Plumbing Fixtures. Rough-in follows the fixture, not the other way
   round: a fixture changed after rough-in is opened walls. */
const plumbingC: CommitmentSpec[] = [
  C('plumbing-c1', 'Final Fixture Selection', 'selection', 'Owner', 'EM', 'owner',
    'pl-3', 'Select every fixture and fitting so rough-in dimensions can be scheduled against them.',
    { committedFor: '2027-07-02' }),
  C('plumbing-c2', 'Fixture Finish Selection', 'selection', 'Interior Designer', 'RM', 'interiors',
    'pl-4', 'Confirm the finish for each fixture and fitting the order is placed against.'),
];

/* 14 - Custom Interior Doors. Hardware drives the door preparation, so it is
   needed before machining rather than at installation. */
const intdoorsC: CommitmentSpec[] = [
  C('intdoors-c1', 'Final Door Schedule Issued', 'design', 'Architect', 'JS', 'architect',
    'id-2', 'Issue the door schedule with sizes, cores, swings and fire ratings resolved.',
    { committedFor: '2027-06-03' }),
  C('intdoors-c2', 'Door Hardware Selection', 'selection', 'Interior Designer', 'RM', 'interiors',
    'id-3', 'Select the hardware sets so doors and frames can be prepared to receive them.',
    { committedFor: '2027-07-06' }),
  C('intdoors-c3', 'Door Finish Selection', 'selection', 'Owner', 'EM', 'owner',
    'id-11', 'Select the final door finish that fabrication applies before delivery.'),
];

/* 15 - Decorative Lighting. Three parties, three different obligations, and a
   45 working-day manufacturing run behind all of them. */
const lightingC: CommitmentSpec[] = [
  C('lighting-c1', 'Lighting Design Complete', 'design', 'Lighting Designer', 'CF', 'lighting',
    'dl-3', 'Issue the completed decorative lighting design and location plan.',
    { committedFor: '2027-06-24' }),
  C('lighting-c2', 'Final Fixture Selection', 'selection', 'Owner', 'EM', 'owner',
    'dl-3', 'Select the decorative fixture for every location so the schedule can be assembled.',
    { committedFor: '2027-07-09' }),
  C('lighting-c3', 'Control & Dimming Requirements', 'engineering', 'Electrical Engineer', 'NR', 'electrical',
    'dl-4', 'Confirm control and dimming requirements so fixture compatibility can be submitted.'),
];

/* ==========================================================================
   BASELINE, ACTUAL AND RISK - three packages of fifteen
   ==========================================================================

   Everything above is the CURRENT FORECAST: what JiTpro expects as of the
   26 November 2026 data date. Nothing in this section changes any of it. These
   blocks add what the forecast alone cannot say - what was originally expected
   (baseline), what in fact happened (actual), and whether the field
   requirement is still going to be met (forecast on-site).

   Twelve packages carry none of this and are healthy by derivation, not by
   assertion. A board where everything is flagged directs attention nowhere. */

/* HVAC - a risk found BEFORE procurement starts. Nothing is late; the
   requirement changed underneath a path that had not begun. */
const hvacRisk: RiskSpec = {
  // Re-runs the backward pass with the original 45-day assumption, which is
  // what shows how much later this path could have started.
  baselineOverrides: [{ stepId: 'me-10', days: 45 }],
  issues: [
    {
      id: 'hvac-i1',
      kind: 'lead-time',
      title: 'Manufacturing Lead Time Increased',
      identifiedOn: '2026-11-18',
      cause:
        'Manufacturer reported factory capacity constraints affecting current production lead times.',
      impact:
        'Buyout and every upstream activity were advanced so the longer build still lands before the field need.',
      leadStepId: 'me-10',
      baselineLeadWorkdays: 45,
    },
  ],
};

/* Heritage Steel - a commitment missed, and absorbed. */
const heritageRisk: RiskSpec = {
  issues: [
    {
      id: 'heritage-i1',
      kind: 'missed-commitment',
      title: 'Frame Finish Selection Received Late',
      identifiedOn: '2026-11-02',
      cause:
        'The final frame finish and colour selection was provided later than the date the Owner had agreed to.',
      impact: 'Completion of the Initial Submittal was delayed.',
      rootCommitmentId: 'heritage-c2',
    },
  ],
};

/* Structural Steel - a commitment missed, and NOT absorbed. The field still
   needs steel on 15 March; the current forecast no longer delivers it then. */
const steelRisk: RiskSpec = {
  // Authored for now. A forward scheduling engine would compute this from the
  // actuals; nothing else in the model would have to change when it does.
  forecastOnSiteDate: '2027-03-22',
  issues: [
    {
      id: 'steel-i1',
      kind: 'missed-commitment',
      title: 'Connection Design Criteria Issued Late',
      identifiedOn: '2026-11-25',
      cause:
        'Connection design criteria were issued after the date the structural engineer owed them, and detailing proceeded against an incomplete set.',
      impact:
        'The first review cycle ran long resolving connections that should have been fixed before detailing began.',
      rootCommitmentId: 'steel-c2',
    },
  ],
};

export const SCHEDULE_ITEMS: ScheduleItem[] = [
  buildItem('itm-permit', 'Building Permit', 'Permits & Approvals', '2027-01-04', permit, permitC),
  buildItem('itm-concrete', 'Concrete & Reinforcing Package', 'Structural', '2027-01-18', concrete, concreteC),
  buildItem('itm-steel', 'Structural Steel Package', 'Structural', '2027-03-15', steel, steelC, steelRisk),
  buildItem('itm-framing', 'Lumber & Engineered Framing Package', 'Structural', '2027-04-05', framing, framingC),
  buildItem('itm-heritage', 'Heritage Steel Windows & Exterior Doors', 'Exterior Enclosure', '2027-06-07', heritage, heritageC, heritageRisk),
  buildItem('itm-switchgear', 'Electrical Switchgear & Distribution Equipment', 'Electrical', '2027-07-12', switchgear, switchgearC),
  buildItem('itm-stone', 'Exterior Stone Package', 'Exterior Finishes', '2027-08-09', stone, stoneC),
  buildItem('itm-hvac', 'Custom Air Handling & HVAC Equipment', 'Mechanical', '2027-08-23', hvacEquip, hvacC, hvacRisk),
  buildItem('itm-tile', 'Tile Package', 'Interior Finishes', '2027-09-13', tile, tileC),
  buildItem('itm-elevator', 'Passenger Elevator Package', 'Conveying', '2027-09-27', elevator, elevatorC),
  buildItem('itm-casework', 'Custom Cabinetry & Casework', 'Interior Finishes', '2027-10-11', casework, caseworkC),
  buildItem('itm-railings', 'Architectural Metal Railings & Ornamental Metal', 'Specialties', '2027-10-18', railings, railingsC),
  buildItem('itm-plumbing', 'Plumbing Fixture Package', 'Plumbing', '2027-10-25', plumbing, plumbingC),
  buildItem('itm-intdoors', 'Custom Interior Door Package', 'Interior Finishes', '2027-11-08', intdoors, intdoorsC),
  buildItem('itm-lighting', 'Decorative Lighting Package', 'Electrical', '2027-11-29', lighting, lightingC),
];

/**
 * Package health is derived in `buildItem` from recorded baseline, actual and
 * forecast facts - see PackageHealth. Two `markAtRisk()` calls used to sit
 * here, forcing a status onto Exterior Stone and Custom Cabinetry; they became
 * no-ops when the data date moved to November 2026 (neither package has
 * started, so neither has an on-track step to mark) and are removed rather
 * than left as fake risk with no reason behind it.
 */
