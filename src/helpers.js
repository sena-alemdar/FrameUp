// Small helpers shared by the views.
import { $, CR, S } from './state.js';
import { FB, REQ } from './data.js';

/* a stand-in video frame: a volcano scene with a presenter whose face is blurred */
export function frame(v, tc) {
  const sky = ['#BFE3FF', '#FFD9A8', '#C9C4F5', '#BFE3FF', '#FFE2B8'][v % 5];
  const zoom = v === 1 ? 'scale(1.7) translate(-70 -52)' : v === 3 ? 'translate(-30 0)' : '';
  return `<div class="frame"><svg viewBox="0 0 320 180" aria-hidden="true"><defs><filter id="bl${v}"><feGaussianBlur stdDeviation="5"/></filter></defs>
  <rect width="320" height="180" fill="${sky}"/><g transform="${zoom}">
  <path d="M90 180L170 62L200 62L280 180Z" fill="#7A5C4D"/><path d="M170 62L200 62L208 82L190 74L178 86L164 76Z" fill="#F0476B"/>
  <circle cx="185" cy="44" r="13" fill="#FFFFFF" opacity="0.8"/><circle cx="203" cy="30" r="9" fill="#FFFFFF" opacity="0.7"/>
  <rect x="0" y="150" width="320" height="30" fill="#5BAE7A"/>
  <rect x="42" y="104" width="34" height="56" rx="12" fill="#5650D6"/><circle cx="59" cy="88" r="16" fill="#E9B894" filter="url(#bl${v})"/></g></svg>${tc ? `<span class="tc">${tc}</span>` : ''}</div>`;
}

export const reqs = () => S.A.reqs.filter(r => r.t.trim());
export function checklist(v) {
  const rs = reqs(); if (!rs.length) return '';
  const res = r => REQ[v][r.id], done = rs.filter(r => res(r) && res(r)[0]).length;
  return `<div class="card"><div class="row between"><h2>Assignment checklist</h2><span class="pill ${done === rs.length ? 'good' : ''}">${done} of ${rs.length} done</span></div>
    ${rs.map(r => { const x = res(r); return `<div class="req"><span class="pill ${!x ? '' : x[0] ? 'good' : 'warn'}">${!x ? 'New' : x[0] ? '✓ Done' : 'Not found yet'}</span><div><b>${r.t}</b><br><span class="fine">${!x ? 'Added after this upload. It is checked on the next version.' : (x[1] ? `<span class="ts">${x[1]}</span> ` : '') + x[2]}</span></div></div>`; }).join('')}</div>`;
}
export const reqList = () => reqs().length ? `<div class="col" style="gap:4px"><span class="fine" style="font-weight:700">Your video must</span>${reqs().map(r => `<span>☐ ${r.t}</span>`).join('')}</div>` : '';

export function pick(v) {
  const d = FB[v], on = x => S.A.crit[x.c], ord = a => a.filter(on).sort((x, y) => (y.c === S.A.focus) - (x.c === S.A.focus));
  return { s: ord(d.s).slice(0, S.A.nS), n: ord(d.n).slice(0, S.A.nN), better: d.better.filter(on), q: d.q, file: d.file };
}
export const critOn = () => Object.keys(CR).filter(k => S.A.crit[k]);
export const due = () => new Date(S.A.due + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
export const pending = () => S.A.release === 'approve' && S.approved < S.versions;

export function toast(m) { const t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => t.hidden = true, 2800); }
