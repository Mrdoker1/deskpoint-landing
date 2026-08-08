"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { withBase } from "@/lib/base-path";
import { ArrowRight, Play } from "lucide-react";

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

      {/* Абстрактные «потоки в точку»: слева — истоки каналов, справа — узел.
          Стоят строго за границей коробки 950px — она чуть шире самих строк
          заголовка (~870px), поэтому до букв остаётся воздух и линии на них не
          заходят ни при какой ширине окна.
          Ширина — свободное место сбоку с небольшим вылетом за край: линии заполняют весь
          просвет и слегка уходят за край экрана, отчего рисунок крупнее, а
          расстояние до текста не меняется. Узел правого потока сидит на 67%
          ширины, поэтому в кадре остаётся. Дальше потолка линии не растут —
          на широком мониторе они стоят у текста, а излишек уходит к краям. Ниже 1400px места нет вовсе —
          там линии не показываем, чтобы не лезли на текст обрубками. */}
      <div
        className="pointer-events-none absolute inset-0 z-0 mx-auto hidden max-w-[950px] select-none min-[1300px]:block"
        aria-hidden="true"
      >
        <img
          src={withBase("/hero-flows-left.svg")}
          alt=""
          className={`absolute right-full top-1/2 w-[clamp(150px,calc((100vw-950px)*0.6),780px)] -translate-y-1/2 transition-opacity duration-1000 delay-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        />
        <img
          src={withBase("/hero-flows.svg")}
          alt=""
          className={`absolute left-full top-1/2 w-[clamp(150px,calc((100vw-950px)*0.6),860px)] -translate-y-1/2 transition-opacity duration-1000 delay-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1080px] px-6 py-24 text-center lg:py-32">
        <p
          className={`font-mono text-xs font-medium uppercase tracking-[0.22em] text-primary lg:text-sm ${reveal(
            ""
          )}`}
        >
          Для сервисного бизнеса в России
        </p>

        <h1
          className={`mx-auto mt-8 max-w-[19ch] text-balance font-display lg:max-w-none lg:[text-wrap:normal] text-[clamp(2.25rem,6vw,4.75rem)] leading-[1.03] tracking-tight ${reveal(
            "delay-100"
          )}`}
        >
          Вся аналитика команды{" "}
          <br className="hidden lg:inline" />
          поддержки и все каналы{" "}
          <br className="hidden lg:inline" />
          связи в одном окне
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

        {/*
          Одна строка на любой ширине: поле и кнопка внутри общей «пилюли».
          На узком экране кнопка ужимается кеглем и внутренними отступами, а поле
          отдаёт ей место через min-w-0 — переносить кнопку под поле не нужно.
        */}
        <form
          onSubmit={handleSubmit}
          className={`mx-auto mt-12 flex w-full max-w-[620px] items-center rounded-full border border-foreground/15 bg-card/60 py-1.5 pl-5 pr-1.5 shadow-sm backdrop-blur-sm sm:pl-7 ${reveal(
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
            className="h-12 min-w-0 flex-1 bg-transparent px-0 text-base placeholder:text-muted-foreground focus:outline-none"
          />
          <Button
            type="submit"
            size="lg"
            className="group h-12 shrink-0 rounded-full bg-primary px-5 text-sm text-primary-foreground shadow-md hover:bg-primary/90 sm:px-8 sm:text-base"
          >
            Оставить заявку
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>

        {/*
          Вторичное действие — ссылкой, а не кнопкой: рядом с основной формой
          вторая кнопка перетягивала внимание. Подчёркивание постоянное, а не по
          ховеру: на тач-скрине ховера нет, и без него ссылка не читалась как
          кликабельная. Название прямое — прежнее «Посмотреть, как это работает»
          не говорило, что там демо. Ведёт на #demo — плеер в «Как это работает».
        */}
        <a
          href="#demo"
          className={`mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground ${reveal(
            "delay-500"
          )}`}
        >
          {/* Треугольник залит: в контурном виде на 14px он читается как
              случайная галочка. Подчёркнут только текст — иконка под чертой
              выглядит грязно. */}
          <Play className="h-3.5 w-3.5 shrink-0 fill-current" />
          <span className="underline decoration-foreground/30 underline-offset-4">
            Смотреть демо
          </span>
        </a>
      </div>
    </section>
  );
}
