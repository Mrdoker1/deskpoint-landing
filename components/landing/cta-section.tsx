"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type SubmitState = "idle" | "loading" | "success" | "error";

/**
 * Потоки, приходящие в кнопку заявки, — продолжение рисунка с первого экрана:
 * те же сходящиеся кривые с бегущими импульсами, те же цвета.
 *
 * Точка сходимости — правый край viewBox у самого верха. svg прижат к левому
 * краю кнопки через right-full, а top-1/2 ставит его верх на центр кнопки,
 * поэтому сходимость всегда попадает ровно в кнопку и следует за ней при любой
 * ширине — подгонять координаты под вёрстку не нужно. Ширина 820 уводит истоки
 * к левому краю карточки; что не помещается, обрезает её overflow-hidden.
 *
 * -mr-10 заводит сходимость на 40px внутрь кнопки. Кнопка rounded-full, её левая
 * кромка — полукруг радиусом 28px: крайняя левая точка только на осевой линии, а
 * на 27px ниже центра кромка уже смещена вправо на 20.6px. Упирая линии ровно в
 * левый край, мы оставляли у нижних из них именно этот зазор. Кнопка идёт после
 * svg и с relative, поэтому перекрывает концы — линии уходят под неё.
 *
 * Высота 150, а не больше: ниже кнопки в карточке всего около 92px (её нижняя
 * кромка плюс паддинг), и всё, что дальше, срезается границей карточки. С 240
 * за кадром оставалось больше половины рисунка, и он выглядел сползшим вниз.
 *
 * Изгиб построен как в hero-flows.svg: первая контрольная точка уносится далеко
 * вперёд, оставаясь на высоте истока, а вторая возвращается назад, но уже на
 * высоту точки сходимости. Из-за этого кривая сначала уходит в сторону и только
 * потом подворачивает — получается извилистая линия, а не прямой луч. Истоки
 * разбросаны за края бокса (svg обрезает по viewBox), поэтому потоки будто
 * приходят из разных мест за кадром.
 *
 * ВАЖНО: ничего не поднимается выше центра кнопки. Кнопка стоит в правом столбце
 * на своём месте от верха формы, а текст слева растёт вниз при сужении окна —
 * зазор между низом строки с почтой и центром кнопки на широком экране около
 * 49px, а на xl схлопывается в ноль, потому что левый столбец становится выше
 * формы. Поэтому любой поток, уходящий вверх, рано или поздно попадёт на текст;
 * держим их на уровне центра и ниже, там пусто при любой ширине.
 *
 * Чтобы линии не сбивались в одну точку у верхнего края, приходят они на разную
 * высоту левой кромки кнопки (4…27 — нижняя половина её 56px).
 *
 * Потоки не пересекаются, и это следствие порядка, а не подгонки: чем ниже исток,
 * тем ниже и приход, и тем правее вторая контрольная точка (220 → 455). Кривые
 * из-за этого вложены одна в другую — нижняя подворачивает позже верхней и
 * обогнать её не может. Стоит нарушить любой из трёх рядов — линии начнут
 * резать друг друга.
 */
const LEAD_FLOWS = [
  { d: "M-40 26C440 42 220 4 820 4", op: 0.2, dur: "9.5s", delay: "-1.2s" },
  { d: "M-40 64C440 82 255 9 820 9", op: 0.22, dur: "12.5s", delay: "-4.1s" },
  { d: "M-30 100C450 116 295 14 820 14", op: 0.16, dur: "8.5s", delay: "-2.6s" },
  { d: "M40 130C470 142 345 19 820 19", op: 0.12, dur: "11s", delay: "-6.2s" },
  { d: "M240 154C560 152 455 23 820 23", op: 0.1, dur: "10s", delay: "-7.4s" },
];

