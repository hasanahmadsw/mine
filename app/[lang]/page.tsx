import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { IdeasSection } from "@/components/sections/IdeasSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { ContactSection } from "@/components/sections/ContactSection";
import { JsonLd } from "@/components/JsonLd";
import { getFeaturedIdeas } from "@/lib/ideas";
import { getDictionary } from "@/utils/translations/dictionary-utils";
import type { Lang } from "@/utils/translations/i18n-config";
import { createMeta } from "@/utils/seo/meta/createMeta";
import { generateHomeSchema } from "@/utils/seo/schema/home-schema";

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const { common } = await getDictionary(lang);
  return createMeta({
    lang,
    title: common.meta.title,
    description: common.meta.description,
    keywords: common.meta.keywords,
    authors: common.meta.authors,
    pathname: "/",
  });
}

export default async function Home({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const dictionaries = await getDictionary(lang);
  const featuredIdeas = getFeaturedIdeas(lang);

  return (
    <main>
      <JsonLd data={generateHomeSchema(lang)} />
      <HeroSection homeDict={dictionaries.home} lang={lang} />
      <AboutSection aboutDict={dictionaries.about} lang={lang} />
      <IdeasSection featuredIdeas={featuredIdeas} ideasDict={dictionaries.ideas} lang={lang} />
      <PhilosophySection philosophyDict={dictionaries.philosophy} lang={lang} />
      <ContactSection contactDict={dictionaries.contact} lang={lang} />
    </main>
  );
}
