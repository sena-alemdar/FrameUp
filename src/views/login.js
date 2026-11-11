// Login screen for teachers and admins.
import { $ } from '../state.js';

export const WHO = { teacher: ['Ms Keller', 'm.keller@lindenschule.example', 'Teacher · sees only her own classes'], admin: ['Jonas', 'jonas@frameup.example', 'Admin · FrameUp staff'] };
export function login(role) {
  const w = WHO[role];
  return `<div class="col narrow"><h1>${role === 'teacher' ? 'Teacher login' : 'Admin login'}</h1>
    <div class="card"><label for="mail">Email<input type="text" id="mail" value="${w[1]}"></label>
      <label for="pw">Password<input type="password" id="pw" value="demo-password"></label>
      <button class="btn" data-act="auth" data-v="3">Log in</button>
      <p class="fine">${role === 'teacher' ? 'Teachers get their account from the school. Students never need one: they join with a class code.' : 'Admin accounts are for FrameUp staff only. Admins change settings and never see student videos.'}</p></div></div>`;
}
