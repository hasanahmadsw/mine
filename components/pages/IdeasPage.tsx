import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ArrowRight, Tag, Calendar } from "lucide-react";
import { IdeaMeta } from "@/lib/ideas";
import type { IdeasDict, ContactDict } from "@/utils/translations/dictionary-types";
import type { Lang } from "@/utils/translations/i18n-config";
import Link from "next/link";
import { IdeasFilter } from "./IdeasFilter";
import { fmt, getPathPrefix } from "@/utils/translations/language-utils";

interface IdeasPageProps {
  articles: IdeaMeta[];
  featuredArticles: IdeaMeta[];
  categories: string[];
  ideasDict: IdeasDict;
  contactDict: ContactDict;
  lang: Lang;
}

export function IdeasPage({ articles, featuredArticles, categories, ideasDict, contactDict, lang }: IdeasPageProps) {

  // Format date to human-readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(lang === 'ar' ? 'ar-SA' : undefined, options);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{ideasDict.title}</h1>
            <p className="text-muted-foreground text-lg">
              {ideasDict.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 flex items-center">
            <span className="mr-4">{ideasDict.featured}</span>
            <div className="h-0.5 bg-muted-foreground/20 flex-1"></div>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden shadow-none h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground my-2">
                    <Tag className="h-3.5 w-3.5" />
                    <span className="capitalize">{article.category}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                    <Clock className="h-3.5 w-3.5" />
                    <span>{fmt(ideasDict.readTime, { time: article.readTime.toString() })}</span>
                  </div>
                  <Link href={`${getPathPrefix(lang)}/ideas/${article.slug}`}>
                    <CardTitle className="text-xl line-clamp-2 hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </Link>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground line-clamp-3">
                    {article.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-4 border-t border-muted/10">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-2" />
                    {formatDate(article.date)}
                  </div>
                  <Link href={`${getPathPrefix(lang)}/ideas/${article.slug}`}>
                    <Button variant="ghost" size="sm" className="text-primary p-0 hover:bg-transparent hover:text-primary/80">
                      {ideasDict.readMore}
                      <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4 rtl:rotate-180" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Articles with Category Filter - Client Component */}
      <IdeasFilter
        articles={articles}
        categories={categories}
        ideasDict={ideasDict}
        lang={lang}
      />

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {contactDict.cta.title}
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              {contactDict.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-secondary text-primary hover:bg-secondary/90"
                size="lg"
              >
                {contactDict.cta.scheduleCall}
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
                size="lg"
              >
                {contactDict.cta.viewPortfolio}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}