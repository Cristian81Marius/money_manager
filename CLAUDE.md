# Project Rules — Money Manager

## Styling

- **Never place CSS or style objects inside component files.**
  All visual styling must live in a dedicated file:
  - Page components → `src/pages/<PageName>.css`
  - Shared / reusable styles → `src/styles/shared.css`
  - Color constants required by third-party JS APIs (e.g. Recharts `fill` props) → `src/styles/colors.js`
  - Global reset, CSS variables, keyframes → `src/index.css`

- No `style={{}}` attributes on HTML/JSX elements, and no inline style objects (`const fooStyle = { ... }`) inside component files.

- The only accepted exception: CSS **custom properties** set as data bridges, e.g. `style={{ '--bar-pct': `${pct}%` }}`, where the CSS file controls how the variable is consumed. Add a comment explaining why.

- Third-party library style props (e.g. Recharts `contentStyle`, `wrapperStyle`, `cursor`) must be extracted to named module-level constants at the top of the file with a comment stating they are library API parameters, not component styling.

## File & Naming Conventions

- File names and all code (variables, functions, comments, types) must be in **English**.
- Page files: `src/pages/PascalCase.jsx`
- Service files: `src/services/camelCase.ts` (TypeScript for type safety)
- Route paths use kebab-case English slugs: `/upload-statement`, `/add-transaction`, `/statistics`

## Internationalisation

- All user-visible strings must come from `src/i18n/translations.js` via the `useLanguage()` hook — no hardcoded UI text in components.
- Both `en` and `ro` keys must be kept in sync whenever a string is added or changed.

## Service Layer

- Every API call lives in `src/services/`.
- Each service file exports typed request/response interfaces and a mock implementation with the real `fetch` call commented out directly below, ready to activate.
- Mock implementations simulate realistic latency with `setTimeout`.

## Component Rules

- No `style={{}}` on HTML elements (see Styling above).
- Sub-components used only within one page live in the same `.jsx` file as that page.
- Logic and UI state stay in the component; all visual decisions belong in CSS.
