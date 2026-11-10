# FrameUp prototype

Clickable front-end prototype of an AI feedback coach for student videos. It shows what students, teachers and admins would see. There is no backend: nothing is uploaded, no AI is called, and all feedback is example data that resets on reload.

## Run it

```
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

`npm run build` creates a static site in `dist/` that can be hosted anywhere, for example on GitHub Pages.

## What it shows

- **Student:** join with a class code, see assigned projects, upload a video, read feedback per version with an assignment checklist.
- **Teacher:** set up an assignment (task, requirements, criteria, shape of the feedback, who releases it), see every team, review AI drafts.
- **Admin:** coach settings that fill the AI's instructions, a test run before publishing, cost and health.

## Structure

```
index.html            page shell
src/main.js           entry point: rendering and event handling
src/state.js          in-memory state and labels
src/data.js           example feedback, checklist results, pipeline steps
src/helpers.js        shared helpers
src/styles.css        all styling
src/views/student.js  student screens
src/views/teacher.js  teacher screens
src/views/admin.js    admin screens
src/views/login.js    staff login
```
