interface P {
  className?: string;
}

export function HomeIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PoolIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M12 4v16M3 9h4M3 15h4M17 9h4M17 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ShirtIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M8 3 4 6l2 3 2-1v10h8V8l2 1 2-3-4-3-2 2H10L8 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 17l-5.3 2.6 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrophyIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M7 4h10v4a5 5 0 0 1-10 0V4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3M10 13.5V17m4-3.5V17M8 21h8M9 21v-1.5a3 3 0 0 1 6 0V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
