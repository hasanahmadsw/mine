import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Hammer, Calendar, Minimize2, Quote } from "lucide-react";
import type { PhilosophyDict } from "@/utils/translations/dictionary-types";
import type { Lang } from "@/utils/translations/i18n-config";
import Link from "next/link";
import { getPathPrefix } from "@/utils/translations/language-utils";

interface PhilosophyPageProps {
  philosophyDict: PhilosophyDict;
  lang: Lang;
}

export function PhilosophyPage({ philosophyDict, lang }: PhilosophyPageProps) {
  const philosophy = philosophyDict;

  return (
    <>
      {/* Hero with signature quote */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{philosophy.title}</h1>
            <blockquote className="text-xl md:text-2xl font-medium">
              {philosophy.signatureQuote}
            </blockquote>
            <p className="text-muted-foreground text-base">
              {philosophy.intro.paragraph1}
            </p>
            <p className="text-muted-foreground text-base">
              {philosophy.intro.patternLabel}
            </p>
            <p className="font-medium text-base">
              {philosophy.intro.pattern}
            </p>
            <p className="text-muted-foreground text-base">
              {philosophy.intro.paragraph2}
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold mb-14 tracking-tight">{philosophy.corePrinciples}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="shadow-none overflow-hidden h-full">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg mb-4">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  {philosophy.principles.systems.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {philosophy.principles.systems.description}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-none overflow-hidden h-full">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg mb-4">
                  <Hammer className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  {philosophy.principles.build.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {philosophy.principles.build.description}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-none overflow-hidden h-full">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  {philosophy.principles.longTerm.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {philosophy.principles.longTerm.description}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-none overflow-hidden h-full">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg mb-4">
                  <Minimize2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  {philosophy.principles.simplicity.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {philosophy.principles.simplicity.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Closing Thought */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Quote className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-6 tracking-tight">{philosophy.closingThought.title}</h2>
            <p className="text-xl md:text-2xl font-light mb-4">
              {philosophy.closingThought.line1}
            </p>
            <p className="text-xl md:text-2xl font-light mb-6">
              {philosophy.closingThought.line2}
            </p>
            <p className="text-muted-foreground text-lg">
              {philosophy.closingThought.paragraph}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              {philosophy.cta.title}
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              {philosophy.cta.description}
            </p>
            <Link href={`${getPathPrefix(lang)}/#contact`}>
              <Button
                className="bg-secondary text-primary hover:bg-secondary/90"
                size="lg"
              >
                {philosophy.cta.button}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
