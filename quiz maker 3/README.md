# ChalkQuiz — Online Quiz Maker

CodSoft Web Development Internship — **Level 2, Task 2**

A quiz platform where users can sign up, write their own multiple-choice
quizzes, browse quizzes other people made, take them one question at a
time, and see a scored review at the end.

## Features (mapped to the task brief, plus extras)

- **Home Page** — welcome message, quick links to create or take a quiz, a strip of your recent scores, and an achievements shelf.
- **Quiz Creation** — title, category, difficulty, an optional per-question time limit, and as many questions as you like, each with 4 options and a marked correct answer.
- **Quiz Taking** — one question per screen with **instant feedback**: pick an answer and it's immediately marked right or wrong (correct answer always highlighted), progress dots, an optional countdown timer that locks the question and auto-advances when time runs out, back/next navigation.
- **Quiz Results** — percentage "stamp," score line, confetti for a strong score (80%+), a full review of every question, a **retake button**, and a **downloadable result card** (PNG) for sharing on LinkedIn.
- **Quiz Listing** — searchable, filterable (by category and difficulty) grid of all published quizzes, with a delete option for quizzes you created.
- **Leaderboard** — top-10 board per quiz (best attempt per player), reachable from any quiz card or straight from your results screen.
- **Achievements** — five badges (First Steps, Perfectionist, Quiz Master, On a Roll, Explorer) that unlock as you take more quizzes.
- **Sound effects** — a short chime for correct/incorrect answers, with a mute toggle next to the theme switch.
- **Keyboard shortcuts** — while taking a quiz, press 1–4 to answer and Enter to continue.
- **User Authentication** — sign up / log in, session persists across page reloads.
- **Light/dark theme toggle** — button next to your username in the top bar; your choice is remembered.
- **Mobile Responsive** — single-column layouts and adjusted type scale under 640px.

## Sample content

Five quizzes are seeded automatically the first time the app runs with no
data in storage, spanning every category and difficulty so Browse's
filters have something to show off immediately:

| Quiz | Category | Difficulty |
|---|---|---|
| Web Development Basics | Web Development | Easy |
| World Geography Quickfire | Geography | Medium |
| Basic Mathematics | Mathematics | Easy |
| Indian History Highlights | History | Medium |
| Science Trivia | Science | Hard |

Delete them once you've recorded your demo, or leave them as filler.

## Tech

Plain HTML, CSS, and JavaScript — no build step, no framework, no backend.
Data (accounts, quizzes, results) is stored in the browser's `localStorage`.
That keeps it deployable on any static host in one click, which is the
right trade-off for this task since it doesn't call for a specific stack.
The result card is drawn with the Canvas API, so there's no external image
library either.

**Note on auth:** this is a client-side demo account system for a static
site — good for showing the feature and grading yourself locally, but
passwords aren't hashed or sent anywhere. Don't reuse a real password here.

**Note on the leaderboard:** it's built from everyone's saved results in
the same browser's `localStorage`. Since there's no shared backend, it
reflects attempts made on that one device/browser — great for a demo,
but it won't sync across different computers.

## Running it locally

No install needed. Just open `index.html` in a browser, or serve the
folder with any static server, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Deploying (for your submission video/link)

Any static host works since it's just a handful of files:

- **GitHub Pages**: push this folder to a repo, then Settings → Pages →
  deploy from the `main` branch.
- **Netlify**: drag the `quiz-maker` folder onto https://app.netlify.com/drop.

## Submitting to CodSoft

1. Push this folder into your `CODSOFT` GitHub repo (e.g. as a
   `web-development-quiz-maker` subfolder).
2. Deploy it (GitHub Pages or Netlify both work) and grab the live link.
3. Record a short screen-capture demoing: sign up, browse and filter,
   take a timed quiz (watch the instant right/wrong feedback), check
   the leaderboard and your unlocked achievements, then download your
   result card.
4. Post the video on LinkedIn, tag CodSoft, and add `#codsoft
   #internship #webdevelopment`.
5. Fill out the task submission form with your GitHub repo link and the
   live demo link once CodSoft emails it to you.
