import { PhilosophyPage } from "@/components/pages/PhilosophyPage";
import { getDictionary } from "@/utils/translations/dictionary-utils";
import type { Lang } from "@/utils/translations/i18n-config";
import { createMeta } from "@/utils/seo/meta/createMeta";

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const { philosophy } = await getDictionary(lang);
  return createMeta({
    lang,
    title: philosophy.meta.title,
    description: philosophy.meta.description,
    keywords: philosophy.meta.keywords,
    authors: philosophy.meta.authors,
    pathname: "/philosophy",
  });
}

export default async function Philosophy({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const dictionaries = await getDictionary(lang);
  return (
    <main>
      <PhilosophyPage philosophyDict={dictionaries.philosophy} lang={lang} />
    </main>
  );
} 