import { DOODLES } from "./doodles";

/**
 * Фон из фирменных дудлов. Раскладка задана вручную, а не случайно: во-первых,
 * случайность ломала бы гидрацию, во-вторых, так видно, что знаки не наезжают
 * друг на друга и равномерно закрывают плитку.
 *
 * Плитка 460×460 повторяется, а весь слой медленно уползает ровно на одну
 * плитку — за счёт этого сдвиг незаметно зацикливается.
 */
const TILE = 460;

/** x, y внутри плитки, поворот в градусах и масштаб относительно 48px. */
const LAYOUT: [name: string, x: number, y: number, rotate: number, scale: number][] = [
  ["handset", 52, 46, -12, 1],
  ["bubble", 168, 96, 8, 0.85],
  ["chart", 286, 40, -6, 0.95],
  ["bell", 398, 104, 14, 0.8],
  ["wave", 96, 158, 6, 1.05],
  ["point", 214, 196, -10, 0.75],
  ["headset", 336, 168, 10, 0.95],
  ["clock", 436, 226, -8, 0.8],
  ["envelope", 40, 268, 12, 0.9],
  ["monitor", 156, 316, -6, 1],
  ["check", 268, 282, 16, 0.75],
  ["plane", 382, 328, -14, 0.9],
  ["coffee", 78, 402, -8, 0.85],
  ["tag", 200, 424, 10, 0.8],
  ["cursor", 314, 396, -12, 0.8],
  ["signal", 424, 430, 6, 0.9],
];

export function DoodlePattern({
  className,
  id = "dp-doodle-pattern",
}: {
  className?: string;
  id?: string;
}) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={id} width={TILE} height={TILE} patternUnits="userSpaceOnUse">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {LAYOUT.map(([name, x, y, rotate, scale]) => (
              <g key={`${name}-${x}-${y}`} transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
                {DOODLES[name]}
              </g>
            ))}
          </g>
        </pattern>
      </defs>

      {/* Полотно с запасом в плитку по каждой стороне: слой едет на 460px и
          возвращается в начало, поэтому у краёв никогда не появляется пустота. */}
      <g className="doodle-drift">
        <rect x={-TILE} y={-TILE} width="200%" height="200%" fill={`url(#${id})`} />
      </g>
    </svg>
  );
}
