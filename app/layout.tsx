import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono, Noto_Sans } from "next/font/google";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-instrument",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
});

// Used only by the logo lockup (latin-only wordmark) — see components/landing/logo.tsx.
const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-noto-sans",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://deskpoint.ru";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Deskpoint — аналитика команды и все каналы связи в одном окне",
    template: "%s · Deskpoint",
  },
  description:
    "Единый кабинет для телефонии, мессенджеров и виджета плюс аналитика по каждому сотруднику и отделу. Для сервисного бизнеса в России.",
  applicationName: "Deskpoint",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "Deskpoint",
    title: "Deskpoint — аналитика команды и каналы в одном окне",
    description:
      "Звонки, мессенджеры и чат на сайте — в одном кабинете. ИИ-разбор диалогов и статистика по сотрудникам и отделу.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deskpoint — аналитика команды и каналы в одном окне",
    description:
      "Единый приём обращений и аналитика работы команды поддержки.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d9cfc0" },
    { media: "(prefers-color-scheme: dark)", color: "#3d2a1c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${manrope.variable} ${jetbrainsMono.variable} ${notoSans.variable} font-sans antialiased`}
      >
        <AnalyticsScripts />
        {children}
      </body>
    </html>
  );
}
