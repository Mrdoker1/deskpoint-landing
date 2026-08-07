import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных — Deskpoint",
  description:
    "Политика обработки персональных данных Deskpoint (152-ФЗ). Черновик для юридической проверки.",
};

export default function PrivacyPage() {
  // TODO: требует юридического ревью перед продакшн-релизом
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <article className="max-w-3xl mx-auto px-6 lg:px-12 pt-32 pb-24">
        {/* TODO: требует юридического ревью перед продакшн-релизом */}
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
          Черновик · не финальная редакция
        </p>
        <h1 className="text-4xl lg:text-5xl font-display tracking-tight mb-8">
          Политика обработки персональных данных
        </h1>
        <div className="prose-landing space-y-8 text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-display text-foreground">1. Общие положения</h2>
            <p>
              Настоящий документ — плейсхолдер политики обработки персональных
              данных пользователей сайта и сервиса Deskpoint. Оператор: ООО
              «Триггер Тех» (реквизиты — на странице{" "}
              <Link href="/requisites" className="underline underline-offset-4 hover:text-foreground">
                /requisites
              </Link>
              ). Текст подлежит согласованию с юристом до публикации в
              продакшене.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display text-foreground">
              2. Какие данные обрабатываем
            </h2>
            <p>
              Перечень категорий ПДн (ФИО, email, телефон, сведения о компании из
              формы заявки; данные клиентов тенантов в рамках оказания услуги —
              отдельно) уточняется в финальной редакции.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display text-foreground">
              3. Цели обработки
            </h2>
            <p>
              Обработка заявок на демо, заключение договора, оказание услуг
              омниканальных коммуникаций, исполнение требований законодательства
              РФ — формулировки финализирует юрист.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display text-foreground">
              4. Правовые основания и сроки
            </h2>
            <p>
              Согласия, договоры, сроки хранения, порядок уничтожения, права
              субъекта ПДн (доступ, уточнение, отзыв согласия, удаление) —
              плейсхолдер до юридического ревью.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display text-foreground">
              5. Место хранения и передача
            </h2>
            <p>
              Ориентир продукта — размещение инфраструктуры в Российской
              Федерации. Фактические площадки, трансграничная передача (если
              применимо), поручение обработки — в финальном тексте.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display text-foreground">6. Контакты</h2>
            <p>
              По вопросам персональных данных:{" "}
              <a
                href="mailto:hello@deskpoint.ru"
                className="underline underline-offset-4 hover:text-foreground"
              >
                hello@deskpoint.ru
              </a>
              . Отдельный адрес DPO / ответственного за ПДн — после ревью.
            </p>
          </section>

          <p className="text-sm pt-4">
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
