// Teacher screens: assignment setup, all teams, review queue.
import { $, CR, S, WORDS } from '../state.js';
import { FB, REMOVED } from '../data.js';
import { frame, reqs, checklist, critOn, due, pending } from '../helpers.js';

/* ---------- teacher ---------- */
export function critTable(v) {
  const d = FB[v], cell = (a, k, none) => a.filter(x => x.c === k).map(x => `<span class="ts">${x.ts}</span> <b>${x.title}</b><br>${x.text}`).join('<br><br>') || `<span class="fine">${none}</span>`;
  return `<div class="tw"><table><thead><tr><th>Criterion</th><th>What worked</th><th>Next step</th></tr></thead><tbody>${critOn().map(k => `<tr><td><b>${CR[k]}</b>${k === S.A.focus ? '<br><span class="pill ai">main focus</span>' : ''}</td><td>${cell(d.s, k, 'Nothing stood out')}</td><td>${cell(d.n, k, 'Nothing to improve')}</td></tr>`).join('')}</tbody></table></div>
    ${S.A.question ? `<p><b>Question for the team:</b> ${d.q}</p>` : ''}
    ${checklist(v).replace('<div class="card">', '<div class="card" style="background:var(--bg)">')}
    <p class="fine">You see the coach's notes on every criterion. Students see the top ${S.A.nS} strengths and ${S.A.nN} next steps, main focus first.</p>`;
}
export function teams() {
  const lava = S.sView === 'run' ? ['Processing', 'ai', 'now'] : !S.versions ? ['Waiting for upload', '', '—'] : pending() ? ['Draft waiting for you', 'warn', 'Version ' + S.versions] : ['Released', 'good', 'Version ' + S.versions];
  return [ ['Team Lava', ...lava], ['Team Magma', 'Released', 'good', 'Version 2'],
    ['Team Ash', S.queue.ash === 'open' ? 'Needs review' : S.queue.ash, S.queue.ash === 'open' ? 'warn' : 'good', 'Version 1'],
    ['Team Crater', 'Released', 'good', 'Version 1'],
    ['Team Geyser', S.queue.geyser === 'open' ? 'Draft waiting for you' : 'Released', S.queue.geyser === 'open' ? 'warn' : 'good', 'Version 1'],
    ['Team Basalt', 'Released', 'good', 'Version 1'], ['Team Pumice', 'Released', 'good', 'Version 1'],
    ['Team Ember', S.queue.ember === 'open' ? 'Urgent: safeguarding' : S.queue.ember, S.queue.ember === 'open' ? 'warn' : '', 'Version 1'] ];
}
const removed = t => `<div class="banner" style="background:var(--bg)"><h3>Removed automatically before the AI coach saw the video</h3>${(REMOVED[t] || []).map(x => `<p>${x}</p>`).join('') || '<p>Nothing had to be removed.</p>'}<p class="fine">Only you see this list. Faces are always blurred.</p></div>`;
const escal = h => `<p class="fine">Waiting for ${h} hours. If nobody handles it within 48 hours, it goes to FrameUp staff, never to creators.</p>`;
export function teacher() {
  const open = Object.values(S.queue).filter(x => x === 'open').length + (pending() ? 1 : 0);
  const head = `<div class="col" style="gap:6px"><span class="pill" style="align-self:flex-start">Class 7b · ${S.A.title}</span><h1>${S.tTab === 'assign' ? 'Set up the assignment' : 'Your class at a glance'}</h1></div>
    <div class="tabs" role="tablist">${[['assign', 'Assignment'], ['class', 'All teams'], ['queue', `Needs review (${open})`]].map(t => `<button role="tab" data-act="ttab" data-v="${t[0]}" aria-selected="${S.tTab === t[0]}">${t[1]}</button>`).join('')}</div>`;
  if (S.tTab === 'assign') { const A = S.A; return `<div class="col">${head}
    <div class="card"><h2>The task</h2>
      <label for="a-brief">Describe the assignment in your own words<textarea id="a-brief" data-set="brief" rows="4">${A.brief}</textarea></label>
      <p class="fine">Students read this as their task. The AI coach reads it too, so the feedback is judged against what you actually asked for.</p>
      <div class="grid2"><label for="a-title">Title<input type="text" id="a-title" data-set="title" value="${A.title}"></label>
        <label for="a-aud">Who is the video for?<select id="a-aud" data-set="audience">${['Younger students (grade 5)', 'Classmates', 'Parents and the public'].map(o => `<option ${o === A.audience ? 'selected' : ''}>${o}</option>`).join('')}</select></label>
        <label for="a-due">Due date<input type="date" id="a-due" data-set="due" value="${A.due}"></label>
        <label for="a-up">Uploads per team<select id="a-up" data-set="maxUp">${[2, 3, 5].map(o => `<option ${o === A.maxUp ? 'selected' : ''}>${o}</option>`).join('')}</select></label></div></div>
    <div class="card"><h2>Requirements checklist</h2><p class="sub">Things every video must contain. The coach checks each one and shows the team what is done and what is missing.</p>
      ${A.reqs.map((r, i) => `<div class="row" style="flex-wrap:nowrap"><input type="text" id="req-${r.id}" data-req="${i}" value="${r.t.replace(/"/g, '&quot;')}" placeholder="For example: mention where your information comes from" aria-label="Requirement ${i + 1}"><button class="btn small ghost" data-act="reqdel" data-v="${i}" aria-label="Remove requirement ${i + 1}">Remove</button></div>`).join('')}
      <button class="btn small ghost" data-act="reqadd" style="align-self:flex-start">+ Add a requirement</button></div>
    <div class="card"><h2>What should the AI coach look at?</h2><p class="sub">The feedback every team gets is built from exactly these criteria. Switch one off and it disappears from the feedback.</p>
      <div class="grid2">${Object.keys(CR).map(k => `<div class="crit"><label class="check" for="c-${k}"><input type="checkbox" id="c-${k}" data-crit="${k}" ${A.crit[k] ? 'checked' : ''}><b>${CR[k]}</b></label><span class="fine">${S.defs[k]}</span></div>`).join('')}</div>
      <label for="a-focus">Main focus for this assignment<select id="a-focus" data-set="focus">${Object.keys(CR).map(k => `<option value="${k}" ${k === A.focus ? 'selected' : ''}>${CR[k]}</option>`).join('')}</select></label></div>
    <div class="card"><h2>Shape of the feedback</h2>
      ${S.teacherShape ? `<div class="grid2"><label for="a-ns">Strengths<select id="a-ns" data-set="nS">${[1, 2, 3].map(o => `<option ${o === A.nS ? 'selected' : ''}>${o}</option>`).join('')}</select></label>
        <label for="a-nn">Next steps<select id="a-nn" data-set="nN">${[1, 2, 3, 4].map(o => `<option ${o === A.nN ? 'selected' : ''}>${o}</option>`).join('')}</select></label></div>
        <label class="check" for="a-q"><input type="checkbox" id="a-q" data-set="question" ${A.question ? 'checked' : ''}>End with a question for the team to discuss</label>`
      : `<p class="sub">Fixed by FrameUp: ${A.nS} strengths, ${A.nN} next steps${A.question ? ', one question' : ''}.</p>`}
      <p class="fine">Always fixed: no grades, strengths come first, every comment has a timestamp.</p></div>
    <div class="card"><h2>Who releases the feedback?</h2>
      <div class="chips"><button class="chip big" data-act="release" data-v="auto" aria-pressed="${A.release === 'auto'}"><b>Automatically</b><small>Teams get it in minutes when all checks pass. You see everything and can step in.</small></button>
        <button class="chip big" data-act="release" data-v="approve" aria-pressed="${A.release === 'approve'}"><b>I approve each one first</b><small>Every AI draft waits in "Needs review" until you release it.</small></button></div></div>
    <div class="row"><button class="btn" data-act="create">${S.created ? 'Save changes' : 'Create assignment and get the class code'}</button></div>
    ${S.created ? `<div class="codecard"><div class="qr" aria-label="QR code placeholder"></div><div><span class="fine">Show this to your class. It expires on ${due()}.</span><div class="bigcode">VOLC-7B</div><button class="linkbtn" data-act="say" data-v="New code created. The old one no longer works.">Reset the code</button></div></div>
    <div class="card"><div class="row between"><h2>Team cards</h2><button class="btn small ghost" data-act="say" data-v="Team cards are ready to print.">Print team cards</button></div>
      <p class="sub">Each team joins with the class code plus its own team word. The words are printed on cards, so nobody needs an email.</p>
      <div class="tw"><table><thead><tr><th>Team</th><th>Team word</th></tr></thead><tbody>${Object.entries(WORDS).map(([w, t]) => `<tr><td><b>${t}</b></td><td><span class="ts">${w}</span></td></tr>`).join('')}</tbody></table></div>
      ${S.joinReq === 'open' ? `<div class="flag"><span class="pill warn" style="align-self:flex-start">Join request</span><span>Someone used the class code with an unknown team name: "Team Obsidian". New teams only join when you approve them.</span>
        <div class="row"><button class="btn small" data-act="joinreq" data-v="Approved" data-m="Team Obsidian approved. Print a card for them.">Approve</button><button class="btn small ghost" data-act="joinreq" data-v="Rejected" data-m="Rejected. If the code leaked, reset it.">Reject</button></div></div>` : `<p class="fine">Join request: ${S.joinReq}.</p>`}</div>` : ''}</div>`; }
  if (S.tTab === 'class') {
    const isLava = S.tOpen === 'Team Lava', v = isLava ? Math.max(S.versions - 1, 0) : 0;
    return `<div class="col">${head}
    <div class="banner"><h3>4 of 6 finished teams have unclear sound</h3><p>The music is often louder than the voice. A five-minute class tip on recording voice-over could help everyone.</p></div>
    <div class="card"><div class="tw"><table><thead><tr><th>Team</th><th>Status</th><th>Latest</th></tr></thead><tbody>
      ${teams().map(t => `<tr class="click" tabindex="0" data-act="topen" data-v="${t[0]}"><td><b>${t[0]}</b></td><td><span class="pill ${t[2]}">${t[1]}</span></td><td>${t[3]}</td></tr>`).join('')}</tbody></table></div>
      <p class="fine">Select a team to read its feedback. You see everything students see.</p></div>
    ${S.tOpen ? `<div class="card"><div class="row between"><h2>${S.tOpen}</h2><button class="linkbtn" data-act="topen" data-v="">Close</button></div>
      ${isLava && !S.versions ? `<p class="sub">No video yet. Switch to Student and upload one to see it arrive here.</p>` :
      S.tOpen === 'Team Ember' ? `<p class="sub">This video raised a safeguarding concern. No AI feedback was written. Open "Needs review" to see the alert.</p>` :
      `<p class="fine">Version ${v + 1} · AI feedback, structured by the criteria you chose for this assignment</p>${critTable(v)}${removed(S.tOpen)}
       <label for="tnote">Add a note for the team<textarea id="tnote" rows="2" placeholder="Shown under the AI feedback, marked as from you"></textarea></label>
       <div class="row"><button class="btn small" data-act="say" data-v="Note added for ${S.tOpen}">Add note</button><button class="btn small ghost" data-act="edit" data-v="${S.tOpen}">Edit feedback</button><button class="btn small ghost" data-act="say" data-v="Feedback retracted. The team no longer sees it.">Retract</button></div>`}
      ${isLava && !S.versions ? '' : `<button class="linkbtn" data-act="say" data-v="${S.tOpen}'s videos, feedback and team name are deleted. Backups expire within 30 days.">Delete this team's data</button>`}</div>` : ''}</div>`;
  }
  const lava = pending() ? `<div class="card"><div class="row between"><h2>Team Lava · version ${S.versions}</h2><span class="pill ai">AI draft · waiting for your approval</span></div>
      <p class="fine">All checks passed. It waits here because you chose to approve each feedback. Once released, the team sees "Reviewed by your teacher".</p>${critTable(S.versions - 1)}${removed('Team Lava')}
      <div class="row"><button class="btn small" data-act="approve">Approve and release</button><button class="btn small ghost" data-act="edit" data-v="Team Lava">Edit first</button></div></div>` : '';
  const gey = S.queue.geyser === 'open' ? `<div class="card"><div class="row between"><h2>Team Geyser · version 1</h2><span class="pill warn">AI draft · held by the tone check</span></div>
      <p class="fine">The AI rewrote this once and it still failed, so it was not released. Fix the marked sentence or write your own.</p>${escal(5)}
      <div class="tw"><table><thead><tr><th>Criterion</th><th>What worked</th><th>Next step</th></tr></thead><tbody>
        <tr><td><b>Storytelling</b></td><td><span class="ts">0:05</span> <b>Funny opening scene with the bottle</b><br>The surprise makes people curious about what happens next.</td><td><span class="ts">1:30</span> <b>Say the main point once more at the end</b><br>One closing sentence helps viewers remember why geysers erupt.</td></tr>
        <tr><td><b>Visualisation</b></td><td><span class="ts">0:44</span> <b>The drawing explains the water pressure</b><br>The arrows show clearly where the water goes.</td><td><span class="pill warn">held · see marked sentence</span></td></tr>
        <tr><td><b>Editing</b></td><td><span class="ts">0:20</span> <b>Quick cuts in the experiment</b><br>The pace matches the excitement of the eruption.</td><td><span class="ts">1:05</span> <b>The title card is gone too fast</b><br>Leave it on screen for about three seconds so it can be read.</td></tr>
        <tr><td><b>Sound</b></td><td><span class="ts">0:00</span> <b>Clear voice all the way through</b><br>Every word is easy to understand.</td><td><span class="ts">0:50</span> <b>Wind noise outdoors</b><br>Record the outdoor part again with your back to the wind.</td></tr>
        <tr><td><b>Factual correctness</b></td><td><span class="ts">0:36</span> <b>Heat and pressure are explained well</b><br>The steps follow in the right order.</td><td><span class="ts">1:15</span> <b>Double-check one number</b><br>You say geysers reach 500 metres. Check this in your sources.</td></tr></tbody></table></div>
      <p><b>Assignment checklist:</b> ${Math.max(reqs().length - 1, 0)} of ${reqs().length} done</p>
      <div class="flag"><span class="pill warn" style="align-self:flex-start">Tone check: too harsh</span><label for="draft">Visualisation · next step<textarea id="draft" rows="2">The camera work is poor. The shaking from 0:30 to 0:55 makes it hard to watch.</textarea></label></div>
      <div class="row"><button class="btn small" data-act="q" data-k="geyser" data-v="Released" data-m="Your edited feedback was released to Team Geyser.">Save and release</button><button class="btn small ghost" data-act="say" data-v="Draft discarded. Write your own feedback.">Write my own</button></div></div>` : '';
  const ember = S.queue.ember === 'open' ? `<div class="card" style="border:2px solid var(--warn)"><div class="row between"><h2>Team Ember · version 1</h2><span class="pill warn">Urgent · safeguarding concern</span></div>
      <div class="saw" style="background:var(--bg)"><div>${frame(2, '1:22')}</div><div><b>Why you got this alert</b><br>At 1:22 a student says that older students hurt them on the way to school. This may need a caring adult, not feedback.<p class="fine" style="margin-top:6px">No AI feedback was written. Nobody at FrameUp sees this video. The team sees: "Your teacher will talk to you about your video."</p></div></div>
      <p class="fine">Follow your school's safeguarding protocol. You can pass this to your school's safeguarding contact.</p>
      <div class="row"><button class="btn small" data-act="q" data-k="ember" data-v="Passed on" data-m="Passed to your school's safeguarding contact.">Pass to the safeguarding contact</button><button class="btn small ghost" data-act="q" data-k="ember" data-v="With teacher" data-m="Marked: you will talk to Team Ember yourself.">I will handle it myself</button><button class="btn small ghost" data-act="q" data-k="ember" data-v="Released" data-m="Marked as no concern. Team Ember gets feedback in about two minutes.">No concern: send feedback</button></div></div>` : '';
  const ash = S.queue.ash === 'open' ? `<div class="card"><div class="row between"><h2>Team Ash · version 1</h2><span class="pill warn">Held by the safety check</span></div>
      <div class="saw" style="background:var(--bg)"><div>${frame(3, '0:48')}</div><div><b>Why it was held</b><br>Someone who is not in Team Ash is filmed from 0:48 to 0:55. The face is blurred, but please check that this person agreed to be filmed.<p class="fine" style="margin-top:6px">No AI feedback has been written. Only you see this, never FrameUp creators. The team sees: "Your coach needs a bit longer."</p></div></div>${escal(3)}
      <div class="row"><button class="btn small" data-act="q" data-k="ash" data-v="Released" data-m="Cleared. Team Ash gets feedback in about two minutes.">Clear and send feedback</button><button class="btn small ghost" data-act="q" data-k="ash" data-v="With teacher" data-m="Marked: you will talk to Team Ash first.">Talk to the team first</button><button class="btn small ghost" data-act="q" data-k="ash" data-v="Deleted" data-m="Video deleted.">Delete video</button></div></div>` : '';
  return `<div class="col">${head}${ember}${lava}${gey}${ash}${!ember && !lava && !gey && !ash ? `<div class="card"><h2>All clear</h2><p class="sub">Nothing is waiting for you. Videos only land here when a check holds them or you chose to approve each one.</p></div>` : ''}</div>`;
}
