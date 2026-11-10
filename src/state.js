// Shared state and labels for the prototype. Everything lives in memory and resets on reload.

export const $ = s => document.querySelector(s);
export const CR = { story: 'Storytelling', visual: 'Visualisation', editing: 'Editing', sound: 'Sound', facts: 'Factual correctness' };
export const TONES = ['very gentle', 'gentle', 'encouraging and clear', 'direct'];
export const MODELS = { eco: ['Economy', 'Smaller model for every step', '€0.02'], bal: ['Balanced', 'Strong model for analysis, small one for checks', '€0.05'], best: ['Best quality', 'Strongest model for every step', '€0.12'] };
export const S = { role: 'student', sView: 'join', team: 'Team Lava', versions: 0, viewV: 0, approved: 0, stepIdx: 0, running: null, open: {}, fair: false,
  A: { title: 'Why do volcanoes erupt?', brief: 'Explain in your own words why volcanoes erupt. Use at least one model, drawing or experiment to show what happens inside. The video should make sense to someone who has never heard of magma.', audience: 'Younger students (grade 5)', due: '2026-11-27', crit: { story: true, visual: true, editing: true, sound: true, facts: true }, reqs: [ { id: 'r1', t: 'Explain what magma is' }, { id: 'r2', t: 'Show at least one figure or model of the inside of a volcano' }, { id: 'r3', t: 'Name one real volcano as an example' }, { id: 'r4', t: 'End with a one-sentence summary' } ], focus: 'story', nS: 2, nN: 3, question: true, release: 'auto', maxUp: 3 },
  auth: { teacher: 0, admin: 0 }, created: false, tTab: 'class', tOpen: null, queue: { ash: 'open', geyser: 'open' },
  aTab: 'coach', tone: 2, showPrompt: false, model: 'bal', teacherShape: true, tested: false, published: false,
  defs: { story: 'Is there a clear beginning, middle and end? Does the opening make you want to watch?', visual: 'Framing, light, and whether you can see what matters.', editing: 'Pace of the cuts and whether they support the story.', sound: 'Can you hear every word? Is music balanced with voice?', facts: 'Is the subject explained correctly? Mark doubtful claims to double-check; never assert a correction.' } };
