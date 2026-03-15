import { IdeaDetail } from "@/components/pages/IdeaDetail";
import { JsonLd } from "@/components/JsonLd";
import { getSortedIdeasData, getIdeaBySlug, getRelatedIdeas, getAdjacentIdeas } from "@/lib/ideas";
import { notFound } from "next/navigation";
import { getDictionary } from "@/utils/translations/dictionary-utils";
import type { Lang } from "@/utils/translations/i18n-config";
import { createMeta } from "@/utils/seo/meta/createMeta";
import { generateIdeaArticleSchema } from "@/utils/seo/schema/idea-schema";

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang; slug: string }> }) {
  const { lang, slug } = await params;
  const { ideas } = await getDictionary(lang);
  const idea = await getIdeaBySlug(slug, lang);
  if (!idea) notFound();
  return createMeta({
    lang,
    title: idea.title,
    description: idea.excerpt ?? ideas.meta.description,
    type: "article",
    keywords: ideas.meta.keywords,
    authors: ideas.meta.authors,
    pathname: `/ideas/${slug}`,
  });
}

// Create a list of paths at build time
export async function generateStaticParams(): Promise<{ lang: Lang; slug: string }[]> {
  const langs: Lang[] = ["en", "ar"];
  const entries: { lang: Lang; slug: string }[] = [];
  for (const lang of langs) {
    const ideas = getSortedIdeasData(lang);
    for (const idea of ideas) {
      entries.push({ lang, slug: idea.slug });
    }
  }
  return entries;
}

export default async function IdeaPage({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string }>;
}) {
  const { lang, slug } = await params;
  const dictionaries = await getDictionary(lang);
  const idea = await getIdeaBySlug(slug, lang);

  // If thought is not found, return 404
  if (!idea) {
    notFound();
  }

  // Get related thoughts
  const relatedIdeas = getRelatedIdeas(slug, idea.category, lang);

  // Get next and previous thoughts
  const { previous, next } = getAdjacentIdeas(slug, lang);

  return (
    <main>
      <JsonLd data={generateIdeaArticleSchema(lang, idea, slug)} />
      <IdeaDetail
        idea={idea}
        ideasDict={dictionaries.ideas}
        lang={lang}
        relatedIdeas={relatedIdeas}
        previousIdea={previous}
        nextIdea={next}
      />
    </main>
  );
}