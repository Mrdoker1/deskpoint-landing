"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { withBase } from "@/lib/base-path";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  /**
   * The hero field is a shortcut into the full form in #lead — /api/leads needs
   * a name as well, so an address alone cannot be submitted. Carry what was
   * typed down to the form and put the cursor in the first missing field.
   */
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const section = document.getElementById("lead");
    if (!section) return;

    const emailInput =
      section.querySelector<HTMLInputElement>('input[name="email"]');
    if (emailInput && email) {
      emailInput.value = email;
      emailInput.dispatchEvent(new Event("input", { bubbles: true }));
    }

    section.scrollIntoView({ behavior: "smooth", block: "start" });
    section
      .querySelector<HTMLInputElement>('input[name="name"]')
      ?.focus({ preventScroll: true });
  }

  const reveal = (delay: string) =>
    `transition-all duration-700 ${delay} ${
      isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    }`;

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-16 lg:pt-20">
      {/* Static warm halo instead of the animated ASCII sphere — it read as
          noise behind the headline at any opacity that was still visible. */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[620px] w-[min(1150px,110vw)] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklch, var(--dp-primary) 14%, transparent), color-mix(in oklch, var(--dp-primary) 5%, transparent) 55%, transparent 80%)",
        }}
      />

      {/* Абстрактные «потоки в точку»: слева — истоки каналов, справа — узел-точка.
          Только на широких экранах, под текст не лезут. */}
      <img
        src={withBase("/hero-flows-left.svg")}
        alt=""
        aria-hidden="true"
        className={`pointer-events-none absolute -left-10 top-1/2 z-0 hidden w-[clamp(280px,23vw,430px)] -translate-y-1/2 select-none transition-opacity duration-1000 delay-300 lg:block ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />
      <img
        src={withBase("/hero-flows.svg")}
        alt=""
        aria-hidden="true"
        className={`pointer-events-none absolute -right-10 top-1/2 z-0 hidden w-[clamp(320px,26vw,480px)] -translate-y-1/2 select-none transition-opacity duration-1000 delay-300 lg:block ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1080px] px-6 py-24 text-center lg:py-32">
        <p
          className={`font-mono text-xs font-medium uppercase tracking-[0.22em] text-primary lg:text-sm ${reveal(
            ""
          )}`}
        >
          Для сервисного бизнеса в России
        </p>

        <h1
          className={`mx-auto mt-8 max-w-[19ch] text-balance font-display text-[clamp(2.25rem,6vw,4.75rem)] leading-[1.03] tracking-tight ${reveal(
            "delay-100"
          )}`}
        >
          Вся аналитика команды поддержки и все каналы связи в одном окне
        </h1>

        <p
          className={`mx-auto mt-8 max-w-[46rem] text-balance text-lg leading-relaxed text-muted-foreground lg:text-xl ${reveal(
            "delay-200"
          )}`}
        >
          Deskpoint собирает звонки, переписки в мессенджерах и чат на сайте в
          один кабинет — с ИИ-анализом каждого диалога и понятной статистикой по
          каждому сотруднику и по отделу.
        </p>

        <form
          onSubmit={handleSubmit}
          className={`mx-auto mt-12 flex w-full max-w-[620px] flex-col gap-2 rounded-3xl border border-foreground/15 bg-card/60 p-2 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:py-1.5 sm:pl-7 sm:pr-1.5 ${reveal(
            "delay-300"
          )}`}
        >
          <label htmlFor="hero-email" className="sr-only">
            Рабочий email
          </label>
          <input
            id="hero-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Рабочий email"
            className="h-12 min-w-0 flex-1 rounded-full bg-transparent px-5 text-base placeholder:text-muted-foreground focus:outline-none sm:px-0"
          />
          <Button
            type="submit"
            size="lg"
            className="group h-12 shrink-0 rounded-full bg-primary px-8 text-base text-primary-foreground shadow-md hover:bg-primary/90"
          >
            Оставить заявку
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>

        <a
          href="#demo"
          className={`mt-6 inline-block text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline ${reveal(
            "delay-500"
          )}`}
        >
          Посмотреть, как это работает
        </a>
      </div>
    </section>
  );
}
