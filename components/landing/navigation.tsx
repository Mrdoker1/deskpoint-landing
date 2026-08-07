"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { withBase } from "@/lib/base-path";

const navLinks = [
  { name: "Возможности", href: "/#features" },
  { name: "Как это работает", href: "/#how-it-works" },
  { name: "Тарифы", href: "/#pricing" },
];

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3005";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Меню занимает весь экран, поэтому страницу под ним нужно застопорить —
   * иначе прокрутка уходит в неё и панель едет вместе с фоном. Escape закрывает:
   * на полноэкранной панели крестик может оказаться вне досягаемости большого
   * пальца, а выйти надо всегда.
   */
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileMenuOpen]);

  // The bar keeps its full width and height at every scroll position — only the
  // backdrop firms up, so it never collapses into a floating strip. At the top
  // it stays fully transparent: a translucent fill over the page's gradient
  // reads as a visible band across the hero.
  const hasBackdrop = isScrolled || isMobileMenuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        hasBackdrop
          ? "border-foreground/10 bg-background/90 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-6 lg:h-20">
          <a href={withBase("/")} className="flex items-center">
            {/* Локап высокий — дуги уходят далеко выше и ниже строки, бокс 94
                юнита. Кегль: 15px → 36px в h-16, 18px → 44px в h-20. */}
            <Logo className="text-[15px] lg:text-[18px]" />
          </a>

          <div className="hidden items-center justify-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={withBase(link.href)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center justify-end gap-4">
            <a
              href={DASHBOARD_URL}
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:inline"
            >
              Войти
            </a>
            <Button
              asChild
              className="hidden rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 md:inline-flex"
            >
              <a href={withBase("/#lead")}>Оставить заявку</a>
            </Button>

            <button
              type="button"
              className="-mr-2 p-2 md:hidden"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label="Меню"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/*
          Панель на весь экран ниже бара: top-16 совпадает с его высотой (бар на
          мобильном h-16), поэтому логотип и крестик остаются видимыми и рабочими
          — z-40 против z-50 у шапки. Разделы крупным кеглем, вход и заявка
          прижаты к низу, где до них дотягивается палец.
        */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col overflow-y-auto bg-background px-6 pb-10 pt-10 md:hidden"
          >
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={withBase(link.href)}
                  className="border-b border-foreground/10 py-5 font-display text-4xl tracking-tight"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="mt-auto space-y-4 pt-10">
              <a
                href={DASHBOARD_URL}
                className="block text-center text-lg text-muted-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Войти
              </a>
              <Button
                asChild
                className="h-14 w-full rounded-full bg-primary text-base text-primary-foreground shadow-md hover:bg-primary/90"
              >
                <a
                  href={withBase("/#lead")}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Оставить заявку
                </a>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
