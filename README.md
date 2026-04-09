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

## Browser Support

Tested on Chrome, Firefox, and Safari.
