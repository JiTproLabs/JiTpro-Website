/**
 * The house on the drawings: the Hero's house (`assets/hero/house-render`), redrawn as a front elevation. The render
 * is a night perspective; a plan set shows a building flat, in line. So this is drawn from it, not traced and not
 * placed: the tall pylon with its slot of light, the slatted pergola on the roof, the great roof and its overhang,
 * the glazed upper storey behind a balcony rail, the cantilevered balcony slab, the glazed ground storey with the
 * stair seen through it, the garage, the lower wing to the left with its own roof and balcony, and the entry steps.
 * On the sheet's own 230-unit width, the ground at y = 120. Line only: no fill, no shade, no amber.
 *
 * One drawing, used wherever a sheet shows the house (Design System Sections 54.4.1 and 54.4.5): project owners →
 * Reduce risk, and general contractors → Identify.
 */
const box = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;
export const HOUSE_ELEVATION = {
  masses: [
    box(66, 30, 14, 90), // the pylon
    box(24, 61, 42, 4), // the left wing's roof
    box(31, 65, 35, 22), // its upper storey
    box(16, 87, 50, 4), // its balcony slab
    box(27, 91, 39, 29), // its lower storey
    box(80, 55, 100, 4.5), // the great roof
    box(84, 59.5, 84, 25), // the upper storey
    box(78, 84.5, 102, 4.5), // the balcony slab
    box(84, 89, 52, 31), // the glazed ground storey
    'M136 89H172V120', // the garage wall
    box(142, 97, 26, 23), // the garage door
    'M84 55V37H122V55', // the pergola on the roof
    'M56 120V117H94V120M60 117V114H90V117', // the entry steps
  ].join(''),
  detail: [
    box(71.5, 40, 3, 62), // the slot of light in the pylon
    'M84 41.5H122M84 46H122M84 50.5H122', // the pergola's slats
    'M42 65V87M54 65V87M40 91V120M53 91V120', // the left wing's glazing
    'M16 87V80H31', // its balcony rail
    'M105 59.5V84.5M126 59.5V84.5M147 59.5V84.5', // the upper storey's glazing
    'M80 77H180V84.5', // the balcony rail
    'M101 89V120M118 89V120', // the ground storey's glazing
    'M104 117L132 93', // the stair, seen through the glass
    'M142 103H168M142 109H168M142 115H168', // the garage door's panels
  ].join(''),
  /** The ground line. */
  ground: 'M10 120H184',
  /** The dimension string beneath the house. */
  dimension: 'M16 133H180M16 130v6M80 130v6M180 130v6',
} as const;
