// Student screens: join, projects, upload progress, feedback.
import { $, CR, S } from '../state.js';
import { FB, STEPS } from '../data.js';
import { frame, checklist, reqList, pick, critOn, due, pending } from '../helpers.js';

/* ---------- student ---------- */
export function feedbackView(v) {
  const d = pick(v);
  const item = (x, k) => `<div class="fb ${k}"><div class="meta"><span class="ts">${x.ts}</span><span>${CR[x.c]}</span></div><h3>${x.title}</h3><p>${x.text}</p>
    <div><button class="linkbtn" data-act="saw" data-v="${k + x.id}" aria-expanded="${!!S.open[k + x.id]}">${S.open[k + x.id] ? 'Hide' : 'Why? See what the coach saw'}</button></div>
    ${S.open[k + x.id] ? `<div class="saw"><div>${frame(x.f, x.ts)}</div><div><b>${x.sawT}</b><br>${x.sawT.startsWith('Transcript') ? `<q>${x.saw}</q>` : x.saw}<p class="fine" style="margin-top:6px">This is exactly what the coach based this comment on.</p></div></div>` : ''}</div>`;
  return `<div class="card">${frame(0, '2:14')}
      <div class="tl" aria-hidden="true">${d.s.map(x => `<b class="s" style="left:${x.sec / 134 * 100}%"></b>`).join('')}${d.n.map(x => `<b class="n" style="left:${x.sec / 134 * 100}%"></b>`).join('')}</div>
      <div class="row"><span class="pill good">● What worked</span><span class="pill" style="background:var(--sun-soft);color:var(--warn)">● Next steps</span><span class="fine">${d.file}</span></div></div>
    ${checklist(v)}
    ${d.better.length ? `<div class="banner good"><h3>What got better since version 1</h3>${d.better.map(b => `<p>✓ ${b.t}</p>`).join('')}</div>` : ''}
    <div class="card"><h2>What worked</h2>${d.s.map(x => item(x, 's')).join('')}</div>
    <div class="card"><h2>Next steps</h2>${d.n.map(x => item(x, 'n')).join('')}</div>
    ${S.A.question ? `<div class="question"><span class="fine" style="font-family:var(--body)">A question for your team</span><br>${d.q}</div>` : ''}
    <div class="card"><p class="fine"><b>This feedback was written by an AI coach.</b> It watched a copy of your video with blurred faces. It can be wrong. Your teacher and your FrameUp creator can see it too.</p>
      ${S.fair ? `<p class="pill good" style="align-self:flex-start">Sent. Your creator will take a look.</p>` : `<div class="row"><button class="btn ghost small" data-act="fair">This feedback isn't fair</button></div>`}</div>`;
}
export function student() {
  if (S.sView === 'join') return `<div class="col narrow">
    <h1>Hi! Let's get your video some feedback.</h1>
    <div class="card">
      <label for="code">Class code from your teacher<input class="code" type="text" id="code" value="VOLC-7B" maxlength="8"></label>
      <div class="col" style="gap:8px"><span class="fine" style="font-weight:700">Pick your team</span>
        <div class="chips">${['Team Lava', 'Team Magma', 'Team Ash', 'Team Crater'].map(t => `<button class="chip" data-act="team" data-v="${t}" aria-pressed="${S.team === t}">${t}</button>`).join('')}</div></div>
      <button class="btn" data-act="go" data-v="home">Join class 7b</button>
      <p class="fine">No email, no password. We only store your team name.</p>
    </div></div>`;
  if (S.sView === 'home') {
    const st = !S.versions ? ['No video yet', ''] : pending() ? ['Your teacher is checking the feedback', 'warn'] : [`Version ${S.versions} · feedback ready`, 'good'];
    return `<div class="col narrow">
    <div class="row between"><span class="pill">Class 7b · ${S.team}</span><button class="linkbtn" data-act="go" data-v="join">Leave</button></div>
    <h1>Your projects</h1>
    <button class="card proj" data-act="go" data-v="project"><div class="row between"><span class="pill ai">Now · due ${due()}</span><span class="pill ${st[1]}">${st[0]}</span></div>
      <h2>${S.A.title}</h2><p class="sub">Make a 1 to 3 minute video for: ${S.A.audience.toLowerCase()}.</p><span class="linkbtn">Open project</span></button>
    <button class="card proj" data-act="say" data-v="Finished projects stay readable until the end of the school year."><div class="row between"><span class="pill">Finished in June</span><span class="pill good">2 versions · screened</span></div>
      <h2>Plastic in our river</h2><p class="sub">Your feedback from both versions is still here.</p></button>
    <div class="card proj" style="opacity:.7"><div class="row"><span class="pill">Starts in January</span></div><h2>How does a vaccine work?</h2><p class="sub">Your teacher will open this project later.</p></div></div>`;
  }
  if (S.sView === 'run') return `<div class="col narrow">
    <h1>Working on it…</h1><p class="sub">${FB[Math.min(S.versions, 1)].file} · 2:14</p>
    <div class="card"><ul class="steps">${STEPS.map((x, i) => `<li class="${i < S.stepIdx ? 'done' : i === S.stepIdx ? 'on' : ''}"><span class="dot"></span><div><b>${x.t}</b><small>${x.s}</small>${x.minis && i <= S.stepIdx ? `<div class="minis">${critOn().map(k => `<span class="pill ${i < S.stepIdx ? 'good' : 'ai'}">${CR[k]}</span>`).join('')}</div>` : ''}</div></li>`).join('')}</ul>
      <button class="linkbtn" data-act="skip">Skip to the feedback</button></div></div>`;
  /* project page */
  const canUp = S.versions < 2;
  return `<div class="col narrow">
    <div class="row between"><button class="linkbtn" data-act="go" data-v="home">← Your projects</button><span class="pill">Class 7b · ${S.team}</span></div>
    <h1>${S.A.title}</h1>
    <div class="card"><p><b>Your task:</b> ${S.A.brief}</p><p class="fine">A 1 to 3 minute video for ${S.A.audience.toLowerCase()}. Due ${due()}.</p>${reqList()}
      <div class="col" style="gap:6px"><span class="fine" style="font-weight:700">Your teacher asked the coach to look at</span><div class="row">${critOn().map(k => `<span class="pill ${k === S.A.focus ? 'ai' : ''}">${CR[k]}${k === S.A.focus ? ' · main focus' : ''}</span>`).join('')}</div></div></div>
    ${S.versions ? `<div class="card"><h2>Your versions</h2><div class="chips">${[0, 1].slice(0, S.versions).map(i => `<button class="chip" data-act="view" data-v="${i}" aria-pressed="${S.viewV === i}">Version ${i + 1}</button>`).join('')}</div>
      ${canUp ? `<div class="row"><button class="btn" data-act="start">Upload an improved cut</button><span class="fine">${S.A.maxUp - S.versions} of ${S.A.maxUp} uploads left</span></div>` : `<p class="fine">This demo stops at two versions.</p>`}</div>`
    : `<div class="card"><div class="drop"><h3>Drop your video here</h3><p class="fine">MP4 or MOV, 1 to 3 minutes</p><button class="btn" data-act="start">Use the example video</button></div>
      <p class="fine">Your video is deleted after one week. Faces are blurred before the AI coach sees it.</p></div>`}
    ${S.versions ? (pending() && S.viewV >= S.approved ? `<div class="banner"><h3>Your feedback is written</h3><p>Your teacher is having a look first. You will see it here as soon as it is released.</p></div>` : feedbackView(S.viewV)) : ''}</div>`;
}
