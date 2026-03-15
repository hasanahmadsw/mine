import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPathPrefix } from "@/utils/translations/language-utils";
import type { AboutDict } from "@/utils/translations/dictionary-types";
import type { Lang } from "@/utils/translations/i18n-config";

interface AboutSectionProps {
  aboutDict: AboutDict;
  lang: Lang;
}

export function AboutSection({ aboutDict, lang }: AboutSectionProps) {
  const about = aboutDict;
  const prefix = getPathPrefix(lang);

  const home = about.home;

  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container">
        <div className="flex flex-col max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{about.title}</h2>
          <div className="w-20 h-1 bg-primary mb-8"></div>
          <p className="text-muted-foreground text-lg mb-6">{home.intro}</p>
          <p className="text-muted-foreground mb-6">{home.paragraph}</p>
          <blockquote className="border-s-4 border-primary ps-6 py-2 mb-6 italic text-foreground/90">
            {home.keyIdea}
          </blockquote>
          <p className="text-muted-foreground mb-8">{home.focus}</p>
          <Button asChild variant="default" size="lg" className="w-fit">
            <Link href={`${prefix}/about`}>{home.cta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 