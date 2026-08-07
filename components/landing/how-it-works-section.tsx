"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowDown,
  BarChart3,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Phone,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { DemoVideoPlayer } from "./demo-video-player";

const intakeCards: { icon: LucideIcon; title: string; description: string }[] =
  [
    {
      icon: Phone,
      title: "Телефония",
      description: "Входящие звонки, запись и ИИ-разбор разговора.",
    },
    {
      icon: MessageSquare,
      title: "Мессенджеры",
      description: "Telegram, MAX, WhatsApp, VK, Avito — в одном контуре.",
    },
    {
      icon: LayoutDashboard,
      title: "Виджет",
      description: "Чат на сайте клиента без отдельного инбокса.",
    },
  ];

const analyticsCards: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: FileText,
    title: "Анализ звонков и диалогов",
    description:
      "Расшифровка, саммари и теги по каждому обращению — без ручной расшифровки смены.",
  },
  {
    icon: Users,
    title: "Эффективность операторов",
    description:
      "Кто как справляется, где грубит, где теряет клиента — оценка по каждому сотруднику.",
  },
  {
    icon: BarChart3,
    title: "Дашборд для владельца",
    description:
      "Воронка, проблемные диалоги и usage — картина по всей команде в одном месте.",
  },
];

function FlowLine({
  active,
  delayMs,
  direction = "right",
}: {
  active: boolean;
  delayMs: number;
  direction?: "left" | "right";
}) {
  const toLeft = direction === "left";
  return (
    <div
      className="hidden lg:flex w-10 xl:w-14 shrink-0 items-center justify-center px-1 self-center"
      aria-hidden
    >
      <svg viewBox="0 0 64 24" className="w-full h-6 overflow-visible">
        <line
          x1={toLeft ? 64 : 0}
          y1="12"
          x2={toLeft ? 16 : 48}
          y2="12"
          stroke="currentColor"
          className="text-background/30"
          strokeWidth="1"
          fill="none"
          strokeDasharray="48"
          strokeDashoffset={active ? 0 : 48}
          style={{
            transition: `stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
          }}
        />
        <path
          d={toLeft ? "M16 7 L6 12 L16 17" : "M48 7 L58 12 L48 17"}
          fill="none"
          stroke="currentColor"
          className="text-background/40"
          strokeWidth="1.25"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{
            opacity: active ? 1 : 0,
            transition: `opacity 400ms ease ${delayMs + 480}ms`,
          }}
        />
      </svg>
    </div>
  );
}

function FlowArrowMobile({
  active,
  delayMs,
}: {
  active: boolean;
  delayMs: number;
}) {
  return (
    <div
      className="flex lg:hidden justify-center py-2"
      aria-hidden
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translate3d(0,0,0)" : "translate3d(0,-6px,0)",
        transition: `opacity 500ms ease ${delayMs}ms, transform 500ms ease ${delayMs}ms`,
      }}
    >
      <ArrowDown className="h-6 w-6 text-background/35" />
    </div>
  );
}

function PillarCard({
  icon: Icon,
  title,
  description,
  active,
  delayMs,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  active: boolean;
  delayMs: number;
}) {
  return (
    <div
      className="flex items-start gap-4 rounded-2xl border border-background/15 bg-background/5 p-4"
      style={revealStyle(active, delayMs, 14)}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-background/20">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <div className="font-display text-xl">{title}</div>
        <p className="mt-1 text-sm text-background/55 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function revealStyle(
  active: boolean,
  delayMs: number,
  fromY = 12
): CSSProperties {
  return {
    opacity: active ? 1 : 0,
    transform: active ? "translate3d(0,0,0)" : `translate3d(0,${fromY}px,0)`,
    transition: `opacity 650ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms, transform 650ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
  };
}

export function HowItWorksSection() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [flowActive, setFlowActive] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const headerObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) headerObs.observe(sectionRef.current);

    const flowObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setFlowActive(true);
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    if (flowRef.current) flowObs.observe(flowRef.current);

    return () => {
      headerObs.disconnect();
      flowObs.disconnect();
    };
  }, []);

  const active = reduceMotion || flowActive;
  const isVisible = reduceMotion || headerVisible;

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-foreground text-background overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)`,
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-background/50 mb-6">
            <span className="w-8 h-px bg-background/30" />
            Как это работает
          </span>
          <h2
            className="text-4xl lg:text-6xl font-display tracking-tight"
            style={revealStyle(isVisible, 0, 16)}
          >
            Все каналы —
            <br />
            <span className="text-background/50">
              и вся аналитика команды —
            </span>
            <br />
            <span className="text-background/50">в одном кабинете.</span>
          </h2>
          <p
            className="mt-6 max-w-2xl text-lg text-background/60 leading-relaxed"
            style={revealStyle(isVisible, 100, 12)}
          >
            Каналы сходятся в Deskpoint: ИИ разбирает обращения, а владелец
            видит и поток, и работу каждого оператора.
          </p>
        </div>

        <div
          id="demo"
          className="mb-16 lg:mb-20 scroll-mt-28"
          style={revealStyle(isVisible, 150, 16)}
        >
          <DemoVideoPlayer />
        </div>

        <div
          ref={flowRef}
          aria-label="Схема: приём обращений → Deskpoint → аналитика команды"
        >
          {/* Mobile / desktop: two pillars around center */}
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,0.95fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-4">
            {/* Left pillar */}
            <div className="space-y-3 order-1 lg:order-none">
              <p
                className="font-mono text-[11px] uppercase tracking-widest text-background/45 mb-1"
                style={revealStyle(active, 40, 8)}
              >
                Приём обращений с ИИ
              </p>
              {intakeCards.map((card, i) => (
                <PillarCard
                  key={card.title}
                  {...card}
                  active={active}
                  delayMs={80 + i * 120}
                />
              ))}
            </div>

            <FlowLine active={active} delayMs={480} direction="left" />
            <div className="order-2 lg:contents">
              <FlowArrowMobile active={active} delayMs={480} />
            </div>

            {/* Center */}
            <div
              className="relative order-3 rounded-2xl border border-background/25 bg-background/10 p-6 lg:p-8 text-center lg:order-none"
              style={revealStyle(active, 620, 10)}
            >
              <div
                className="pointer-events-none absolute inset-3 rounded-xl border border-background/10"
                style={{
                  opacity: active ? 1 : 0,
                  transform: active ? "scale(1)" : "scale(0.94)",
                  transition:
                    "opacity 600ms ease 850ms, transform 600ms ease 850ms",
                }}
                aria-hidden
              />
              <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-background/25">
                <Sparkles className="h-6 w-6" aria-hidden />
              </div>
              <div className="relative font-display text-3xl tracking-tight">
                Deskpoint
              </div>
              <p className="relative mt-3 text-sm text-background/60 leading-relaxed">
                Единый слой приёма: ИИ-разбор, эскалация и поток обращений в
                одном кабинете.
              </p>
            </div>

            <FlowLine active={active} delayMs={900} />
            <div className="order-4 lg:contents">
              <FlowArrowMobile active={active} delayMs={900} />
            </div>

            {/* Right pillar */}
            <div className="space-y-3 order-5 lg:order-none">
              <p
                className="font-mono text-[11px] uppercase tracking-widest text-background/45 mb-1"
                style={revealStyle(active, 980, 8)}
              >
                Аналитика и контроль команды
              </p>
              {analyticsCards.map((card, i) => (
                <PillarCard
                  key={card.title}
                  {...card}
                  active={active}
                  delayMs={1040 + i * 120}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
