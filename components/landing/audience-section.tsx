"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { withBase } from "@/lib/base-path";

/** No fabricated testimonials — invite early customers instead. */
export function AudienceSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
      id="pilot"
      ref={sectionRef}
      className="relative overflow-hidden py-24 lg:py-32 border-t border-foreground/10"
    >
      {/*
        Картинка прижата к левому краю свободной зоны, то есть стоит вплотную к
        тексту. Левая граница зоны считается точно: контейнер имеет
        max-w-[1400px] и mx-auto, значит его контент начинается на
        max((100vw − 1400)/2, 0) + 48 (это lg:px-12). Смещение 720, а не 768 по
        max-w-3xl текстового блока: абзац внутри ограничен max-w-2xl = 672,
        поэтому 96 юнитов справа от него всё равно пустуют и картинка может зайти
        в них, не задев строк.

        По низу упирается в границу секции: bottom-0 плюс overflow-hidden у секции
        срежут всё, что не поместится. Ширина тянется по зоне до 560 — так
        картинка растёт вместе с экраном, а не остаётся мелкой на широком.

        Показываем от xl: на 1280 зона выходит около 460px, ниже она схлопывается
        и картинка полезла бы на текст.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 hidden select-none xl:flex xl:items-end xl:justify-start"
        style={{ left: "calc(max((100vw - 1400px) / 2, 0px) + 720px)" }}
      >
        <img
          src={withBase("/man.png")}
          alt=""
          className={`w-full max-w-[560px] transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`max-w-3xl transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Пилот
          </span>
          <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6">
            Станьте одним
            <br />
            из первых клиентов.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Мы не публикуем чужие имена и цитаты. Ищем пилотных партнёров среди
            клиник, автосервисов, салонов, юрпрактик и фитнес-клубов — чтобы
            вместе довести продукт на реальном потоке обращений. Когда появится
            согласованный отзыв — опубликуем его отдельно.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-14 px-8 group shadow-lg"
          >
            <a href="#lead">
              Оставить заявку на пилот
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
