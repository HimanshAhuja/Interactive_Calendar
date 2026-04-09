import { useState, useCallback, useMemo, useEffect, useRef } from "react";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const HERO_IMG = "https://static.vecteezy.com/system/resources/thumbnails/046/624/895/small_2x/close-up-of-a-tiger-in-the-jungle-portrait-of-a-tiger-tiger-in-the-forest-photo.jpg";

const HOLIDAYS = {
  "1-1": "New Year's Day",
  "1-15": "Pongal",
  "1-26": "Republic Day",
  "3-29": "Holi",
  "4-14": "Tamil New Year",
  "5-1": "May Day",
  "8-15": "Independence Day",
  "9-5": "Teachers' Day",
  "10-2": "Gandhi Jayanti",
  "10-12": "Dussehra",
  "10-31": "Halloween",
  "11-1": "Diwali",
  "12-25": "Christmas",
};

function getMonthData(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const mondayOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const weeks = [];
  let day = 1 - mondayOffset;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      if (day < 1) {
        week.push({ day: daysInPrevMonth + day, current: false });
      } else if (day > daysInMonth) {
        week.push({ day: day - daysInMonth, current: false });
      } else {
        week.push({ day, current: true });
      }
      day++;
    }
    if (w === 5 && !week.some(d => d.current)) break;
    weeks.push(week);
  }
  return weeks;
}

function dateKey(y, m, d) { return `${y}-${m}-${d}`; }

const GREEN = "#3a7d44";
const GREEN_DARK = "#2c5e33";
const GREEN_LIGHT = "rgba(58,125,68,0.12)";
const GREEN_RANGE = "rgba(58,125,68,0.18)";
const GREEN_SOFT = "rgba(58,125,68,0.06)";
const WALL_BG = "#a4b07a";
const PAPER = "#fff";
const TEXT = "#2d2d2d";
const TEXT_MUTED = "#888";
const GRID_BORDER = "#e4e0d5";
const NOTE_BG = "#f7f5ee";
const HOLIDAY_DOT = "#e67e22";

