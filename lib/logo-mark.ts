/**
 * Знак Deskpoint — один источник для локапа (шапка, футер) и иконок.
 *
 * Искра и слово взяты из экспорта 300×94 как есть. Дуги и точки перерисованы:
 * дуги — плавными кривыми Безье вместо залитых лент из экспорта (в стиле
 * hero-flows.svg на первом экране), точки — окружностями чуть крупнее.
 */

export const LOGO_CURVE = "#C2A395";
export const LOGO_ACCENT = "#AC582F";
export const LOGO_WORD = "#644133";

/** Бокс локапа и знака в юнитах экспорта. */
export const LOCKUP = { w: 300, h: 94 } as const;
export const MARK_BOX = { w: 104, h: 94 } as const;

/** Толщина дуг и радиус точек. */
export const CURVE_WIDTH = 1.8;
export const DOT_R = 2.9;

/**
 * Три длинные дуги, закручивающиеся вокруг искры. Каждая — гладко стыкованные
 * кубические Безье (касательные в точках стыка параллельны, поэтому изгиб идёт
 * без изломов), как кривые в hero-flows.svg. Свободные концы приходят на точки.
 */
export const LOGO_CURVES = [
  "M54.4 2.6C72 12.6 84 32 80 44C77 53 73 56 70.4 57.6",
  "M2.6 53.5C8.4 34 24 20.4 40 20.4C52 20.4 58 26 60.4 32",
  "M48 91C30 76 30 56 44 52C60 47 76 62 98.8 54.4",
] as const;

/** Точки на свободных концах дуг. */
export const LOGO_DOTS = [
  { cx: 54.4, cy: 2.6 },
  { cx: 2.6, cy: 53.5 },
  { cx: 48, cy: 91 },
  { cx: 98.8, cy: 54.4 },
] as const;

/** Искра в центре — из экспорта. */
export const LOGO_SPARK =
  "M54.4682 54.5472C54.4285 54.7617 54.2777 54.9128 54.071 54.9128C53.8646 54.9128 53.7138 54.7617 53.6819 54.5472C53.0862 50.2027 52.4904 49.6229 48.2016 49.059C47.9711 49.0353 47.8203 48.8685 47.8203 48.6618C47.8203 48.4554 47.9711 48.2965 48.2016 48.2647C52.4986 47.7882 53.1181 47.1291 53.6819 42.7765C53.7138 42.562 53.8643 42.4189 54.071 42.4189C54.2777 42.4189 54.4285 42.562 54.4682 42.7765C55.0321 47.1291 55.6437 47.7882 59.9486 48.2647C60.1709 48.2965 60.322 48.4551 60.322 48.6618C60.322 48.8685 60.1709 49.0353 59.9486 49.059C55.6437 49.5355 55.0321 50.1949 54.4682 54.5472Z";

/** Габарит искры — нужен, чтобы вписать её в иконку. */
export const SPARK_BOX = { x: 47.82, y: 42.42, w: 12.5, h: 12.5 } as const;

const round4 = (n: number) => Math.round(n * 10000) / 10000;

/* Иконки: только искра — три тонкие дуги в 32 пикселя не помещаются. */

export const ICON_BG = "#080503";
export const ICON_BOX = 52;
export const ICON_PAD = 9;

export function iconSvg(radiusRatio: number): string {
  const plateR = round4(ICON_BOX * radiusRatio);
  const inner = ICON_BOX - ICON_PAD * 2;
  const scale = round4(inner / Math.max(SPARK_BOX.w, SPARK_BOX.h));
  const dx = round4(ICON_PAD - SPARK_BOX.x * scale);
  const dy = round4(ICON_PAD - SPARK_BOX.y * scale);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON_BOX}" height="${ICON_BOX}" viewBox="0 0 ${ICON_BOX} ${ICON_BOX}">` +
    `<rect width="${ICON_BOX}" height="${ICON_BOX}" rx="${plateR}" fill="${ICON_BG}"/>` +
    `<g transform="translate(${dx} ${dy}) scale(${scale})">` +
    `<path d="${LOGO_SPARK}" fill="${LOGO_ACCENT}"/>` +
    `</g>` +
    `</svg>`
  );
}
