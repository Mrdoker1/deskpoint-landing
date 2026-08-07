/**
 * Deskpoint lockup — вариант «Контурная D + точка» (раунд 3, thin).
 *
 * Знак: геометрическая D тонкой линией (родственна монограмме из раунда 1 —
 * та же контрформа, но контуром вместо заливки), внутри — коньячная точка.
 * Толщина штриха 4.5u на box 72u соразмерна штриху light-текста рядом.
 *
 * Цвета: контур — currentColor (наследует text-foreground), точка и «point» —
 * var(--dp-primary). Wordmark живым текстом, «Desk» + «point» в два цвета.
 *
 * Пропорции держатся на font-size (em), как в предыдущей версии лок-апа.
 * Предыдущие версии: ./logo-solid.tsx, ./logo-outline.tsx, figma-вариант в
 * истории git (node 8:566).
 */

const ACCENT = "var(--dp-primary)";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap font-logo font-light leading-none tracking-[-0.04em] ${className ?? ""}`}
      role="img"
      aria-label="Deskpoint"
    >
      <svg
        width="36"
        height="37"
        viewBox="0 0 70 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-[1.0037em] w-[0.9759em] shrink-0"
      >
        <path
          d="M 11 4 H 34 A 32 32 0 0 1 34 68 H 11 Q 4 68 4 61 V 11 Q 4 4 11 4 Z"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <circle cx="34" cy="36" r="7" fill={ACCENT} />
      </svg>
      <span aria-hidden="true" className="ml-[0.2376em]">
        Desk<span style={{ color: ACCENT }}>point</span>
      </span>
    </span>
  );
}