export default function WallCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [notes, setNotes] = useState({});
  const [monthNotes, setMonthNotes] = useState({});
  const [flipPhase, setFlipPhase] = useState("idle");
  const [pendingDir, setPendingDir] = useState(null);
  const timerRef = useRef(null);

  const weeks = useMemo(() => getMonthData(year, month), [year, month]);

  const navigateMonth = useCallback((dir) => {
    if (flipPhase !== "idle") return;
    setPendingDir(dir);
    setFlipPhase("exit");

    timerRef.current = setTimeout(() => {
      if (dir === 1) {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
      } else {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
      }
      setRangeStart(null);
      setRangeEnd(null);
      setHoverDate(null);
      setFlipPhase("enter");

      setTimeout(() => {
        setFlipPhase("idle");
        setPendingDir(null);
      }, 450);
    }, 400);
  }, [month, flipPhase]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleDayClick = (day, isCurrent) => {
    if (!isCurrent) return;
    const dk = dateKey(year, month, day);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(dk);
      setRangeEnd(null);
    } else {
      const sDay = parseInt(rangeStart.split("-")[2]);
      if (day >= sDay) setRangeEnd(dk);
      else { setRangeEnd(rangeStart); setRangeStart(dk); }
    }
  };

  const isInRange = (day) => {
    if (!rangeStart) return false;
    const end = rangeEnd || hoverDate;
    if (!end) return false;
    const sDay = parseInt(rangeStart.split("-")[2]);
    const eDay = parseInt(end.split("-")[2]);
    const lo = Math.min(sDay, eDay), hi = Math.max(sDay, eDay);
    return day >= lo && day <= hi;
  };

  const rangeLabel = rangeStart
    ? rangeEnd
      ? `${rangeStart.split("-")[2]} – ${rangeEnd.split("-")[2]} ${MONTH_NAMES[month]}`
      : `${rangeStart.split("-")[2]} ${MONTH_NAMES[month]} (select end)`
    : null;

  const noteKey = rangeStart && rangeEnd ? `${rangeStart}_${rangeEnd}` : `month_${year}_${month}`;
  const currentNote = rangeStart && rangeEnd
    ? (notes[noteKey] || "")
    : (monthNotes[`${year}-${month}`] || "");

  const setCurrentNote = (val) => {
    if (rangeStart && rangeEnd) setNotes(n => ({ ...n, [noteKey]: val }));
    else setMonthNotes(n => ({ ...n, [`${year}-${month}`]: val }));
  };

  const flipAnim = flipPhase === "exit"
    ? "calFlipExit 0.4s cubic-bezier(0.4, 0.0, 1, 1) forwards"
    : flipPhase === "enter"
    ? "calFlipEnter 0.45s cubic-bezier(0.0, 0.0, 0.2, 1) forwards"
    : "calFadeIn 0.4s ease-out";

  return (
    <div style={{
      minHeight: "100vh",
      background: WALL_BG,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Crimson Text', 'Georgia', serif",
      boxSizing: "border-box",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Bebas+Neue&family=Source+Sans+Pro:wght@300;400;600&display=swap" rel="stylesheet" />
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          background: ${WALL_BG};
          min-height: 100vh;
          width: 100%;
          border: none;
          outline: none;
          overflow-x: hidden;
        }
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes calFlipExit {
          0%   { transform: perspective(1400px) rotateX(0deg);   opacity: 1; }
          40%  { opacity: 1; }
          100% { transform: perspective(1400px) rotateX(-92deg); opacity: 0; }
        }
        @keyframes calFlipEnter {
          0%   { transform: perspective(1400px) rotateX(88deg);  opacity: 0; }
          30%  { opacity: 0.5; }
          100% { transform: perspective(1400px) rotateX(0deg);   opacity: 1; }
        }
        @keyframes calFadeIn {
          0%   { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        .cal-day-cell {
          transition: background 0.15s ease;
          cursor: pointer;
        }
        .cal-day-cell:hover {
          background: ${GREEN_LIGHT} !important;
        }
        .note-textarea:focus {
          outline: none;
          border-color: ${GREEN} !important;
          box-shadow: 0 0 0 2px ${GREEN_LIGHT} !important;
        }
        .month-nav-btn {
          transition: all 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
        }
        .month-nav-btn:hover {
          transform: scale(1.12);
          color: ${GREEN} !important;
        }

        /* Tablet */
        @media (max-width: 900px) {
          .hero-section { height: 280px !important; }
          .notes-panel { min-width: 180px !important; width: 180px !important; }
        }

        /* Mobile */
        @media (max-width: 680px) {
          .cal-main-layout { flex-direction: column !important; }
          .notes-panel {
            width: 100% !important;
            min-width: unset !important;
            border-right: none !important;
            border-top: 1px solid ${GRID_BORDER} !important;
            order: 2 !important;
            padding: 16px !important;
          }
          .grid-section {
            padding: 12px 14px 18px !important;
            order: 1 !important;
          }
          .hero-section { height: 200px !important; }
          .spiral-row { gap: 10px !important; padding: 6px 12px !important; }
          .spiral-row > div { width: 9px !important; height: 9px !important; }
          .cal-day-cell { padding: 10px 4px !important; font-size: 17px !important; }
          .month-nav-btn { padding: 8px 18px !important; font-size: 26px !important; }
          .cal-outer-wrap { padding: 12px !important; }
        }

        /* Extra small */
        @media (max-width: 400px) {
          .hero-section { height: 160px !important; }
          .month-badge { padding: 10px 18px !important; }
          .month-badge-year { font-size: 14px !important; }
          .month-badge-month { font-size: 24px !important; }
        }
      `}</style>

      <div className="cal-outer-wrap" style={{ width: "100%", maxWidth: 960, margin: "0 auto" }}>

        {/* Calendar card */}
        <div style={{
          background: PAPER,
          borderRadius: 6,
          boxShadow: "-10px 0 22px rgba(0,0,0,0.28), -4px 0 8px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
          animation: flipAnim,
          transformOrigin: "top center",
        }}>

          {/* Binding circles */}
          <div className="spiral-row" style={{
            display: "flex", justifyContent: "center", gap: 20,
            padding: "10px 28px",
            background: "#f0ede4",
          }}>
            {Array.from({ length: 22 }).map((_, i) => (
              <div key={i} style={{
                width: 12, height: 12, borderRadius: "50%",
                background: WALL_BG,
              }} />
            ))}
          </div>

          {/* Hero image */}
          <div className="hero-section" style={{
            position: "relative",
            height: 360,
            overflow: "hidden",
            background: "#1a2a12",
          }}>
            <img
              src={HERO_IMG}
              alt={MONTH_NAMES[month]}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            {/* Month/Year badge */}
            <div className="month-badge" style={{
              position: "absolute", bottom: 0, right: 0,
              padding: "18px 36px",
              background: "linear-gradient(135deg, rgba(58,125,68,0.88), rgba(44,94,51,0.78))",
              backdropFilter: "blur(6px)",
              borderTopLeftRadius: 12,
            }}>
              <div className="month-badge-year" style={{
                fontFamily: "'Bebas Neue', sans-serif",
                color: "rgba(255,255,255,0.75)",
                fontSize: 22, letterSpacing: 4, lineHeight: 1,
              }}>{year}</div>
              <div className="month-badge-month" style={{
                fontFamily: "'Bebas Neue', sans-serif",
                color: "#fff",
                fontSize: 42, letterSpacing: 6, lineHeight: 1.1,
                textTransform: "uppercase",
              }}>{MONTH_NAMES[month]}</div>
            </div>
          </div>

          {/* Navigation bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 24px", borderBottom: `1px solid ${GRID_BORDER}`,
          }}>
            <button className="month-nav-btn" onClick={() => navigateMonth(-1)}
              style={{ fontSize: 24, color: TEXT, padding: "6px 16px", borderRadius: 4 }}>◂</button>
            <div style={{
              fontFamily: "'Source Sans Pro', sans-serif",
              fontWeight: 600, fontSize: 15, color: TEXT_MUTED,
              letterSpacing: 1.5, textTransform: "uppercase",
            }}>{MONTH_NAMES[month]} {year}</div>
            <button className="month-nav-btn" onClick={() => navigateMonth(1)}
              style={{ fontSize: 24, color: TEXT, padding: "6px 16px", borderRadius: 4 }}>▸</button>
          </div>

          {/* Body: Notes LEFT  |  Grid RIGHT */}
          <div className="cal-main-layout" style={{ display: "flex", flexDirection: "row" }}>

            {/* ---- NOTES (left) ---- */}
            <div className="notes-panel" style={{
              minWidth: 220, width: 220,
              borderRight: `1px solid ${GRID_BORDER}`,
              padding: "16px 18px",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{
                fontFamily: "'Source Sans Pro', sans-serif",
                fontSize: 12, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: 1.5,
                color: GREEN_DARK, marginBottom: 8,
              }}>
                {rangeStart && rangeEnd ? "Range Notes" : "Notes"}
              </div>

              <textarea
                className="note-textarea"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder={rangeStart && rangeEnd ? "Notes for selected dates..." : "Monthly memos..."}
                style={{
                  flex: 1, minHeight: 200,
                  background: NOTE_BG, border: `1px solid ${GRID_BORDER}`,
                  borderRadius: 6, padding: 14,
                  fontFamily: "'Crimson Text', Georgia, serif",
                  fontSize: 15, color: TEXT, resize: "none", lineHeight: 1.7,
                  transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                }}
              />

              {rangeLabel && (
                <div style={{
                  marginTop: 10, padding: "7px 12px",
                  background: GREEN_LIGHT, borderRadius: 6,
                  fontFamily: "'Source Sans Pro', sans-serif",
                  fontSize: 12, color: GREEN_DARK, fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span style={{ fontSize: 14 }}>📅</span> {rangeLabel}
                </div>
              )}

              {rangeStart && rangeEnd && (
                <button
                  onClick={() => { setRangeStart(null); setRangeEnd(null); }}
                  style={{
                    marginTop: 6, padding: "7px 12px",
                    background: GREEN_SOFT, border: `1px solid ${GRID_BORDER}`,
                    borderRadius: 6, fontFamily: "'Source Sans Pro', sans-serif",
                    fontSize: 12, color: TEXT_MUTED, cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = GREEN_LIGHT}
                  onMouseLeave={e => e.currentTarget.style.background = GREEN_SOFT}
                >
                  Clear Selection
                </button>
              )}
            </div>

            {/* ---- GRID (right) ---- */}
            <div className="grid-section" style={{ flex: 1, padding: "14px 24px 24px" }}>
              {/* Day headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
                {DAY_LABELS.map((d, i) => (
                  <div key={d} style={{
                    textAlign: "center",
                    fontFamily: "'Source Sans Pro', sans-serif",
                    fontSize: 13, fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: 1.2,
                    padding: "6px 0",
                    color: i >= 5 ? GREEN : TEXT_MUTED,
                  }}>{d}</div>
                ))}
              </div>

              {/* Weeks */}
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                  {week.map((cell, di) => {
                    const dk = dateKey(year, month, cell.day);
                    const isStart = dk === rangeStart && cell.current;
                    const isEnd = dk === rangeEnd && cell.current;
                    const inRange = cell.current && isInRange(cell.day);
                    const isWeekend = di >= 5;
                    const isToday = cell.current
                      && cell.day === today.getDate()
                      && month === today.getMonth()
                      && year === today.getFullYear();
                    const holidayKey = `${month + 1}-${cell.day}`;
                    const holiday = cell.current ? HOLIDAYS[holidayKey] : null;

                    return (
                      <div
                        key={di}
                        className={cell.current ? "cal-day-cell" : ""}
                        onClick={() => handleDayClick(cell.day, cell.current)}
                        onMouseEnter={() => {
                          if (cell.current && rangeStart && !rangeEnd) setHoverDate(dk);
                        }}
                        onMouseLeave={() => setHoverDate(null)}
                        title={holiday || ""}
                        style={{
                          position: "relative",
                          textAlign: "center",
                          padding: "12px 4px",
                          borderRadius: 8,
                          fontFamily: "'Crimson Text', Georgia, serif",
                          fontSize: 18,
                          fontWeight: (isStart || isEnd) ? 700 : 400,
                          color: !cell.current ? "#d0d0c8"
                            : (isStart || isEnd) ? "#fff"
                            : isWeekend ? GREEN
                            : TEXT,
                          background: (isStart || isEnd) ? GREEN
                            : inRange ? GREEN_RANGE
                            : isToday ? GREEN_LIGHT
                            : "transparent",
                          cursor: cell.current ? "pointer" : "default",
                          userSelect: "none",
                        }}
                      >
                        {cell.day}
                        {holiday && (
                          <div style={{
                            position: "absolute", bottom: 3, left: "50%",
                            transform: "translateX(-50%)",
                            width: 5, height: 5, borderRadius: "50%",
                            background: HOLIDAY_DOT,
                          }} />
                        )}
                        {isToday && !isStart && !isEnd && !holiday && (
                          <div style={{
                            position: "absolute", bottom: 3, left: "50%",
                            transform: "translateX(-50%)",
                            width: 5, height: 5, borderRadius: "50%",
                            background: GREEN,
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Legend */}
              <div style={{
                display: "flex", gap: 18, marginTop: 14, flexWrap: "wrap",
                fontFamily: "'Source Sans Pro', sans-serif", fontSize: 12, color: TEXT_MUTED,
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: GREEN, display: "inline-block" }} />
                  Today
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: GREEN_RANGE, border: `1px solid ${GREEN}`, display: "inline-block" }} />
                  Selected
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: HOLIDAY_DOT, display: "inline-block" }} />
                  Holiday
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Wall shadow beneath — left-biased */}
        <div style={{
          height: 16,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.07), transparent)",
          borderRadius: "0 0 10px 10px",
          marginTop: -1,
          marginLeft: -4,
          marginRight: 6,
        }} />
      </div>
    </div>
  );
}
