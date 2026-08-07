"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedTetrahedron } from "./animated-tetrahedron";

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

  return (
    <section
      id="lead"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
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

          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
              <div className="flex-1 w-full max-w-xl">
                <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8 leading-[0.95]">
                  Оставьте заявку —
                  <br />
                  покажем Deskpoint
                  <br />
                  на ваших обращениях.
                </h2>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                  Разберём единый приём каналов и аналитику по команде, подберём
                  пакет функций и посчитаем usage под ваш объём.
                </p>

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
                        <span className="mb-2 block text-sm text-muted-foreground">
                          Имя *
                        </span>
                        <input
                          name="name"
                          required
                          autoComplete="name"
                          className="w-full h-12 px-4 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground/50"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm text-muted-foreground">
                          Email *
                        </span>
                        <input
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          className="w-full h-12 px-4 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground/50"
                        />
                      </label>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="mb-2 block text-sm text-muted-foreground">
                          Телефон
                        </span>
                        <input
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          className="w-full h-12 px-4 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground/50"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm text-muted-foreground">
                          Компания
                        </span>
                        <input
                          name="company"
                          autoComplete="organization"
                          className="w-full h-12 px-4 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground/50"
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span className="mb-2 block text-sm text-muted-foreground">
                        Комментарий
                      </span>
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

                    <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
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
                    <p className="text-sm text-muted-foreground pt-2 font-mono">
                      hello@deskpoint.ru · ответ в рабочие дни
                    </p>
                  </form>
                )}
              </div>

              <div
                className="pointer-events-none relative hidden h-[1680px] w-[1680px] shrink-0 -ml-[420px] -mr-24 -mt-[417px] self-start opacity-70 lg:block"
                aria-hidden
              >
                <AnimatedTetrahedron
                  centerXRatio={0.5}
                  centerYRatio={0.42}
                  fill={0.9}
                  speed={0.55}
                  opacityScale={1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
