"use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    number: "01",
    pillar: "Аналитика",
    title: "Анализируем каждый звонок и сообщение",
    description:
      "ИИ разбирает все ваши звонки и переписки — тональность, качество, проблемные моменты. Видите, что реально происходит с клиентами, а не полагаетесь на ощущения.",
    visual: "analytics",
  },
  {
    number: "02",
    pillar: "Телефония",
    title: "Подключаем вашу телефонию с ИИ-оператором",
    description:
      "Интегрируемся с вашей телефонией напрямую или настраиваем её через наших партнёров — ИИ-бот сам отвечает на звонки и сообщения клиентов. Менять провайдера или разбираться в интеграции самим не нужно.",
    visual: "telephony",
  },
  {
    number: "03",
    pillar: "Дашборд",
    title: "Удобный дашборд — и Telegram под рукой",
    description:
      "Все звонки и вся статистика — в одном месте, наглядно и без лишнего. Плюс удобный бот и группа в Telegram для руководителей — ключевая информация доступна не только в кабинете.",
    visual: "dashboard",
  },
  {
    number: "04",
    pillar: "Условия",
    title: "Бесплатная интеграция",
    description:
      "Подключаем полностью бесплатно. Понравится — продолжаете работать. Не понравится — ничего не платите и ничем не обязаны.",
    visual: "free",
  },
  {
    number: "05",
    pillar: "Тариф",
    title: "Оплата по минутам",
    description:
      "Платите только за фактическое использование — без пакетов и переплаты за то, чем не пользуетесь.",
    visual: "perminute",
  },
];

const ACCENT = "var(--dp-primary)";

/** Держит координаты SVG одинаковыми на сервере и в браузере. */
const round3 = (n: number) => Math.round(n * 1000) / 1000;

/**
 * Единая толщина линии всех визуалов — в отрендеренных css-пикселях, а не в
 * единицах viewBox.
 *
 * Бокс визуала — 192×160 (w-48 h-40), все viewBox'ы пропорционально шире, чем
 * бокс, поэтому масштаб задаёт ширина: scale = VISUAL_PX / ширина viewBox. Из-за
 * этого одно и то же strokeWidth в разных visual'ах даёт разную толщину на
 * экране — вес приходится задавать в пикселях и пересчитывать, иначе иконки
 * снова разъедутся при любой правке viewBox.
 */
const VISUAL_PX = 192;
const STROKE_PX = 1.5;
/** Толщина STROKE_PX, пересчитанная в единицы конкретного viewBox. */
const strokeFor = (viewBox: string) =>
  round3((STROKE_PX * Number(viewBox.split(" ")[2])) / VISUAL_PX);

/* --------------------------------------------------------------------------
   Визуалы карточек. Каждый показывает ровно то, о чём написано рядом, и
   рассчитан на бокс 200×160. Структура — currentColor, акценты — --dp-primary.
   Анимация на SMIL, как и в остальном файле.
   -------------------------------------------------------------------------- */

/** 01 · Аналитика: ИИ прослушивает разговор и помечает моменты. */
const WAVE = [10, 18, 30, 22, 44, 58, 36, 26, 52, 70, 44, 30, 20, 38, 62, 48, 28, 16, 34, 24, 14, 10];
const SCAN_FROM = 26;
const SCAN_TO = 174;
const SCAN_DUR = 4;
/** Найденные моменты: середина — проблемный, потому и акцентная. */
const MARKS = [
  { x: 61, accent: false },
  { x: 103, accent: true },
  { x: 145, accent: false },
];

const ANALYTICS_VB = "20 15 162 130";

