import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import type { ContactDict } from "@/utils/translations/dictionary-types";
import type { Lang } from "@/utils/translations/i18n-config";
import { ContactForm } from "@/components/sections/ContactForm";

interface ContactSectionProps {
  contactDict: ContactDict;
  lang: Lang;
}

export function ContactSection({ contactDict, lang }: ContactSectionProps) {
  const contact = contactDict;

  return (
    <section id="contact" className="py-24 bg-muted/30">
      <div className="container">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{contact.title}</h2>
          <div className="w-20 h-1 bg-primary mb-8"></div>
          <p className="text-muted-foreground max-w-3xl">
            {contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6 tracking-tight">{contact.info.title}</h3>

            <div className="space-y-6">
              <Card className="shadow-none">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MailIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base mb-1">{contact.info.email.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {contact.info.email.value}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <PhoneIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base mb-1">{contact.info.phone.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {contact.info.phone.value}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPinIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base mb-1">{contact.info.headquarters.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {contact.info.headquarters.value}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6 tracking-tight">{contact.form.title}</h3>
            <ContactForm contactDict={contact} />
          </div>
        </div>
      </div>
    </section>
  );
} 