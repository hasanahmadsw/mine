import { AboutPage } from "@/components/pages/AboutPage";
import { getDictionary } from "@/utils/translations/dictionary-utils";
import type { Lang } from "@/utils/translations/i18n-config";
import { createMeta } from "@/utils/seo/meta/createMeta";

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const { about } = await getDictionary(lang);
  return createMeta({
    lang,
    title: about.meta.title,
    description: about.meta.description,
    keywords: about.meta.keywords,
    authors: about.meta.authors,
    pathname: "/about",
  });
}

export default async function About({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const dictionaries = await getDictionary(lang);
  return (
    <main>
      <AboutPage aboutDict={dictionaries.about} lang={lang} />
    </main>
  );
}