function LeadFlows() {
  return (
    <svg
      viewBox="0 0 820 150"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute right-full top-1/2 -mr-10 -mt-1 hidden h-[150px] w-[820px] select-none lg:block"
    >
      <style>{`
        .lf-pulse {
          fill: none;
          stroke-linecap: round;
          stroke-dasharray: 0.12 0.88;
          animation: lf-flow linear infinite;
        }
        @keyframes lf-flow {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lf-pulse { display: none; }
        }
      `}</style>
      {LEAD_FLOWS.map((f) => (
        <path
          key={f.d}
          d={f.d}
          stroke="#402718"
          strokeOpacity={f.op}
          strokeWidth="1.6"
        />
      ))}
      {LEAD_FLOWS.map((f) => (
        <path
          key={`pulse-${f.d}`}
          className="lf-pulse"
          d={f.d}
          pathLength="1"
          stroke="#74452c"
          strokeOpacity="0.6"
          strokeWidth="2.2"
          style={{ animationDuration: f.dur, animationDelay: f.delay }}
        />
      ))}
    </svg>
  );
}

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitState("loading");
    setErrorMessage(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      company: String(fd.get("company") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setSubmitState("error");
        setErrorMessage(json.error ?? "Не удалось отправить заявку");
        return;
      }
      setSubmitState("success");
      form.reset();
      try {
        const { trackLeadGoal } = await import(
          "@/components/analytics/AnalyticsScripts"
        );
        trackLeadGoal();
      } catch {
        /* ignore */
      }
    } catch {
      setSubmitState("error");
      setErrorMessage("Сеть недоступна. Попробуйте ещё раз.");
    }
  }

  const field =
    "w-full h-12 px-4 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground/50";
  const fieldLabel = "mb-2 block text-sm text-muted-foreground";

  return (
    <section
      id="lead"
      ref={sectionRef}
      className="relative py-20 lg:py-28 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`relative border border-foreground overflow-hidden transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          onMouseMove={handleMouseMove}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, oklch(0.44 0.075 48 / 0.2), transparent 42%)`,
            }}
          />

          {/*
            Текст слева, форма справа: в один столбец заголовок в три строки
            съедал первый экран и поля уходили под сгиб. В два столбца поля
            начинаются на той же высоте, что и заголовок.
          */}
          <div className="relative z-10 grid gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:gap-16 lg:px-12 lg:py-16">
            <div className="relative flex flex-col">
              <h2 className="text-3xl lg:text-5xl font-display tracking-tight leading-[1.02]">
                Оставьте заявку — покажем Deskpoint на ваших обращениях.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-md">
                Разберём единый приём каналов и аналитику по команде, подберём
                пакет функций и посчитаем usage под ваш объём.
              </p>
              <p className="mt-6 text-sm text-muted-foreground font-mono">
                <a
                  href="mailto:hello@deskpoint.ru"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  hello@deskpoint.ru
                </a>{" "}
                · ответ в рабочие дни
              </p>

            </div>

            <div className="relative">
              {submitState === "success" ? (
                <div className="border border-foreground/15 p-6">
                  <p className="text-lg font-display mb-2">Заявка принята</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Мы свяжемся в рабочие дни. Можно также написать на{" "}
                    <a
                      href="mailto:hello@deskpoint.ru"
                      className="underline underline-offset-4 hover:text-foreground"
                    >
                      hello@deskpoint.ru
                    </a>
                    .
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-6 rounded-full"
                    onClick={() => setSubmitState("idle")}
                  >
                    Отправить ещё одну
                  </Button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className={fieldLabel}>Имя *</span>
                      <input
                        name="name"
                        required
                        autoComplete="name"
                        className={field}
                      />
                    </label>
                    <label className="block">
                      <span className={fieldLabel}>Email *</span>
                      <input
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className={field}
                      />
                    </label>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className={fieldLabel}>Телефон</span>
                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        className={field}
                      />
                    </label>
                    <label className="block">
                      <span className={fieldLabel}>Компания</span>
                      <input
                        name="company"
                        autoComplete="organization"
                        className={field}
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className={fieldLabel}>Комментарий</span>
                    <textarea
                      name="message"
                      rows={3}
                      className="w-full px-4 py-3 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground/50 resize-y"
                    />
                  </label>

                  {errorMessage && (
                    <p className="text-sm text-red-700" role="alert">
                      {errorMessage}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    {/* Потоки приходят в кнопку слева, кнопка отзывается
                        расходящимся кольцом. Обёртка relative — точка отсчёта и
                        для потоков, и для кольца. */}
                    <span className="relative inline-flex shrink-0">
                      <LeadFlows />
                      <span
                        aria-hidden="true"
                        className="lead-pulse pointer-events-none absolute inset-0 rounded-full border border-primary/50"
                      />
                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitState === "loading"}
                      /* Ховер непрозрачный, а не bg-primary/90: под кнопку
                         уходят линии потоков, и через полупрозрачный фон они
                         просвечивали. color-mix даёт ровно тот цвет, который
                         давала полупрозрачность поверх фона страницы, так что
                         кнопка выглядит как прежде. */
                      className="relative bg-primary hover:bg-[color-mix(in_oklch,var(--dp-primary)_90%,var(--dp-background))] text-primary-foreground px-8 h-14 text-base rounded-full group shadow-lg"
                    >
                      {submitState === "loading"
                        ? "Отправляем…"
                        : "Оставить заявку на демо"}
                      {submitState !== "loading" && (
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      )}
                    </Button>
                    </span>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-14 px-8 text-base rounded-full border-foreground/25 hover:bg-primary/10 hover:border-primary/40"
                    >
                      <a href="#demo">Как это работает</a>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
