/**
 * Фирменные дудлы Deskpoint — 16 знаков, нарисованных от руки одним штрихом.
 * Сгенерировано из deskpoint-doodles-svg: цвет обводки заменён на currentColor,
 * общие атрибуты штриха вынесены на <svg>, чтобы дудл можно было красить
 * классом и использовать как на светлом, так и на тёмном фоне.
 *
 * Все нарисованы в квадрате -24…24, то есть центрированы в начале координат —
 * благодаря этому их удобно расставлять одним translate в паттерне.
 */
import type { ReactNode } from "react";

export const DOODLES: Record<string, ReactNode> = {
  bell: (
    <>
      <path d="M 0 -16 Q 10 -16 10 -4 Q 10 4 13 8 H -13 Q -10 4 -10 -4 Q -10 -16 0 -16 Z"/>
      <path d="M -4 12 Q 0 16 4 12"/>
    </>
  ),
  bubble: (
    <>
      <path d="M -13 -12 H 13 Q 17 -12 17 -8 V 4 Q 17 8 13 8 H -2 L -10 15 Q -12 17 -12 13 V 8 Q -17 8 -17 -1 V -8 Q -17 -12 -13 -12 Z"/>
      <circle cx="0" cy="-2" r="1.6" fill="currentColor" stroke="none"/>
      <circle cx="-7" cy="-2" r="1.6" fill="currentColor" stroke="none"/>
      <circle cx="7" cy="-2" r="1.6" fill="currentColor" stroke="none"/>
    </>
  ),
  chart: (
    <>
      <path d="M -15 15 H 15"/>
      <rect x="-12" y="0" width="6" height="12" rx="1.5"/>
      <rect x="-2" y="-8" width="6" height="20" rx="1.5"/>
      <rect x="8" y="-3" width="6" height="15" rx="1.5"/>
    </>
  ),
  check: (
    <>
      <circle cx="0" cy="0" r="14"/>
      <path d="M -6 0 L -2 4.5 L 7 -5"/>
    </>
  ),
  clock: (
    <>
      <circle cx="0" cy="0" r="13.5"/>
      <path d="M 0 -7 V 0 L 6 4"/>
    </>
  ),
  coffee: (
    <>
      <path d="M -11 -8 H 9 V 4 Q 9 12 -1 12 Q -11 12 -11 4 Z"/>
      <path d="M 9 -5 H 13 Q 16 -5 16 -1 Q 16 3 13 3 H 9"/>
      <path d="M -6 -13 Q -6 -15 -4 -16 M 1 -13 Q 1 -15 3 -16" transform="translate(0,1)"/>
    </>
  ),
  cursor: (
    <>
      <path d="M -6 -14 L 10 2 L 2 3.5 L 6 12 L 2 14 L -2 5.5 L -8 10 Z"/>
    </>
  ),
  envelope: (
    <>
      <rect x="-16" y="-11" width="32" height="22" rx="4"/>
      <path d="M -15 -9 L 0 3 L 15 -9"/>
    </>
  ),
  handset: (
    <>
      <path d="M-14 -8 Q -16 -14 -10 -15 L -5 -16 Q -1 -16 0 -12 L 1 -7 Q 1.5 -4 -1 -2 L -4 0 Q -2 7 5 11 L 8 8 Q 10 6 13 7.5 L 17 10 Q 20 12 18 15 L 15 18 Q 12 21 6 19 Q -8 14 -13 -2 Z" transform="scale(0.85)"/>
    </>
  ),
  headset: (
    <>
      <path d="M -13 6 V -2 Q -13 -14 0 -14 Q 13 -14 13 -2 V 6"/>
      <rect x="-17" y="2" width="7" height="11" rx="3"/>
      <rect x="10" y="2" width="7" height="11" rx="3"/>
      <path d="M 13 11 Q 13 17 4 18"/>
    </>
  ),
  monitor: (
    <>
      <rect x="-15" y="-12" width="30" height="20" rx="3"/>
      <path d="M -5 8 L -6 14 M 5 8 L 6 14 M -9 14 H 9"/>
    </>
  ),
  plane: (
    <>
      <path d="M 18 -14 L -18 -2 L -8 3 L 10 -8 L -3 6 L -3 13 L 2 8 L 8 12 Z"/>
    </>
  ),
  point: (
    <>
      <circle cx="0" cy="0" r="13"/>
      <circle cx="0" cy="0" r="4.5" fill="currentColor" stroke="none"/>
    </>
  ),
  signal: (
    <>
      <circle cx="-8" cy="10" r="2.2" fill="currentColor" stroke="none"/>
      <path d="M -8 0 Q 2 0 2 10"/>
      <path d="M -8 -7 Q 9 -7 9 10"/>
      <path d="M -8 -14 Q 16 -14 16 10"/>
    </>
  ),
  tag: (
    <>
      <path d="M -14 -6 L -2 -15 Q 0 -16.5 2 -15 L 14 -6 Q 16 -4.5 16 -2 V 10 Q 16 14 12 14 H -12 Q -16 14 -16 10 V -2 Q -16 -4.5 -14 -6 Z" transform="rotate(-8) scale(0.85)"/>
      <circle cx="0" cy="-6" r="2.4" transform="rotate(-8) scale(0.85)"/>
    </>
  ),
  wave: (
    <>
      <path d="M -16 0 V 0.01"/>
      <path d="M -16 -4 V 4"/>
      <path d="M -10 -8 V 8"/>
      <path d="M -4 -3 V 3"/>
      <path d="M 2 -11 V 11"/>
      <path d="M 8 -5 V 5"/>
      <path d="M 14 -8 V 8"/>
    </>
  ),
};

export type DoodleName = keyof typeof DOODLES;

export const DOODLE_NAMES = Object.keys(DOODLES) as DoodleName[];

/** Одиночный дудл. Размер и цвет задаются снаружи через className. */
export function Doodle({
  name,
  className,
  strokeWidth = 2,
}: {
  name: DoodleName;
  className?: string;
  /** Толщина штриха в юнитах бокса 48×48. Крупным дудлам нужна тоньше. */
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="-24 -24 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {DOODLES[name]}
    </svg>
  );
}
