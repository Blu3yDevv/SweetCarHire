function DividerInk() {
  return (
    <svg viewBox="0 0 1600 72" preserveAspectRatio="none" fill="none">
      <path
        d="M0 37 C65 33 107 42 170 37 S278 32 336 37 S445 42 505 37 S614 32 674 37 S783 42 842 37 S950 32 1010 37 S1119 42 1178 37 S1287 32 1346 37 S1455 42 1515 37 S1570 35 1600 37"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".62"
      />
      <path
        d="M0 53 C100 49 155 58 255 53 S410 49 510 53 S665 58 765 53 S920 49 1020 53 S1175 58 1275 53 S1430 49 1530 53 S1580 53 1600 52"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="2 9"
        strokeLinecap="round"
        opacity=".34"
      />
      {[145, 405, 665, 925, 1185, 1445].map((x) => (
        <g key={x} transform={`translate(${x} 0)`} stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" opacity=".68">
          <path d="M0 40 C0 33 -1 29 -4 25 M0 34 C2 28 5 25 9 23 M0 34 C-5 29 -9 27 -13 27 M0 34 C4 31 8 31 12 32 M0 34 C-3 32 -6 32 -9 34" />
          <path d="M-5 42 Q0 40 5 42" />
        </g>
      ))}
    </svg>
  )
}

export function IslandDivider({ topDark = false, bottomDark = false }: { topDark?: boolean; bottomDark?: boolean }) {
  return (
    <div className="island-divider" aria-hidden="true">
      <div className={`island-divider-half island-divider-top ${topDark ? "island-ink-light" : "island-ink-dark"}`}>
        <DividerInk />
      </div>
      <div className={`island-divider-half island-divider-bottom ${bottomDark ? "island-ink-light" : "island-ink-dark"}`}>
        <DividerInk />
      </div>
    </div>
  )
}
