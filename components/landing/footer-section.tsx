"use client";

import { AnimatedWave } from "./animated-wave";
import { Logo } from "./logo";
import { withBase } from "@/lib/base-path";

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3005";

const footerLinks = {
  Продукт: [
    { name: "Возможности", href: "/#features" },
    { name: "Как это работает", href: "/#how-it-works" },
    { name: "Тарифы", href: "/#pricing" },
    { name: "Интеграции", href: "/#integrations" },
  ],
  Компания: [
    { name: "Данные и 152-ФЗ", href: "/#data" },
    { name: "Безопасность", href: "/#security" },
    { name: "Кейсы", href: "/#cases" },
    { name: "Пилот", href: "/#pilot" },
  ],
  Правовое: [
    { name: "Реквизиты", href: "/requisites" },
    { name: "Политика ПДн", href: "/privacy" },
    { name: "Войти", href: DASHBOARD_URL },
    { name: "Оставить заявку", href: "/#lead" },
  ],
};

export function FooterSection() {
  return (
    <footer className="relative border-t border-foreground/10">
      <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 lg:gap-8">
            <div className="col-span-2">
              <a href={withBase("/")} className="inline-flex items-center gap-2 mb-6">
                <Logo className="text-[20px]" /> {/* 49px — в футере места больше, чем в баре шапки */}
              </a>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-xs">
                Аналитика команды поддержки и все каналы связи в одном кабинете
                — для сервисного бизнеса в России.
              </p>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={withBase(link.href)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 Deskpoint</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <a href={withBase("/privacy")} className="hover:text-foreground transition-colors">
              Политика ПДн
            </a>
            <a
              href={withBase("/requisites")}
              className="hover:text-foreground transition-colors"
            >
              Реквизиты
            </a>
            <a
              href="mailto:hello@deskpoint.ru"
              className="hover:text-foreground transition-colors"
            >
              hello@deskpoint.ru
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
