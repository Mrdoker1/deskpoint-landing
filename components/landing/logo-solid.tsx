/**
 * Deskpoint lockup, solid variant — Figma node 1:163.
 * Kept as an alternative to the outline lockup in ./logo.tsx.
 *
 * The mark is the untouched SVG export of node 1:164; the wordmark is live text,
 * as it is in the design (Instrument Sans Bold, 66px, tracking -2.64px = -0.04em).
 * Both colours are bound to the tokens they were picked from: #402718 ->
 * currentColor (inherits `text-foreground`) and #74452C -> --dp-primary.
 *
 * Sized by font-size, mirroring the design's proportions at 66px:
 * mark 68px (1.0303em), gap to the wordmark 16.77px (0.2541em).
 *
 */

const ACCENT = "var(--dp-primary)";

export function LogoSolid({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap font-logo font-bold leading-none tracking-[-0.04em] ${className ?? ""}`}
      role="img"
      aria-label="Deskpoint"
    >
      <svg
        width="68"
        height="68"
        viewBox="0 0 68 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-[1.0303em] w-[1.0303em] shrink-0"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7 0H34C43.0174 0 51.6654 3.58213 58.0416 9.95837C64.4179 16.3346 68 24.9826 68 34C68 43.0174 64.4179 51.6654 58.0416 58.0416C51.6654 64.4179 43.0174 68 34 68H7C2.33333 68 0 65.6667 0 61V7C0 2.33333 2.33333 0 7 0ZM34 15C28.9609 15 24.1282 17.0018 20.565 20.565C17.0018 24.1282 15 28.9609 15 34C15 39.0391 17.0018 43.8718 20.565 47.435C24.1282 50.9982 28.9609 53 34 53C39.0391 53 43.8718 50.9982 47.435 47.435C50.9982 43.8718 53 39.0391 53 34C53 28.9609 50.9982 24.1282 47.435 20.565C43.8718 17.0018 39.0391 15 34 15Z"
          fill="currentColor"
        />
        <path
          d="M34 43C38.9706 43 43 38.9706 43 34C43 29.0294 38.9706 25 34 25C29.0294 25 25 29.0294 25 34C25 38.9706 29.0294 43 34 43Z"
          fill={ACCENT}
        />
      </svg>
      <span aria-hidden="true" className="ml-[0.2541em]">
        Desk
        <span style={{ color: ACCENT }}>point</span>
      </span>
    </span>
  );
}
