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
  { name: "API", href: "/#api" },
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
            {/* Локап высокий: дуги уходят далеко выше и ниже строки, бокс 93
                юнита против прежних 51. Кегль подобран так, чтобы знак влезал в
                бар с воздухом: 19px → 46px в h-16, 23px → 55px в h-20. */}
            <Logo className="text-[19px] lg:text-[23px]" />
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
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="space-y-3 border-t border-foreground/10 py-4 md:hidden">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={withBase(link.href)}
                className="block py-2 text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a
              href={DASHBOARD_URL}
              className="block py-2 text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Войти
            </a>
            <a
              href={withBase("/#lead")}
              className="block py-2 text-sm font-medium text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Оставить заявку
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
