import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { PhilosophyDict } from "@/utils/translations/dictionary-types";
import type { Lang } from "@/utils/translations/i18n-config";
import { getPathPrefix } from "@/utils/translations/language-utils";
import Link from "next/link";

interface PhilosophySectionProps {
  philosophyDict: PhilosophyDict;
  lang: Lang;
}

export function PhilosophySection({ philosophyDict, lang }: PhilosophySectionProps) {
  const philosophy = philosophyDict;

  return (
    <section id="philosophy" className="py-20">
      <div className="container px-4">
        <blockquote className="text-2xl md:text-3xl font-bold mb-12 max-w-2xl tracking-tight">
          &quot;{philosophy.signatureQuote}&quot;
        </blockquote>

        <div className="mb-12 max-w-2xl">
          <p className="text-muted-foreground mb-4">{philosophy.intro.paragraph1}</p>
          <p className="text-muted-foreground mb-2">{philosophy.intro.patternLabel}</p>
          <p className="font-medium mb-4">{philosophy.intro.pattern}</p>
          <p className="text-muted-foreground">{philosophy.intro.paragraph2}</p>
        </div>

        <h2 className="text-2xl font-bold mb-8">{philosophy.corePrinciples}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-none overflow-hidden h-full">
            <CardHeader className="border-b p-6">
              <h3 className="font-semibold text-xl">{philosophy.principles.systems.title}</h3>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground">{philosophy.principles.systems.description}</p>
            </CardContent>
          </Card>

          <Card className="shadow-none overflow-hidden h-full">
            <CardHeader className="border-b p-6">
              <h3 className="font-semibold text-xl">{philosophy.principles.build.title}</h3>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground">{philosophy.principles.build.description}</p>
            </CardContent>
          </Card>

          <Card className="shadow-none overflow-hidden h-full">
            <CardHeader className="border-b p-6">
              <h3 className="font-semibold text-xl">{philosophy.principles.longTerm.title}</h3>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground">{philosophy.principles.longTerm.description}</p>
            </CardContent>
          </Card>

          <Card className="shadow-none overflow-hidden h-full">
            <CardHeader className="border-b p-6">
              <h3 className="font-semibold text-xl">{philosophy.principles.simplicity.title}</h3>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground">{philosophy.principles.simplicity.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href={`${getPathPrefix(lang)}/philosophy`}>
            <Button className="group" size="lg">
              {philosophy.learnMore}
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
