"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";
import type { ContactDict } from "@/utils/translations/dictionary-types";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";

interface ContactFormProps {
  contactDict: ContactDict;
}

export function ContactForm({ contactDict }: ContactFormProps) {
  const contact = contactDict;
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const handleSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setIsSubmitted(true);
      toast.success(contact.success.toast);
      form.reset();

      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(contact.error.toast);
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
            <h3 className="text-xl font-bold mb-2 tracking-tight">
              {contact.success.title}
            </h3>
            <p className="text-muted-foreground">
              {contact.success.description}
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{contact.form.name}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={contact.form.placeholders.name}
                        className="focus-visible:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{contact.form.email}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={contact.form.placeholders.email}
                        className="focus-visible:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{contact.form.subject}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={contact.form.placeholders.subject}
                        className="focus-visible:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{contact.form.message}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={contact.form.placeholders.message}
                        rows={6}
                        className="focus-visible:ring-primary resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
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
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
