# TestRPG

TestRPG is a small RPG-styled web app meant to be automated through a Test Automation Framework like [Playwright](https://playwright.dev/) or [Cypress](https://www.cypress.io/). This is the React + Vite + TypeScript rebuild of the [original TestCoders/testrpg](https://github.com/TestCoders/testrpg) project, used as a test automation casus at TestCoders Noord.

## Stack

- React 18 with TypeScript
- Vite as the build tool and dev server
- Tailwind CSS with shadcn/ui primitives on top of Radix UI
- Zustand for state management, React Hook Form with Zod for form handling
- React Router for client-side routing
- Express for the local API server (port 3001), proxied through Vite in dev

## Getting started

Make sure you have Node 18+ and pnpm installed. If pnpm is missing, run `corepack enable pnpm`.

```bash
pnpm install
pnpm dev
```

The dev server runs on [http://localhost:3000](http://localhost:3000). The API server runs on [http://localhost:3001](http://localhost:3001). Vite proxies all `/api/*` requests automatically, so you can test both the UI and the API endpoints from port 3000.

Other scripts:

- `pnpm build`, type-checks the project and produces a production build in `dist/`
- `pnpm preview`, serves the production build locally
- `pnpm typecheck`, runs `tsc --noEmit` without emitting files

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page with intro and links to `/play` and the API endpoint overview |
| `/play` | Create a character, choose a build, complete the four tasks to level up |
| `/api` | Documentation page for the API endpoints |

## API endpoints

The serverless functions live in `api/` and are deployed by Vercel alongside the static frontend.

### `GET /api/builds`

Returns all builds as a JSON object keyed by name.

```
GET /api/builds
GET /api/builds?build=thief
```

| Status | Condition |
|--------|-----------|
| 200 | Success — returns one or all builds |
| 404 | Unknown `build` query parameter value |

### `POST /api/builds`

Creates a new custom build. Custom builds are held in memory and reset on cold start — intentional for the test casus.

```json
{
  "build": {
    "name": "string",
    "strength": "number",
    "agility": "number",
    "wisdom": "number",
    "magic": "number"
  }
}
```

Constraints: `name` must be unique (case-insensitive). Each stat must be a non-negative integer ≤ 10. The sum of all four stats cannot exceed 10.

| Status | Condition |
|--------|-----------|
| 201 | Build created — returns `{ build: { ... } }` |
| 400 | Invalid body or constraint violation |
| 409 | Name already taken |

## Acceptance criteria for /play

These are the rules the test automation casus is built around:

- Character name has to be at least 3 characters and at most 20 characters.
- Changing the character build type changes the stats (strength, agility, wisdom, magic).
- Clicking the click-task button 5 times levels up the character and shows a confirmation message.
- Selecting a file in the upload-task levels up the character and shows a confirmation message.
- Typing `Lorem Ipsum` in the typer-task levels up the character and shows a confirmation message.
- Moving the slider all the way to the right levels up the character and shows a confirmation message.
- After completing each task, the related input is set to disabled.

### Bonus

- Easter egg: typing `all your base are belong to us` in the typer-task before completing it activates berserk mode, which makes every subsequent level-up max out the stats.

## Test automation hooks

Every interactive element on the page has a `data-testid` attribute. The naming convention is kebab-case and describes what the element does, not where it lives.

| `data-testid` | Element |
|---------------|---------|
| `site-header` | The sticky header bar |
| `home-link` | TestRPG logo link in the header |
| `api-link` | API link in the header |
| `login-button` | Login button in the header (when logged out) |
| `logout-button` | Logout button in the header (when logged in) |
| `login-dialog` | The login dialog content |
| `login-email-input` | Email input inside the login dialog |
| `login-password-input` | Password input inside the login dialog |
| `login-submit-button` | Submit button inside the login dialog |
| `testcoders-link` | TestCoders logo link in the header |
| `hero` | Page hero section on `/` and `/api` |
| `links` | The CTA buttons on the home page |
| `play-link` | "Click here to play" button |
| `github-link` | "View on Github" link |
| `api-intro-link` | "View api endpoints" link in the home intro |
| `character-card` | The character display card |
| `character-name` | Character name in the card title |
| `character-description` | Level + build description in the card |
| `character-image` | Character sprite container |
| `character-stats` | Stats section of the character card |
| `character-form-card` | Card containing the character creation form |
| `character-name-input` | Name input |
| `character-build-select` | Build dropdown trigger |
| `character-start-button` | Submit button on the character form |
| `adventure-container` | Card holding all four tasks |
| `adventure-clicker` | Click task section |
| `clicker-button` | Click task button |
| `adventure-uploader` | Upload task section |
| `uploader-input` | Upload task file input |
| `adventure-typer` | Typer task section |
| `typer-input` | Typer task text input |
| `adventure-slider` | Slider task section |
| `slider-input` | Slider task slider |
| `max-level-message` | Confirmation that the character has reached max level |
| `play-again-button` | Reset button after reaching max level |
| `api-explainer` | Each endpoint card on `/api` |
| `copy-curl-button` | Copy-to-clipboard button on the GET endpoint card |

In addition, the level/stats progress bars are tagged with `data-character-stats="<label>"` and the task confirmation labels with `data-task="<task>"` for tests that need to assert against a specific stat or task.

## Deployment

The project includes a `vercel.json` with SPA rewrites so that React Router routes resolve correctly when deep-linking on Vercel.

```bash
pnpm build
```

The output in `dist/` can be deployed as a static site to Vercel, Netlify, GitHub Pages, or any static host.

## Credits

Character sprites by [Redshrike](https://opengameart.org/content/first-person-dungeon-crawl-protagonist) on opengameart.org.
