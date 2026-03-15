import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Newspaper, CalendarCheck, Home, Scale, LucideIcon } from "lucide-react";

const PROJECT_ICONS: Record<string, LucideIcon> = {
  building2: Building2,
  newspaper: Newspaper,
  calendarCheck: CalendarCheck,
  home: Home,
  scale: Scale,
};
import { getPathPrefix } from "@/utils/translations/language-utils";
import type { AboutDict } from "@/utils/translations/dictionary-types";
import type { Lang } from "@/utils/translations/i18n-config";

interface AboutPageProps {
  aboutDict: AboutDict;
  lang: Lang;
}

export function AboutPage({ aboutDict, lang }: AboutPageProps) {
  const about = aboutDict;
  const prefix = getPathPrefix(lang);

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{about.title}</h1>
            <p className="text-muted-foreground text-lg">{about.intro}</p>
            <p className="text-muted-foreground">{about.paragraph1}</p>
            <p className="text-muted-foreground">
              {about.keyIdea}
            </p>
            <p className="text-muted-foreground">{about.today}</p>
          </div>
        </div>
      </section>

      {/* What I've Built */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4">{about.whatIBuilt.title}</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl">{about.whatIBuilt.intro}</p>

          <div className="flex flex-col gap-8">
            {about.whatIBuilt.projects.map((project, index) => {
              const IconComponent = PROJECT_ICONS[project.icon] ?? Building2;
              return (
                <Card key={index} className="shadow-none overflow-hidden h-full">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">{project.description}</p>
                    {"detail" in project && project.detail && (
                      <p className="text-muted-foreground">{project.detail}</p>
                    )}
                    {"items" in project && project.items && (
                      <ul className="space-y-2 text-muted-foreground">
                        {project.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary mt-1.5 shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {"focus" in project && project.focus && (
                      <p className="text-muted-foreground">{project.focus}</p>
                    )}
                    {"experiment" in project && project.experiment && (
                      <p className="text-muted-foreground italic text-sm">{project.experiment}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How I Think */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4">{about.howIThink.title}</h2>
          <p className="text-muted-foreground mb-6">{about.howIThink.intro}</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-8">
            {about.howIThink.intersections.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="text-muted-foreground mb-4">{about.howIThink.keyThought}</p>
          <p className="text-muted-foreground font-medium">{about.howIThink.insight}</p>
        </div>
      </section>

      {/* What I Share */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4">{about.whatIShare.title}</h2>
          <p className="text-muted-foreground mb-6">{about.whatIShare.intro}</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-8">
            {about.whatIShare.topics.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="text-muted-foreground mb-2 font-medium">{about.whatIShare.goal}</p>
          <p className="text-muted-foreground">{about.whatIShare.goalDetail}</p>
        </div>
      </section>

      {/* Outside of Work */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4">{about.outsideOfWork.title}</h2>
          <p className="text-muted-foreground max-w-3xl">{about.outsideOfWork.description}</p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{about.contact.title}</h2>
            <p className="text-muted-foreground mb-8">{about.contact.description}</p>
            <Button asChild size="lg">
              <Link href={`${prefix || "/"}#contact`}>{about.contact.cta}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
