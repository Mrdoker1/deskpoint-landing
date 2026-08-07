/**
 * Геометрия знака Deskpoint — один источник для React-компонента (шапка, футер)
 * и для иконок (favicon, apple-touch), чтобы они не разъехались.
 *
 * Знак — окно кабинета: рамка, боковая колонка, верхняя панель и две нижние
 * ячейки, плюс акцентная точка в панели. В экспорте это один залитый контур;
 * здесь он разложен на примитивы (rect + три line + circle), потому что толщина
 * линий обязана быть параметром.
 *
 * Зачем параметр: на 32px favicon экспортные 1.5 юнита дают 0.95 css-px, то есть
 * тоньше пикселя — антиалиасинг размазывает линию на два ряда пикселей и вместо
 * рисунка получается серое пятно. Залитый контур утолстить нельзя, для другого
 * веса нужен новый экспорт; разложенный на примитивы — можно.
 *
 * При MARK_LINE = 1.5 примитивы дают ровно экспортную геометрию:
 * рамка 0.75,0.75 47.6377×48.8994 rx 5.25; колонка x 15.2266, y 1.5…48.8994;
 * раздел y 31.6777, x 15.9766…47.6377; ячейки x 30.9893, y 32.4277…48.8994.
 */

/** Бокс знака в юнитах экспорта. */
export const MARK_BOX = { w: 49.1377, h: 50.3994 } as const;

/** Скругление рамки по внешнему краю. */
export const MARK_RADIUS = 6;

/** Вес линий из экспорта. Один вес на весь знак. */
export const MARK_LINE = 1.5;

/** Осевые линии разделителей: боковая колонка, раздел панели, раздел ячеек. */
export const MARK_SIDEBAR_X = 15.2266;
export const MARK_SPLIT_Y = 31.6777;
export const MARK_CELL_X = 30.9893;

/** Акцентная точка в верхней панели. */
export const MARK_DOT = { cx: 38.7607, cy: 10.4591, r: 4 } as const;

/** Держит координаты чистыми и одинаковыми на сервере и в браузере. */
const round4 = (n: number) => Math.round(n * 10000) / 10000;

/**
 * Разделители знака при заданной толщине. Концы прижаты к внутреннему краю
 * рамки и к соседним разделителям, поэтому при смене веса стыки не расходятся.
 */
export function markParts(line: number, box = MARK_BOX) {
  const half = round4(line / 2);
  return {
    frame: {
      x: half,
      y: half,
      width: round4(box.w - line),
      height: round4(box.h - line),
      rx: round4(Math.max(0, MARK_RADIUS - half)),
    },
    lines: [
      // Боковая колонка — во всю внутреннюю высоту.
      {
        x1: MARK_SIDEBAR_X,
        y1: line,
        x2: MARK_SIDEBAR_X,
        y2: round4(box.h - line),
      },
      // Раздел между верхней панелью и нижними ячейками.
      {
        x1: round4(MARK_SIDEBAR_X + half),
        y1: MARK_SPLIT_Y,
        x2: round4(box.w - line),
        y2: MARK_SPLIT_Y,
      },
      // Раздел между нижними ячейками.
      {
        x1: MARK_CELL_X,
        y1: round4(MARK_SPLIT_Y + half),
        x2: MARK_CELL_X,
        y2: round4(box.h - line),
      },
    ],
  };
}

/**
 * Разметка знака строкой — для иконок, которые собираются вне React
 * (app/icon.tsx, app/apple-icon.tsx). Компонент в components/landing/logo.tsx
 * рисует то же самое элементами React из того же markParts.
 */
export function markMarkup(
  line: number,
  structure: string,
  accent: string,
  opts: { box?: typeof MARK_BOX; dot?: typeof MARK_DOT } = {}
): string {
  const box = opts.box ?? MARK_BOX;
  const dot = opts.dot ?? MARK_DOT;
  const { frame, lines } = markParts(line, box);
  const strokes = lines
    .map((l) => `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}"/>`)
    .join("");
  return (
    `<rect x="${frame.x}" y="${frame.y}" width="${frame.width}" height="${frame.height}" rx="${frame.rx}" fill="none" stroke="${structure}" stroke-width="${line}"/>` +
    `<g stroke="${structure}" stroke-width="${line}">${strokes}</g>` +
    `<circle cx="${dot.cx}" cy="${dot.cy}" r="${dot.r}" fill="${accent}"/>`
  );
}

/* --------------------------------------------------------------------------
   Иконки (favicon, apple-touch).

   Тут тот же знак, но плотнее: на 32px экспортные 1.5 юнита — это 0.95px,
   подпиксель. Вес поднят до ICON_LINE, и знак вписан в тёмную плашку — она
   нужна не для красоты: тонкий тёмный знак на прозрачном фоне пропадает на
   тёмной панели вкладок.
   -------------------------------------------------------------------------- */

export const ICON_BG = "#080503";
export const ICON_FG = "#fafaf9";
export const ICON_ACCENT = "#c98b63";

/** Бокс иконки — квадрат, в отличие от знака (49.14×50.4). */
export const ICON_BOX = 52;
/** Поле между плашкой и знаком. */
export const ICON_PAD = 7;
/** Вес линий иконки: на 32px это 2.1px. */
export const ICON_LINE = 3.4;

/**
 * SVG иконки строкой. `radiusRatio` — скругление плашки долей от стороны, чтобы
 * favicon и apple-touch выглядели одинаково при разных размерах (в прежней
 * иконке было rx 37 на 180).
 */
export function iconSvg(radiusRatio: number): string {
  const plateR = round4(ICON_BOX * radiusRatio);
  const inner = round4(ICON_BOX - ICON_PAD * 2);
  // Знак рисуется в своём боксе и вписывается в плашку через transform: так
  // markParts остаётся единственным местом, где живут пропорции.
  const box = { w: MARK_BOX.w, h: MARK_BOX.h } as const;
  const scale = round4(inner / Math.max(box.w, box.h));
  const dx = round4(ICON_PAD + (inner - box.w * scale) / 2);
  const dy = round4(ICON_PAD + (inner - box.h * scale) / 2);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON_BOX}" height="${ICON_BOX}" viewBox="0 0 ${ICON_BOX} ${ICON_BOX}">` +
    `<rect width="${ICON_BOX}" height="${ICON_BOX}" rx="${plateR}" fill="${ICON_BG}"/>` +
    `<g transform="translate(${dx} ${dy}) scale(${scale})">` +
    markMarkup(round4(ICON_LINE / scale), ICON_FG, ICON_ACCENT, { box }) +
    `</g>` +
    `</svg>`
  );
}
