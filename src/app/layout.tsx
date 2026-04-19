import type { Metadata } from "next";

import { getSiteUrl } from "@/lib/seo/site";

import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Канцелярия в Пятигорске — магазин канцтоваров «Эквилибриум»",
    template: "%s",
  },
  description:
    "Канцтовары, бумажная продукция, товары для творчества и рюкзаки в Пятигорске. Интернет-магазин канцелярии «Эквилибриум» — спокойный выбор для школы, офиса и творчества.",
  applicationName: "Эквилибриум",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "Эквилибриум",
    title: "Канцелярия в Пятигорске — магазин канцтоваров «Эквилибриум»",
    description:
      "Канцтовары и канцелярия в Пятигорске. Онлайн-каталог «Эквилибриум»: школа, офис, творчество.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Канцелярия в Пятигорске — «Эквилибриум»",
    description: "Канцтовары и канцелярия в Пятигорске. Интернет-магазин с доставкой и самовывозом по согласованию.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
