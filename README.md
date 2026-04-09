# Interactive Wall Calendar

A React component that brings the aesthetic of a physical wall calendar to the web. Built as a frontend engineering challenge submission.

## Features

**Core**
- Wall calendar design with binding holes, hero image, and month/year badge
- Date range selection — click a start date, then an end date to highlight a range with hover preview
- Integrated notes — monthly memos by default, switches to range-specific custom notes when a date range is selected
- Fully responsive — side-by-side layout on desktop, stacked on mobile with touch-friendly tap targets

**Extras**
- Page flip animation when navigating between months
- Holiday markers with tooltips (Indian and international holidays)
- Weekend highlighting
- Directional shadow for a realistic wall-mounted look

## Tech Stack

- React (with hooks)
- Vite
- Pure CSS-in-JS (no external UI libraries)

## Getting Started

```bash
# Clone the repo
git clone https://github.com/HimanshAhuja/Interactive_Calendar.git
cd Interactive_Calendar

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
src/
  App.jsx          — Renders the WallCalendar component
  WallCalendar.jsx — All calendar logic, state, and styling
```

Single-file component by design — no separate CSS files. All state is managed with React hooks (`useState`, `useMemo`, `useCallback`, `useRef`).

## Design Decisions

**Why CSS-in-JS instead of Tailwind or CSS modules?**
The component is self-contained. Inline styles keep everything in one file and make it easy to understand the relationship between logic and presentation without jumping between files.

**Why no external date library?**
The calendar grid logic is straightforward (first day offset, days in month). Adding a library like date-fns for this would be unnecessary overhead.

**Why notes are context-aware?**
When no range is selected, the notes area stores monthly memos. When a range is selected, it switches to range-specific notes. Both are stored independently so nothing gets overwritten.

**Responsive approach**
Desktop shows notes on the left, grid on the right. On mobile, the grid comes first (since picking dates is the primary action) and notes stack below. Day cells get larger padding on mobile for comfortable finger tapping.

## Browser Support

Tested on Chrome, Firefox, and Safari.
