"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LOGO_ACCENT, LOGO_SPARK, SPARK_BOX } from "@/lib/logo-mark";
import { ArrowRight } from "lucide-react";

type SubmitState = "idle" | "loading" | "success" | "error";

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

              {/*
                Звезда из знака вместо hero-flows.svg: тот был нарисован под
                первый экран, и сжатый до 420px давал волосяные линии по 1.1px —
                при полупрозрачности от них оставалась дымка. Плюс при высоте
                480px он накрывал весь столбец: столбец в grid растягивается на
                высоту строки, поэтому привязка к низу не спасала. Звезда —
                сплошная фигура, чёткая в любом размере, и садится в реально
                пустой левый низ карточки. Ниже lg столбцы складываются, места
                нет — там не показываем.
              */}
              <svg
                viewBox={`${SPARK_BOX.x} ${SPARK_BOX.y} ${SPARK_BOX.w} ${SPARK_BOX.h}`}
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 hidden h-32 w-32 select-none opacity-[0.13] lg:block"
              >
                <path d={LOGO_SPARK} fill={LOGO_ACCENT} />
              </svg>
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
                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitState === "loading"}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-14 text-base rounded-full group shadow-lg"
                    >
                      {submitState === "loading"
                        ? "Отправляем…"
                        : "Оставить заявку на демо"}
                      {submitState !== "loading" && (
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      )}
                    </Button>
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
