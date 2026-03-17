import type { Metadata } from "next";
import { seoConfig } from "@/utils/seo/seo.config";
import "./globals.css";
import { getDictionary } from "@/utils/translations/dictionary-utils";
import type { Lang } from "@/utils/translations/i18n-config";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LangAttribute } from "@/components/LangAttribute";

export async function generateMetadata(): Promise<Metadata> {
  return {
    // title: {
    //   template: `%s | ${seoConfig.siteName}`,
    //   default: seoConfig.siteName,
    // },
    robots: { googleBot: { index: true, follow: true } },
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const langTyped = lang as Lang;
  const dictionaries = await getDictionary(langTyped);

  return (
    <div>
      <LangAttribute lang={langTyped} />
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <Header commonDict={dictionaries.common} lang={langTyped} />
        {children}
        <Footer commonDict={dictionaries.common} lang={langTyped} />
      </ThemeProvider>
    </div>
  );
}
