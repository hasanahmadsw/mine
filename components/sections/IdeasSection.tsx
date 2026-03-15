import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { IdeasDict } from "@/utils/translations/dictionary-types";
import type { Lang } from "@/utils/translations/i18n-config";
import { fmt, getPathPrefix } from "@/utils/translations/language-utils";
import Link from "next/link";
import { IdeaMeta } from "@/lib/ideas";

type ArticleProps = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  lang: Lang;
  ideasDict: IdeasDict;
};

interface IdeasSectionProps {
  featuredIdeas: IdeaMeta[];
  ideasDict: IdeasDict;
  lang: Lang;
}

const Article = ({ id, slug, title, excerpt, date, lang, ideasDict }: ArticleProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(lang === 'ar' ? 'ar-SA' : undefined, options);
  };

  return (
    <Card className="shadow-none overflow-hidden h-full flex flex-col py-2">
      <CardHeader className="pt-4 space-y-2">
        <h3 className="font-semibold text-xl tracking-tight">{title}</h3>
        <div className="text-sm text-muted-foreground">{formatDate(date)}</div>
      </CardHeader>
      <CardContent className="grow">
        <p className="text-muted-foreground">{excerpt}</p>
      </CardContent>
      <CardFooter className="py-2">
        <Link
          href={`${getPathPrefix(lang)}/ideas/${slug}`}
          className="w-full"
          aria-label={title}
        >
          <Button variant="outline" className="w-full group">
            <span className="line-clamp-1 text-left rtl:text-right">
              {fmt(ideasDict.readArticle, { title: title })}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 shrink-0 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export function IdeasSection({ featuredIdeas, ideasDict, lang }: IdeasSectionProps) {
  const articles: ArticleProps[] = featuredIdeas.map(idea => ({
    id: idea.id,
    slug: idea.slug,
    title: idea.title,
    excerpt: idea.excerpt,
    date: idea.date,
    lang,
    ideasDict
  }));

  return (
    <section id="ideas" className="py-20">
      <div className="container px-4">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">{ideasDict.title}</h2>
          <p className="text-muted-foreground max-w-2xl">{ideasDict.subtitle}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6 tracking-tight">{ideasDict.featured}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Article
                key={article.id}
                id={article.id}
                slug={article.slug}
                title={article.title}
                excerpt={article.excerpt}
                date={article.date}
                lang={article.lang}
                ideasDict={article.ideasDict}
              />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Link href={`${getPathPrefix(lang)}/ideas`}>
            <Button className="group w-full" size="lg">
              {ideasDict.viewAll}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
} 