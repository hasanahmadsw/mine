"use client";

import { Button } from "@/components/ui/button";
import { Clock, Calendar, ChevronLeft, Share2, Tag, ArrowLeft, ArrowRight, Twitter, Facebook, Linkedin, Link as LinkIcon } from "lucide-react";
import { Idea, IdeaMeta } from "@/lib/ideas";
import type { IdeasDict } from "@/utils/translations/dictionary-types";
import type { Lang } from "@/utils/translations/i18n-config";
import { fmt, getPathPrefix } from "@/utils/translations/language-utils";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

// Custom components for markdown rendering
const MarkdownComponents = {
  // Headers
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="text-3xl font-bold  mt-8 mb-4" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,

  // Paragraphs and text
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mb-4 leading-relaxed" {...props} />,
  strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="font-bold " {...props} />,
  em: (props: React.HTMLAttributes<HTMLElement>) => <em className="italic " {...props} />,

  // Lists
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="list-disc list-inside mb-4 " {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="list-decimal list-inside mb-4 " {...props} />,
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="mb-2" {...props} />,

  // Links and images
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }) => (
    <a
      {...props}
      className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      {...props}
      className="rounded-lg shadow-lg my-8 w-full"
      loading="lazy"
    />
  ),

  // Code blocks
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const { className } = props
    const language = className ? className.replace('language-', '') : ''
    return (
      <div className="my-6 rounded-lg overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 text-sm text-gray-400">{language}</div>
        <pre className="p-4 bg-gray-900 overflow-x-auto">
          <code {...props} className={`${className} text-sm`} />
        </pre>
      </div>
    )
  },

  // Blockquotes
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      className="border-l-4 border-blue-500 pl-4 my-6 italic text-muted-foreground"
    />
  ),

  // Tables
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-8">
      <table {...props} className="min-w-full divide-y divide-gray-700" />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className="bg-gray-800" {...props} />,
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      {...props}
      className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => <td className="px-6 py-4 " {...props} />,
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr className="border-b border-gray-700" {...props} />,
};


interface IdeaDetailProps {
  idea: Idea;
  ideasDict: IdeasDict;
  lang: Lang;
  relatedIdeas?: IdeaMeta[];
  previousIdea?: IdeaMeta | null;
  nextIdea?: IdeaMeta | null;
}

export function IdeaDetail({
  idea,
  ideasDict,
  lang,
  relatedIdeas = [],
  previousIdea = null,
  nextIdea = null
}: IdeaDetailProps) {
  const [copied, setCopied] = useState(false);

  // Format date to human-readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(lang === 'ar' ? 'ar-SA' : undefined, options);
  };

  // Get current URL for sharing
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  // Share functions
  const shareHandlers = {
    twitter: () => {
      const url = encodeURIComponent(getShareUrl());
      const text = encodeURIComponent(idea.title);
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    },
    facebook: () => {
      const url = encodeURIComponent(getShareUrl());
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    },
    linkedin: () => {
      const url = encodeURIComponent(getShareUrl());
      const title = encodeURIComponent(idea.title);
      const summary = encodeURIComponent(idea.excerpt);
      window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`, '_blank');
    },
    copyLink: () => {
      navigator.clipboard.writeText(getShareUrl())
        .then(() => {
          setCopied(true);
          toast.success(ideasDict.linkCopied);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          toast.error(ideasDict.copyFailed);
          console.error('Could not copy text: ', err);
        });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-8 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl">
            <Link
              href={`${getPathPrefix(lang)}/ideas`}
              className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 rtl:rotate-180" />
              {ideasDict.backToArticles}
            </Link>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{idea.title}</h1>

            <div className="flex flex-wrap items-center text-muted-foreground mb-8 gap-x-6 gap-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(idea.date)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {fmt(ideasDict.readTime, { time: idea.readTime.toString() })}
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                {(ideasDict.categories as Record<string, string>)[idea.category] ?? idea.category}
              </div>
              <div className="flex items-center">
                {idea.author}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="md:col-span-12 lg:col-span-12">
              <article >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={MarkdownComponents}
                >
                  {idea.content}
                </ReactMarkdown>
              </article>

              <div className="mt-12 pt-8 border-t">
                <div className="flex items-center justify-between">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="inline-flex items-center gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        {ideasDict.share}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="start">
                      <div className="flex flex-col gap-1 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center justify-start gap-2"
                          onClick={shareHandlers.twitter}
                        >
                          <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                          Twitter
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center justify-start gap-2"
                          onClick={shareHandlers.facebook}
                        >
                          <Facebook className="h-4 w-4 text-[#4267B2]" />
                          Facebook
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center justify-start gap-2"
                          onClick={shareHandlers.linkedin}
                        >
                          <Linkedin className="h-4 w-4 text-[#0077B5]" />
                          LinkedIn
                        </Button>
                        <hr className="my-1" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center justify-start gap-2"
                          onClick={shareHandlers.copyLink}
                        >
                          <LinkIcon className="h-4 w-4" />
                          {copied ? ideasDict.copied : ideasDict.copyLink}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Link href={`/${lang}/ideas`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {ideasDict.backToArticles}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Navigation between articles */}
              {(previousIdea || nextIdea) && (
                <div className="mt-12 border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {previousIdea ? (
                    <Link href={`${getPathPrefix(lang)}/ideas/${previousIdea.slug}`} className="group">
                      <div className="flex flex-col p-4 border rounded-lg hover:border-primary transition-colors">
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <ArrowLeft className="h-3.5 w-3.5 mr-2 rtl:ml-2 rtl:mr-0 group-hover:text-primary transition-colors rtl:rotate-180" />
                          {ideasDict.previousArticle}
                        </div>
                        <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{previousIdea.title}</h4>
                      </div>
                    </Link>
                  ) : <div />}

                  {nextIdea && (
                    <Link href={`${getPathPrefix(lang)}/ideas/${nextIdea.slug}`} className="group md:ml-auto">
                      <div className="flex flex-col p-4 border rounded-lg hover:border-primary transition-colors">
                        <div className="flex items-center justify-end text-sm text-muted-foreground mb-2">
                          {ideasDict.nextArticle}
                          <ArrowRight className="h-3.5 w-3.5 ml-2 rtl:mr-2 rtl:ml-0 group-hover:text-primary transition-colors rtl:rotate-180" />
                        </div>
                        <h4 className="font-semibold text-end line-clamp-2 group-hover:text-primary transition-colors">{nextIdea.title}</h4>
                      </div>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles Section */}
      {relatedIdeas.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">{ideasDict.relatedArticles}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedIdeas.map((idea) => (
                <Link href={`${getPathPrefix(lang)}/ideas/${idea.slug}`} key={idea.id}>
                  <div className="bg-card rounded-lg overflow-hidden shadow-md h-full flex flex-col group">
                    <div className="relative h-48 bg-muted/10">
                      {/* This would be an actual image in production */}
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                        <span className="text-lg font-medium text-muted-foreground">{idea.title.substring(0, 1)}</span>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <Tag className="h-3 w-3 mr-1" />
                        <span>{(ideasDict.categories as Record<string, string>)[idea.category] ?? idea.category}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{fmt(ideasDict.readTime, { time: idea.readTime.toString() })}</span>
                      </div>
                      <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">{idea.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{idea.excerpt}</p>
                      <div className="mt-auto text-xs text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(idea.date)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
} 