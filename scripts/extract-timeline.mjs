// One-shot extraction of MS Project XML → JSON.
// Reads reality.xml from repo root, prints a compact JSON array of tasks.
// Run: node scripts/extract-timeline.mjs > scripts/timeline-extract.json
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const xml = readFileSync(join(here, '..', 'reality.xml'), 'utf8');

// Convert PT__H__M__S → minutes (Project default 480 min/working-day)
function durationToMinutes(pt) {
  if (!pt) return 0;
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(pt);
  if (!m) return 0;
  const [, h = 0, mn = 0, s = 0] = m;
  return Number(h) * 60 + Number(mn) + Number(s) / 60;
}

function field(block, name) {
  const re = new RegExp(`<${name}>([\\s\\S]*?)</${name}>`);
  const m = re.exec(block);
  return m ? m[1] : null;
}

function decode(s) {
  if (!s) return s;
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

// Pull each <Task>...</Task> block in the <Tasks> section
const tasksMatch = /<Tasks>([\s\S]*?)<\/Tasks>/.exec(xml);
if (!tasksMatch) {
  console.error('No <Tasks> section found');
  process.exit(1);
}
const tasksXml = tasksMatch[1];
const taskBlocks = tasksXml.match(/<Task>[\s\S]*?<\/Task>/g) || [];

const tasks = taskBlocks.map((block) => {
  const minutes = durationToMinutes(field(block, 'Duration'));
  return {
    uid: Number(field(block, 'UID')),
    id: Number(field(block, 'ID')),
    name: decode(field(block, 'Name')),
    wbs: field(block, 'WBS'),
    outlineLevel: Number(field(block, 'OutlineLevel')),
    start: field(block, 'Start'),
    finish: field(block, 'Finish'),
    durationMinutes: minutes,
    durationWorkingDays: Math.round((minutes / 480) * 100) / 100,
    isMilestone: field(block, 'Milestone') === '1',
    isSummary: field(block, 'Summary') === '1',
    isCritical: field(block, 'Critical') === '1',
    notes: decode(field(block, 'Notes')) || null,
  };
});

console.log(JSON.stringify(tasks, null, 2));
