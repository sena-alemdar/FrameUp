// Entry point: renders the current view and handles all clicks and inputs.
import '@fontsource/bricolage-grotesque/latin-500.css';
import '@fontsource/bricolage-grotesque/latin-700.css';
import '@fontsource/bricolage-grotesque/latin-800.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-700.css';
import './styles.css';
import { $, TONES, S, WORDS } from './state.js';
import { STEPS } from './data.js';
import { critOn, toast } from './helpers.js';
import { student } from './views/student.js';
import { teacher } from './views/teacher.js';
import { promptText, admin } from './views/admin.js';
import { WHO, login } from './views/login.js';

function runStep() {
  if (S.stepIdx >= STEPS.length) return finish();
  const fast = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.4 : 1;
  S.running = setTimeout(() => { S.stepIdx++; render(); runStep(); }, STEPS[S.stepIdx].ms * fast);
}
function finish() { clearTimeout(S.running); S.versions++; S.viewV = S.versions - 1; if (S.A.release === 'auto') S.approved = S.versions; S.sView = 'project'; S.open = {}; S.fair = false; render(); window.scrollTo(0, 0); }

function render() {
  const staff = S.role !== 'student', inn = staff && S.auth[S.role] === 3;
  $('#app').innerHTML = S.role === 'student' ? student() : !inn ? login(S.role)
    : `<div class="col"><div class="row between"><span class="pill good">Signed in: ${WHO[S.role][0]} · ${WHO[S.role][2]}</span><button class="linkbtn" data-act="auth" data-v="0">Log out</button></div>${S.role === 'teacher' ? teacher() : admin()}</div>`;
  document.querySelectorAll('.roles button').forEach(b => b.setAttribute('aria-pressed', b.dataset.role === S.role));
}
document.addEventListener('click', e => {
  const r = e.target.closest('[data-role]'); if (r) { S.role = r.dataset.role; render(); return; }
  const a = e.target.closest('[data-act]'); if (!a) return;
  const v = a.dataset.v, act = a.dataset.act;
  switch (act) {
    case 'join': { const t = WORDS[$('#word').value.trim().toLowerCase()];
      if (!t) { toast("We don't know this team word. Check the card from your teacher."); return; }
      S.team = t; S.sView = 'home'; S.privacy = false; break; }
    case 'privacy': S.privacy = !S.privacy; break;
    case 'edit': if (v === 'Team Lava') S.edited = true; toast(`Edits saved. ${v} now sees "Reviewed by your teacher".`); break;
    case 'joinreq': S.joinReq = v.toLowerCase(); toast(a.dataset.m); break;
    case 'reqadd': S.A.reqs.push({ id: 'n' + Date.now(), t: '' }); render(); { const el = document.querySelector('[data-req="' + (S.A.reqs.length - 1) + '"]'); if (el) el.focus(); } return;
    case 'reqdel': S.A.reqs.splice(+v, 1); break;
    case 'auth': S.auth[S.role] = +v; break;
    case 'go': S.sView = v; S.privacy = false; break;
    case 'start': S.sView = 'run'; S.stepIdx = 0; render(); window.scrollTo(0, 0); runStep(); return;
    case 'skip': finish(); return;
    case 'view': S.viewV = +v; S.open = {}; break;
    case 'saw': S.open[v] = !S.open[v]; break;
    case 'fair': S.fair = true; break;
    case 'ttab': S.tTab = v; break;
    case 'topen': S.tOpen = v || null; break;
    case 'release': S.A.release = v; if (v === 'auto') S.approved = S.versions; break;
    case 'create': toast(S.created ? 'Saved. New uploads use these settings.' : 'Assignment created. Share the code with your class.'); S.created = true; break;
    case 'approve': S.approved = S.versions; toast('Released. Team Lava can read the feedback now.'); break;
    case 'q': S.queue[a.dataset.k] = v; toast(a.dataset.m); break;
    case 'say': toast(v); return;
    case 'atab': S.aTab = v; break;
    case 'prompt': S.showPrompt = !S.showPrompt; break;
    case 'model': S.model = v; S.tested = false; S.published = false; break;
    case 'test': S.tested = true; break;
    case 'publish': S.published = true; toast('v13 is live for all new videos.'); break;
    case 'rollback': S.published = false; toast('Rolled back. v12 is live again.'); break;
  }
  render(); if (['go', 'atab', 'ttab'].includes(act)) window.scrollTo(0, 0);
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('tr[data-act]')) e.target.click(); if (e.key === 'Enter' && e.target.id === 'word') $('[data-act="join"]').click(); });
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.req) { S.A.reqs[+t.dataset.req].t = t.value; return; }
  if (t.dataset.crit) { S.A.crit[t.dataset.crit] = t.checked; if (!critOn().length) { S.A.crit[t.dataset.crit] = true; t.checked = true; toast('Keep at least one criterion on.'); } if (!S.A.crit[S.A.focus]) S.A.focus = critOn()[0]; render(); }
  else if (t.dataset.set) { const k = t.dataset.set; S.A[k] = t.type === 'checkbox' ? t.checked : ['nS', 'nN', 'maxUp'].includes(k) ? +t.value : t.value; if (!['title', 'brief'].includes(k)) render(); }
  else if (t.id === 'tshape') { S.teacherShape = t.checked; }
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'tone') { S.tone = +t.value; $('#toneLbl').textContent = TONES[S.tone]; }
  if (t.dataset.def) S.defs[t.dataset.def] = t.value;
  if ((t.id === 'tone' || t.dataset.def) && $('#prompt')) $('#prompt').textContent = promptText();
});
render();