function AnalyticsVisual() {
  const span = SCAN_TO - SCAN_FROM;
  const sw = strokeFor(ANALYTICS_VB);
  return (
    <svg viewBox={ANALYTICS_VB} className="w-full h-full">
      {/* Силуэт разговора — виден всегда, задаёт форму волны */}
      {WAVE.map((h, i) => (
        <rect
          key={`base-${i}`}
          x={SCAN_FROM + i * 7}
          y={96 - h / 2}
          width="3.4"
          height={h}
          rx="1.7"
          fill="currentColor"
          opacity="0.14"
        />
      ))}

      {/* Разбор идёт по одной полоске: каждая выстреливает от центра и гаснет.
          Резкая огибающая (быстрый подъём, удержание, быстрый спад) — чтобы
          горела различимая группа полосок, а не плавная растяжка яркости. */}
      {WAVE.map((h, i) => {
        const begin = `${round3(((i * 7) / span) * SCAN_DUR)}s`;
        const keyTimes = "0;0.04;0.26;0.34;1";
        return (
          <rect
            key={`live-${i}`}
            x={SCAN_FROM + i * 7}
            y="96"
            width="3.4"
            height="0"
            rx="1.7"
            fill="currentColor"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.95;0.95;0;0"
              keyTimes={keyTimes}
              dur={`${SCAN_DUR}s`}
              begin={begin}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values={`96;${96 - h / 2};${96 - h / 2};96;96`}
              keyTimes={keyTimes}
              dur={`${SCAN_DUR}s`}
              begin={begin}
              repeatCount="indefinite"
            />
            <animate
              attributeName="height"
              values={`0;${h};${h};0;0`}
              keyTimes={keyTimes}
              dur={`${SCAN_DUR}s`}
              begin={begin}
              repeatCount="indefinite"
            />
          </rect>
        );
      })}

      {/* Луч разбора */}
      <line x1={SCAN_FROM} y1="40" x2={SCAN_FROM} y2="132" stroke={ACCENT} strokeWidth={sw}>
        <animate attributeName="x1" values={`${SCAN_FROM};${SCAN_TO}`} dur={`${SCAN_DUR}s`} repeatCount="indefinite" />
        <animate attributeName="x2" values={`${SCAN_FROM};${SCAN_TO}`} dur={`${SCAN_DUR}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.7;0.7;0" keyTimes="0;0.05;0.9;1" dur={`${SCAN_DUR}s`} repeatCount="indefinite" />
      </line>

      {/* Отметки: тональность, качество, проблемные моменты */}
      {MARKS.map((m) => {
        const peak = ((m.x - SCAN_FROM) / span) * SCAN_DUR;
        const begin = `${round3(peak - SCAN_DUR / 2)}s`;
        return (
          <g key={m.x}>
            <line x1={m.x} y1="52" x2={m.x} y2="64" stroke="currentColor" strokeWidth={sw} opacity="0.15">
              <animate attributeName="opacity" values="0.15;0.6;0.15" dur={`${SCAN_DUR}s`} begin={begin} repeatCount="indefinite" />
            </line>
            <circle
              cx={m.x}
              cy="44"
              r="5"
              fill={m.accent ? ACCENT : "none"}
              stroke={m.accent ? ACCENT : "currentColor"}
              strokeWidth={sw}
              opacity="0.18"
            >
              <animate attributeName="opacity" values="0.18;1;0.18" dur={`${SCAN_DUR}s`} begin={begin} repeatCount="indefinite" />
              <animate attributeName="r" values="5;6.5;5" dur={`${SCAN_DUR}s`} begin={begin} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}

/** 02 · Телефония: звонок и сообщение приходят к ИИ-боту, он отвечает сам. */
const CALL_PATH = "M50 50C74 50 84 74 108 74";
const CHAT_PATH = "M56 116C80 116 86 90 108 90";
/** Речь ИИ-оператора: у каждой полоски своя последовательность высот. */
const BOT_BARS = [
  { x: 116, h: [10, 26, 14, 10] },
  { x: 124, h: [20, 10, 28, 20] },
  { x: 132, h: [14, 24, 10, 14] },
  { x: 140, h: [24, 12, 20, 24] },
];

const TELEPHONY_VB = "12 24 150 120";

function TelephonyVisual() {
  const sw = strokeFor(TELEPHONY_VB);
  return (
    <svg viewBox={TELEPHONY_VB} className="w-full h-full">
      {/* Входящий звонок */}
      <rect x="24" y="32" width="26" height="38" rx="6" fill="none" stroke="currentColor" strokeWidth={sw} />
      <rect x="30" y="40" width="14" height="2.5" rx="1.25" fill="currentColor" opacity="0.5" />
      <circle cx="37" cy="62" r="2.5" fill="currentColor" opacity="0.5" />

      {/* Входящее сообщение. Пузырь и хвостик — один замкнутый контур: хвостик,
          нарисованный отдельным штрихом поверх, торчал палочкой. */}
      <path
        d="M30 98H48A8 8 0 0 1 56 106V114A8 8 0 0 1 48 122H41L33 130L36 122H30A8 8 0 0 1 22 114V106A8 8 0 0 1 30 98Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinejoin="round"
      />

      {/* Каналы */}
      <path d={CALL_PATH} fill="none" stroke="currentColor" strokeWidth={sw} opacity="0.2" />
      <path d={CHAT_PATH} fill="none" stroke="currentColor" strokeWidth={sw} opacity="0.2" />

      {/* Обращения идут к боту */}
      <path d={CALL_PATH} pathLength="1" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeDasharray="0.18 0.82">
        <animate attributeName="stroke-dashoffset" values="1;0" dur="2.6s" repeatCount="indefinite" />
      </path>
      <path d={CHAT_PATH} pathLength="1" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeDasharray="0.18 0.82">
        <animate attributeName="stroke-dashoffset" values="1;0" dur="2.6s" begin="0.9s" repeatCount="indefinite" />
      </path>

      {/* Ответы бота идут обратно — тем же путём, но в другую сторону */}
      <path d={CALL_PATH} pathLength="1" fill="none" stroke={ACCENT} strokeWidth={sw} strokeLinecap="round" strokeDasharray="0.14 0.86">
        <animate attributeName="stroke-dashoffset" values="0;1" dur="2.6s" begin="1.3s" repeatCount="indefinite" />
      </path>
      <path d={CHAT_PATH} pathLength="1" fill="none" stroke={ACCENT} strokeWidth={sw} strokeLinecap="round" strokeDasharray="0.14 0.86">
        <animate attributeName="stroke-dashoffset" values="0;1" dur="2.6s" begin="2.2s" repeatCount="indefinite" />
      </path>

      {/* ИИ-оператор */}
      <line x1="130" y1="56" x2="130" y2="46" stroke="currentColor" strokeWidth={sw} />
      <circle cx="130" cy="43" r="3" fill={ACCENT}>
        <animate attributeName="opacity" values="1;0.35;1" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <rect x="108" y="56" width="44" height="44" rx="11" fill="none" stroke="currentColor" strokeWidth={sw} />
      {BOT_BARS.map((b, i) => (
        <rect key={b.x} x={b.x} width="4" rx="2" fill={ACCENT} y={78 - b.h[0] / 2} height={b.h[0]}>
          <animate attributeName="height" values={b.h.join(";")} dur="1.8s" begin={`${round3(i * 0.15)}s`} repeatCount="indefinite" />
          <animate attributeName="y" values={b.h.map((h) => 78 - h / 2).join(";")} dur="1.8s" begin={`${round3(i * 0.15)}s`} repeatCount="indefinite" />
        </rect>
      ))}
    </svg>
  );
}

/** 03 · Дашборд: кабинет со статистикой и та же сводка в Telegram. */
const DASH_BARS = [30, 48, 22, 60, 40];

const DASHBOARD_VB = "10 2 182 145.6";

function DashboardVisual() {
  const sw = strokeFor(DASHBOARD_VB);
  return (
    <svg viewBox={DASHBOARD_VB} className="w-full h-full">
      {/* Кабинет */}
      <rect x="14" y="26" width="112" height="98" rx="7" fill="none" stroke="currentColor" strokeWidth={sw} />
      <line x1="14" y1="44" x2="126" y2="44" stroke="currentColor" strokeWidth={sw} opacity="0.35" />
      <circle cx="24" cy="35" r="2" fill="currentColor" opacity="0.45" />
      <circle cx="32" cy="35" r="2" fill="currentColor" opacity="0.45" />
      <circle cx="40" cy="35" r="2" fill="currentColor" opacity="0.45" />

      {/* Статистика */}
      {DASH_BARS.map((h, i) => {
        const x = 26 + i * 19;
        const top = 112 - h;
        return (
          <rect key={i} x={x} y="104" width="11" height="8" rx="2.5" fill={i === 3 ? ACCENT : "currentColor"} opacity={i === 3 ? 1 : 0.65}>
            <animate attributeName="y" values={`104;${top};${top};104`} keyTimes="0;0.35;0.85;1" dur="3.4s" begin={`${round3(i * 0.12)}s`} repeatCount="indefinite" />
            <animate attributeName="height" values={`8;${h};${h};8`} keyTimes="0;0.35;0.85;1" dur="3.4s" begin={`${round3(i * 0.12)}s`} repeatCount="indefinite" />
          </rect>
        );
      })}

      {/* Та же сводка уходит в Telegram */}
      <line x1="126" y1="74" x2="146" y2="74" stroke="currentColor" strokeWidth={sw} strokeDasharray="2.73 3.64" opacity="0.35" />
      <circle cy="74" r="2.6" fill={ACCENT}>
        <animate attributeName="cx" values="126;146" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.75;1" dur="1.8s" repeatCount="indefinite" />
      </circle>

      <rect x="146" y="38" width="42" height="74" rx="9" fill="none" stroke="currentColor" strokeWidth={sw} />
      <rect x="160" y="44" width="14" height="2.5" rx="1.25" fill="currentColor" opacity="0.4" />
      <rect x="152" y="58" width="28" height="11" rx="5.5" fill="currentColor" opacity="0.25">
        <animate attributeName="opacity" values="0;0.25;0.25" keyTimes="0;0.25;1" dur="3.6s" repeatCount="indefinite" />
      </rect>
      <rect x="152" y="75" width="30" height="11" rx="5.5" fill={ACCENT} opacity="0">
        <animate attributeName="opacity" values="0;0;0.9;0.9" keyTimes="0;0.45;0.6;1" dur="3.6s" repeatCount="indefinite" />
        <animate attributeName="width" values="10;10;30;30" keyTimes="0;0.45;0.6;1" dur="3.6s" repeatCount="indefinite" />
      </rect>
      <rect x="152" y="92" width="22" height="11" rx="5.5" fill="currentColor" opacity="0">
        <animate attributeName="opacity" values="0;0;0.25;0.25" keyTimes="0;0.72;0.85;1" dur="3.6s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}

/**
 * 04 · Условия: счёт, где напротив каждой позиции — ноль.
 *
 * Рисунок подтянут к характеру знака Deskpoint: монолинейный контур, сильное
 * скругление верха, чёрный контур против тёплого коричневого внутри, круглые
 * точки вместо штрихов. Толщина — общий STROKE_PX, как у остальных иконок:
 * «как у знака» в пропорциях знака здесь давало 4.8 px и выбивалось из ряда.
 * Бумага вытянута почти во всю высоту бокса, чтобы у итога остались поля
 * сверху и снизу, а зубцы крупные и геометричные, а не мелкая пила.
 */
/** Бумага: контур и линия отрыва считаются из этих размеров. */
const BILL_LEFT = 40;
const BILL_RIGHT = 160;
const BILL_TOP = 10;
const BILL_RADIUS = 18;
/**
 * Линия отрыва. Зубцы частые и мелкие — как у настоящей чековой бумаги; крупная
 * пила в этом размере читалась отдельной фигурой, а не краем листа. Основание
 * держим так, чтобы низ силуэта остался на 156 — иначе иконка уезжает вверх
 * относительно соседних.
 */
const BILL_TEETH = 8;
const BILL_TEETH_BASE = 148;
const BILL_TEETH_DEPTH = 8;

/** Зубцы справа налево: вершина — основание, впадина — основание + глубина. */
const billTeeth = () => {
  const step = (BILL_RIGHT - BILL_LEFT) / (BILL_TEETH * 2);
  return Array.from({ length: BILL_TEETH * 2 }, (_, k) => {
    const x = round3(BILL_RIGHT - step * (k + 1));
    const y = k % 2 === 0 ? BILL_TEETH_BASE + BILL_TEETH_DEPTH : BILL_TEETH_BASE;
    return `L${x} ${y}`;
  }).join("");
};

const BILL_PAPER =
  `M${BILL_LEFT + BILL_RADIUS} ${BILL_TOP}H${BILL_RIGHT - BILL_RADIUS}` +
  `A${BILL_RADIUS} ${BILL_RADIUS} 0 0 1 ${BILL_RIGHT} ${BILL_TOP + BILL_RADIUS}` +
  `V${BILL_TEETH_BASE}${billTeeth()}V${BILL_TOP + BILL_RADIUS}` +
  `A${BILL_RADIUS} ${BILL_RADIUS} 0 0 1 ${BILL_LEFT + BILL_RADIUS} ${BILL_TOP}Z`;

/** Позиции: y строки, ширина названия, начало отбивки и момент появления. */
const BILL_ROWS = [
  { y: 46, w: 46, dots: 114, at: 0.06 },
  { y: 68, w: 34, dots: 102, at: 0.18 },
];
const BILL_DUR = "4s";
/** Круглые точки — рифма к точкам внутри знака. */
const DOTS = { strokeDasharray: "0.5 7", strokeLinecap: "round" } as const;

/**
 * Цифры нарисованы линиями, а не набраны текстом. У текста толщина штриха
 * задаётся кеглем и начертанием: тот же STROKE_PX ею не получить (Manrope 300
 * даёт ~2 px на кегле 26 и ~1.3 px на 17), и цифры выбивались из монолинейного
 * ряда. Контуром толщина ровно та же, что у всех остальных линий.
 */
/** Стойка с чашей и перечёркивание — знак рубля. */
const RUBLE_STEM = 134;
const RUBLE_BODY = `M${RUBLE_STEM} 124V104H139A6 6 0 0 1 139 116H${RUBLE_STEM}`;
const RUBLE_BAR = "M129 119.5H143";

const FREE_VB = "0 2 200 160";

function FreeIntegrationVisual() {
  const sw = strokeFor(FREE_VB);
  return (
    <svg viewBox={FREE_VB} className="w-full h-full">
      <path
        d={BILL_PAPER}
        fill="none"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Позиции: услуга, отбивка точками и ноль напротив */}
      {BILL_ROWS.map((row) => (
        <g key={row.y} opacity="0">
          <animate
            attributeName="opacity"
            values="0;0;1;1;0"
            keyTimes={`0;${row.at};${round3(row.at + 0.05)};0.85;1`}
            dur={BILL_DUR}
            repeatCount="indefinite"
          />
          <line x1="58" y1={row.y} x2={58 + row.w} y2={row.y} stroke={ACCENT} strokeWidth={sw} strokeLinecap="round" />
          <line x1={row.dots} y1={row.y} x2="126" y2={row.y} stroke={ACCENT} strokeWidth={sw} {...DOTS} />
          <ellipse cx="141" cy={row.y} rx="5" ry="6.2" fill="none" stroke={ACCENT} strokeWidth={sw} />
        </g>
      ))}

      {/* Итог */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.3;0.38;0.85;1" dur={BILL_DUR} repeatCount="indefinite" />
        <line x1="58" y1="90" x2="146" y2="90" stroke={ACCENT} strokeWidth={sw} {...DOTS} />
        <ellipse cx="117" cy="114" rx="7.5" ry="10" fill="none" stroke={ACCENT} strokeWidth={sw} />
        <path d={RUBLE_BODY} fill="none" stroke={ACCENT} strokeWidth={sw} strokeLinecap="round" />
        <path d={RUBLE_BAR} fill="none" stroke={ACCENT} strokeWidth={sw} strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * 05 · Тариф: время идёт непрерывно, поэтому стрелка и дуга едут плавно и
 * строго синхронно — дуга прирастает ровно за стрелкой. Дискретна только
 * оплата: точка защёлкивается в момент, когда стрелка прошла очередную минуту,
 * и от неё к следующей тянется перемычка — цепочка набегает звено за звеном,
 * пока идёт минута. Отсюда и читается «платим ровно за пройденное время».
 */
const SLOTS = 10;
const TARIFF_DUR = "6s";
/** Оборот занимает почти весь цикл; остаток — пауза перед сбросом. */
const SWEEP_END = 0.85;
/** Стрелка и дуга: линейный ход до конца оборота, затем удержание. */
const SWEEP_KEYS = `0;${SWEEP_END};1`;
const SWEEP_DASH = "1;0;0";
const SWEEP_ROTATE = "0 100 60;360 100 60;360 100 60";
/** Момент защёлкивания точки i — стрелка прошла ровно (i+1)-ю минуту. */
const tickAt = (i: number) => round3((SWEEP_END * (i + 1)) / SLOTS);
/** Общее затухание в конце цикла, чтобы сброс не мигал. */
const FADE_VALUES = "0;1;1;0;0";
const FADE_KEYS = "0;0.02;0.94;0.98;1";

/**
 * Цепочка минут. Шаг и радиус подобраны так, чтобы ряд занимал ту же ширину
 * (29…172), что и прежние ячейки, а между точками оставалось 7 единиц — этого
 * хватает на видимую перемычку с зазором от обводок.
 */
const SLOT_STEP = 15;
const SLOT_R = 4;
const SLOT_Y = 118;
const slotX = (i: number) => 33 + i * SLOT_STEP;
/** Перемычка живёт строго между двумя точками, не наезжая на их обводки. */
const LINK_GAP = 1;

const PER_MINUTE_VB = "25 18 151 120.8";

function PerMinuteVisual() {
  const sw = strokeFor(PER_MINUTE_VB);
  return (
    <svg viewBox={PER_MINUTE_VB} className="w-full h-full">
      {/* Циферблат */}
      <circle cx="100" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth={sw} opacity="0.35" />
      <line x1="100" y1="33" x2="100" y2="38" stroke="currentColor" strokeWidth={sw} opacity="0.3" />
      <line x1="127" y1="60" x2="122" y2="60" stroke="currentColor" strokeWidth={sw} opacity="0.3" />
      <line x1="100" y1="87" x2="100" y2="82" stroke="currentColor" strokeWidth={sw} opacity="0.3" />
      <line x1="73" y1="60" x2="78" y2="60" stroke="currentColor" strokeWidth={sw} opacity="0.3" />

      {/* Пройденное время: дуга прирастает ровно на одну минуту за шаг */}
      <circle
        cx="100"
        cy="60"
        r="30"
        pathLength="1"
        fill="none"
        stroke={ACCENT}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray="1 1"
        strokeDashoffset="1"
        transform="rotate(-90 100 60)"
      >
        <animate attributeName="stroke-dashoffset" values={SWEEP_DASH} keyTimes={SWEEP_KEYS} dur={TARIFF_DUR} repeatCount="indefinite" />
        <animate attributeName="opacity" values={FADE_VALUES} keyTimes={FADE_KEYS} dur={TARIFF_DUR} repeatCount="indefinite" />
      </circle>

      <line x1="100" y1="60" x2="100" y2="38" stroke={ACCENT} strokeWidth={sw} strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" values={SWEEP_ROTATE} keyTimes={SWEEP_KEYS} dur={TARIFF_DUR} repeatCount="indefinite" />
        <animate attributeName="opacity" values={FADE_VALUES} keyTimes={FADE_KEYS} dur={TARIFF_DUR} repeatCount="indefinite" />
      </line>
      <circle cx="100" cy="60" r="3.2" fill={ACCENT} opacity="0.9" />

      {/* Незанятые минуты */}
      {Array.from({ length: SLOTS }, (_, i) => (
        <circle key={`slot-${i}`} cx={slotX(i)} cy={SLOT_Y} r={SLOT_R} fill="none" stroke="currentColor" strokeWidth={sw} opacity="0.25" />
      ))}

      {/* Перемычки: каждая тянется ровно за ту минуту, что идёт между точками,
          поэтому цепочка растёт непрерывно, а не догоняет рывками. */}
      {Array.from({ length: SLOTS - 1 }, (_, i) => (
        <line
          key={`link-${i}`}
          x1={slotX(i) + SLOT_R + LINK_GAP}
          y1={SLOT_Y}
          x2={slotX(i + 1) - SLOT_R - LINK_GAP}
          y2={SLOT_Y}
          pathLength="1"
          stroke={ACCENT}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray="1 1"
          strokeDashoffset="1"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="1;1;0;0"
            keyTimes={`0;${tickAt(i)};${tickAt(i + 1)};1`}
            dur={TARIFF_DUR}
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.94;0.98;1" dur={TARIFF_DUR} repeatCount="indefinite" />
        </line>
      ))}

      {/* Оплаченные минуты: точка защёлкивается с коротким подхватом — видно,
          что это щелчок, но без строба. */}
      {Array.from({ length: SLOTS }, (_, i) => {
        const at = tickAt(i);
        return (
          <circle key={`paid-${i}`} cx={slotX(i)} cy={SLOT_Y} r="0" fill={ACCENT} opacity="0">
            <animate
              attributeName="r"
              values={`0;0;${SLOT_R + 1};${SLOT_R};${SLOT_R}`}
              keyTimes={`0;${at};${round3(at + 0.012)};${round3(at + 0.03)};1`}
              dur={TARIFF_DUR}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0;1;1;0;0"
              keyTimes={`0;${at};${round3(at + 0.012)};0.94;0.98;1`}
              dur={TARIFF_DUR}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}
    </svg>
  );
}

/**
 * Декор в пустоте справа от заголовка секции.
 *
 * Мотив намеренно другой, чем на первом экране, в кейсах и у кнопки заявки: там
 * везде потоки сходятся в узел, и четвёртый такой же читался бы как повтор.
 * Здесь две группы параллельных волн — рифма к «двум столпам» в заголовке.
 *
 * Показываем от xl, а не от lg: заголовок на кегле 6xl занимает около 750px, и
 * на 1024px свободной ширины остаётся меньше 200px — линии полезли бы на текст.
 * От 1280px её хватает с запасом.
 */
const FEATURE_WAVES = [
  { d: "M-20 46C120 18 300 74 480 40", op: 0.16, dur: "13s", delay: "-1.1s" },
  { d: "M-20 74C140 52 280 108 480 72", op: 0.2, dur: "10s", delay: "-4.6s" },
  { d: "M-20 102C110 86 300 128 480 100", op: 0.13, dur: "15s", delay: "-2.3s" },
  { d: "M-20 218C140 194 270 250 480 214", op: 0.13, dur: "11.5s", delay: "-6.4s" },
  { d: "M-20 246C110 226 290 274 480 242", op: 0.2, dur: "14s", delay: "-3.2s" },
  { d: "M-20 274C150 258 265 300 480 270", op: 0.16, dur: "9.5s", delay: "-7.8s" },
];

function FeatureWaves() {
  return (
    <svg
      viewBox="0 0 460 320"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-1/2 hidden h-[320px] w-[460px] -translate-y-1/2 select-none xl:block"
    >
      <style>{`
        .fw-pulse {
          fill: none;
          stroke-linecap: round;
          stroke-dasharray: 0.1 0.9;
          animation: fw-flow linear infinite;
        }
        @keyframes fw-flow {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fw-pulse { display: none; }
        }
      `}</style>
      {FEATURE_WAVES.map((w) => (
        <path
          key={w.d}
          d={w.d}
          stroke="#402718"
          strokeOpacity={w.op}
          strokeWidth="1.6"
        />
      ))}
      {FEATURE_WAVES.map((w) => (
        <path
          key={`pulse-${w.d}`}
          className="fw-pulse"
          d={w.d}
          pathLength="1"
          stroke="#74452c"
          strokeOpacity="0.55"
          strokeWidth="2.2"
          style={{ animationDuration: w.dur, animationDelay: w.delay }}
        />
      ))}
      <circle cx="240" cy="160" r="3.4" fill={ACCENT} fillOpacity="0.55" />
    </svg>
  );
}

function AnimatedVisual({ type }: { type: string }) {
  switch (type) {
    case "analytics":
      return <AnalyticsVisual />;
    case "telephony":
      return <TelephonyVisual />;
    case "dashboard":
      return <DashboardVisual />;
    case "free":
      return <FreeIntegrationVisual />;
    case "perminute":
      return <PerMinuteVisual />;
    default:
      return <AnalyticsVisual />;
  }
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 py-12 lg:py-20 border-b border-foreground/10">
        {/* Number + pillar */}
        <div className="shrink-0 w-36">
          <span className="font-mono text-sm text-muted-foreground">
            {feature.number}
          </span>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-primary">
            {feature.pillar}
          </p>
        </div>
        
        {/* Content */}
        <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl lg:text-4xl font-display mb-4 group-hover:translate-x-2 transition-transform duration-500">
              {feature.title}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
          
          {/* Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-48 h-40 text-foreground">
              <AnimatedVisual type={feature.visual} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative overflow-hidden py-24 lg:py-32"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="relative mb-16 lg:mb-24">
          <FeatureWaves />
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Возможности
          </span>
          <h2
            className={`relative max-w-3xl text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Два столпа Deskpoint:
            <br />
            <span className="text-muted-foreground">
              полная аналитика команды
            </span>
            <br />
            <span className="text-muted-foreground">
              и все каналы в одном окне
            </span>
          </h2>
        </div>

        {/* Features List */}
        <div>
          {features.map((feature, index) => (
            <FeatureCard key={feature.number} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
