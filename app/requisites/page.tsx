import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";

export const metadata: Metadata = {
  title: "Реквизиты — Deskpoint",
  description: "Реквизиты юридического лица Trigger Tech / Deskpoint.",
};

export default function RequisitesPage() {
  // TODO: требует юридического ревью перед продакшн-релизом
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <article className="max-w-3xl mx-auto px-6 lg:px-12 pt-32 pb-24">
        {/* TODO: требует юридического ревью перед продакшн-релизом */}
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
          Черновик · не финальные реквизиты
        </p>
        <h1 className="text-4xl lg:text-5xl font-display tracking-tight mb-8">
          Реквизиты
        </h1>
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Ниже — плейсхолдер реквизитов оператора сервиса Deskpoint (Trigger
            Tech). Перед публикацией заменить на подтверждённые данные.
          </p>
          <dl className="space-y-4 border border-foreground/10 p-6 lg:p-8">
            <div>
              <dt className="text-sm font-mono text-muted-foreground mb-1">
                Полное наименование
              </dt>
              <dd className="text-foreground">
                ООО «Триггер Тех» (плейсхолдер)
              </dd>
            </div>
            <div>
              <dt className="text-sm font-mono text-muted-foreground mb-1">
                ИНН / КПП
              </dt>
              <dd className="text-foreground">0000000000 / 000000000</dd>
            </div>
            <div>
              <dt className="text-sm font-mono text-muted-foreground mb-1">
                ОГРН
              </dt>
              <dd className="text-foreground">0000000000000</dd>
            </div>
            <div>
              <dt className="text-sm font-mono text-muted-foreground mb-1">
                Юридический адрес
              </dt>
              <dd className="text-foreground">
                Российская Федерация, [город, улица, дом]
              </dd>
            </div>
            <div>
              <dt className="text-sm font-mono text-muted-foreground mb-1">
                Банковские реквизиты
              </dt>
              <dd className="text-foreground">р/с · банк · БИК · к/с — уточняется</dd>
            </div>
            <div>
              <dt className="text-sm font-mono text-muted-foreground mb-1">
                Контакт
              </dt>
              <dd className="text-foreground">
                <a
                  href="mailto:hello@deskpoint.ru"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  hello@deskpoint.ru
                </a>
              </dd>
            </div>
          </dl>
          <p className="text-sm">
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">
              ← На главную
            </Link>
          </p>
        </div>
      </article>
      <FooterSection />
    </main>
  );
}
