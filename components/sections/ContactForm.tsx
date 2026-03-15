"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";
import type { ContactDict } from "@/utils/translations/dictionary-types";
import { Label } from "../ui/label";

interface ContactFormProps {
  contactDict: ContactDict;
}

export function ContactForm({ contactDict }: ContactFormProps) {
  const contact = contactDict;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Collect form data
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formJson.name,
          email: formJson.email,
          subject: formJson.subject,
          message: formJson.message
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success
      setIsSubmitted(true);
      toast.success(contact.success.toast);

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        (e.target as HTMLFormElement).reset();
      }, 5000);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(contact.error.toast);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-none">
      <CardContent>
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 tracking-tight">{contact.success.title}</h3>
            <p className="text-muted-foreground">
              {contact.success.description}
            </p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">
                {contact.form.name}
              </Label>
              <Input
                id="name"
                name="name"
                placeholder={contact.form.placeholders.name}
                className="focus-visible:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                {contact.form.email}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={contact.form.placeholders.email}
                className="focus-visible:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">
                {contact.form.subject}
              </Label>
              <Input
                id="subject"
                name="subject"
                placeholder={contact.form.placeholders.subject}
                className="focus-visible:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                {contact.form.message}
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder={contact.form.placeholders.message}
                rows={6}
                className="focus-visible:ring-primary"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                  <span>{contact.sending}</span>
                </>
              ) : (
                <>
                  <SendIcon className="h-4 w-4 mr-2" />
                  {contact.form.button}
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}