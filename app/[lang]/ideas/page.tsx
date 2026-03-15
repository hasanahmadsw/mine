import { IdeasPage } from "@/components/pages/IdeasPage";
import { getSortedIdeasData, getFeaturedIdeas, getAllIdeaCategories } from "@/lib/ideas";
import { getDictionary } from "@/utils/translations/dictionary-utils";
import type { Lang } from "@/utils/translations/i18n-config";
import { createMeta } from "@/utils/seo/meta/createMeta";

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const { ideas } = await getDictionary(lang);
  return createMeta({
    lang,
    title: ideas.meta.title,
    description: ideas.meta.description,
    keywords: ideas.meta.keywords,
    authors: ideas.meta.authors,
    pathname: "/ideas",
  });
}

export default async function Ideas({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const dictionaries = await getDictionary(lang);
  const articles = getSortedIdeasData(lang);
  const featured = getFeaturedIdeas(lang);
  const categories = ["all", ...getAllIdeaCategories(lang)];

  return (
    <main>
      <IdeasPage
        articles={articles}
        featuredArticles={featured}
        categories={categories}
        ideasDict={dictionaries.ideas}
        contactDict={dictionaries.contact}
        lang={lang}
      />
    </main>
  );
} 