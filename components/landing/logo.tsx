/**
 * Deskpoint lockup — вариант «Контурная D + узел» (знак из Figma, node 12:112 — знак 12:99 + wordmark).
 *
 * Знак: геометрия ровно из экспорта — контур D штрихом 1.7 на box 49.4×52,
 * внутри перекрестье из четырёх линий 0.5 с точками на концах и узлом в центре.
 * Цвета привязаны к токенам: контур — currentColor (наследует text-foreground),
 * линии, точки и «point» — var(--dp-primary) (в макете #7D4227).
 *
 * Wordmark живым текстом, «Desk» + «point» в два цвета.
 *
 * Пропорции держатся на font-size (em), ровно как в макете при кегле 37.876:
 * знак 49.4×52 (1.3043 × 1.3729em) во всю высоту текстового бокса, зазор до
 * слова 13px (0.3432em), tracking -1.5151px (-0.04em). Предыдущие версии: ./logo-solid.tsx,
 * ./logo-outline.tsx, знак node 8:566 — в истории git.
 */

import type { CSSProperties } from "react";

const ACCENT = "var(--dp-primary)";

/**
 * Толщина линий перекрестья, юниты box 49.4×52. 0.5 — как в макете; при высоте
 * знака 22px это 0.28 css-px, то есть тоньше пикселя и на обычном экране
 * перекрестье почти пропадает. Поднимите до ~1, если нужно, чтобы оно держалось
 * в шапке (у контура D для сравнения 1.7).
 */
const HAIRLINE = 0.5;

/** Толщина контура D, юниты box 49.4×52. В макете 1.7 — здесь чуть плотнее. */
const OUTLINE = 2.2;

/**
 * Экспорт нарисован впритык: при штрихе 1.7 внешний край контура ложится ровно
 * на границы бокса 49.4×52. Любое утолщение вылезает наружу и обрезается, потому
 * что svg по умолчанию обрезает всё за viewBox. Добавляем ровно половину
 * прибавки с каждой стороны и на столько же увеличиваем размер в em — сама
 * буква на экране остаётся прежнего размера, вокруг неё просто появляется запас.
 */
const BOX_W = 49.4;
const BOX_H = 52;
// Половина прибавки к штриху + 1 юнит воздуха: край обводки не должен лежать
// ровно на границе viewBox, иначе на мелком размере низ буквы растеризуется
// срезанным.
const PAD = (OUTLINE - 1.7) / 2 + 1;
const VIEW_BOX = `${-PAD} ${-PAD} ${BOX_W + PAD * 2} ${BOX_H + PAD * 2}`;
const EM_W = (1.3043 * (BOX_W + PAD * 2)) / BOX_W;
const EM_H = (1.3729 * (BOX_H + PAD * 2)) / BOX_H;
// Зазор в макете — 13 юнитов от края буквы; из них PAD уже занят запасом внутри
// svg, поэтому отступ уменьшаем на столько же.
const EM_GAP = (13 - PAD) / 37.876;

/**
 * Только знак, без слова. Размер задаётся классом (`h-*`/`w-*`), цвет контура —
 * currentColor. Акцент можно переопределить: на тёмном фоне коньячный
 * --dp-primary почти сливается, и его осветляют на месте.
 */
export function LogoMark({
  className,
  style,
  accent = ACCENT,
}: {
  className?: string;
  style?: CSSProperties;
  accent?: string;
}) {
  return (
    <svg
      width={BOX_W + PAD * 2}
      height={BOX_H + PAD * 2}
      viewBox={VIEW_BOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        d="M7.12109 26.25L42.5918 26.25"
        stroke={accent}
        strokeWidth={HAIRLINE}
      />
      <path
        d="M23.2246 7.3125L23.2246 44.9751"
        stroke={accent}
        strokeWidth={HAIRLINE}
      />
      <path
        d="M5.27637 0.849609H23.7715C30.3391 0.849624 36.6402 3.49676 41.2881 8.21191C45.9364 12.9275 48.5498 19.3259 48.5498 26C48.5498 32.6741 45.9364 39.0725 41.2881 43.7881C36.6402 48.5032 30.3391 51.1504 23.7715 51.1504H5.27637C3.65203 51.1504 2.58906 50.7391 1.9248 50.0654C1.25839 49.3894 0.849676 48.3036 0.849609 46.6475V5.35254C0.849675 3.69642 1.25839 2.61065 1.9248 1.93457C2.58906 1.26092 3.65203 0.849627 5.27637 0.849609Z"
        stroke="currentColor"
        strokeWidth={OUTLINE}
        // Стык нижней прямой с дугой чаши — пологий угол: при miter (по
        // умолчанию) шип упирается в stroke-miterlimit и браузер срезает его
        // фаской, из-за чего низ буквы выглядит обрубленным. Скругляем.
        strokeLinejoin="round"
      />
      <circle cx="14.3308" cy="35.1748" r="1.57214" fill={accent} />
      <circle cx="31.7771" cy="17.4211" r="1.57214" fill={accent} />
      <path
        d="M14.3311 35.1748L32.1178 17.388"
        stroke={accent}
        strokeWidth={HAIRLINE}
      />
      <circle cx="14.3311" cy="17.4211" r="1.57214" fill={accent} />
      <circle cx="32.1182" cy="35.1748" r="1.57214" fill={accent} />
      <path
        d="M14.3311 17.3882L32.1178 35.1749"
        stroke={accent}
        strokeWidth={HAIRLINE}
      />
      <circle cx="23.225" cy="26.2814" r="3.06291" fill={accent} />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap font-logo font-light leading-none tracking-[-0.04em] ${className ?? ""}`}
      role="img"
      aria-label="Deskpoint"
    >
      <LogoMark className="shrink-0" style={{ width: `${EM_W}em`, height: `${EM_H}em` }} />
      <span aria-hidden="true" style={{ marginLeft: `${EM_GAP}em` }}>
        Desk<span style={{ color: ACCENT }}>point</span>
      </span>
    </span>
  );
}
