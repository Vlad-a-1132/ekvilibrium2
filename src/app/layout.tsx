import type { Metadata } from "next";

import { getSiteUrl } from "@/lib/seo/site";

import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Эквилибриум — канцелярия и канцтовары",
    template: "%s",
  },
  description: "Интернет-магазин канцелярии в Пятигорске.",
  applicationName: "Эквилибриум",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "Эквилибриум",
    title: "Эквилибриум — канцелярия",
    description: "Канцтовары и канцелярия в Пятигорске.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Эквилибриум — канцелярия",
    description: "Канцтовары в Пятигорске.",
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
