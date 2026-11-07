import Link from "next/link";
export function HookyMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 5h7v9h8V5h7v22h-7v-9h-8v9H5V5Z" fill="currentColor" />
      <path d="m14 3 4 0-2 26h-4L14 3Z" fill="var(--hooky-bg)" />
    </svg>
  );
}
export function Brand({ studio = false }: { studio?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="Hooky home">
      <span className="brand-symbol">
        <HookyMark />
      </span>
      <span>
        hooky<span className="brand-period">.</span>
      </span>
      {studio && <span className="brand-studio">studio</span>}
    </Link>
  );
}
