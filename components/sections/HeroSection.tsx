import { Button } from "@/components/ui/button";
import type { HomeDict } from "@/utils/translations/dictionary-types";
import type { Lang } from "@/utils/translations/i18n-config";
import { getPathPrefix } from "@/utils/translations/language-utils";
import Link from "next/link";

interface HeroSectionProps {
  homeDict: HomeDict;
  lang: Lang;
}

export function HeroSection({ homeDict, lang }: HeroSectionProps) {
  const hero = homeDict.hero;
  const prefix = getPathPrefix(lang);

  return (
    <section className="relative min-h-[calc(90vh-100px)] flex items-start lg:items-center justify-center py-24 overflow-hidden">
      {/* Background gradient and animation container */}
      {/* <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-background z-0">
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 w-px bg-primary opacity-10"
              style={{ left: `${(i + 1) * 8}%`, height: '100%' }}
            />
          ))}

          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 right-0 h-px bg-primary opacity-10"
              style={{ top: `${(i + 1) * 12.5}%`, width: '100%' }}
            />
          ))}
        </div>
      </div> */}

      {/* Content */}
      <div className="container relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-12 pt-16">
        {/* Text Content */}
        <div className="flex-1 w-full text-start">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight">
            <span className="block">{hero.greeting}</span>
            <span
              className="text-primary"
              style={{
                backgroundImage: "linear-gradient(to right, rgba(var(--color-primary), 1), rgba(var(--color-primary), 1))",
                backgroundPosition: "0 100%",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 3px"
              }}
            >
              {hero.name}
            </span>
          </h1>
          <p className="text-lg sm:text-xl mb-6 max-w-2xl">
            {hero.title}
          </p>
          <p className="text-base text-muted-foreground mb-8 max-w-2xl">
            {hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-start w-full sm:w-auto">
            <Link href="#about" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-12 py-6">
                {hero.aboutButton}
              </Button>
            </Link>
            <Link href={`${prefix}/ideas`} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-12 py-6">
                {hero.connectButton}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 