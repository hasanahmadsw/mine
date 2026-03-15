"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
  ArrowUpIcon
} from "lucide-react";
import type { CommonDict } from "@/utils/translations/dictionary-types";
import type { Lang } from "@/utils/translations/i18n-config";
import { getPathPrefix } from "@/utils/translations/language-utils";

interface FooterProps {
  commonDict: CommonDict;
  lang: Lang;
}

export function Footer({ commonDict, lang }: FooterProps) {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="py-12 bg-muted/40 border-t">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2 tracking-tight">Hasan Smadi</h2>
            <p className="text-muted-foreground">Founder at BlendLab</p>
          </div>

          <nav className="flex flex-wrap gap-6 justify-center mb-6 md:mb-0">
            <Link href="#about" className="hover:text-primary transition-colors">
              {commonDict.header.about}
            </Link>
            <Link href={`${getPathPrefix(lang)}/ideas`} className="hover:text-primary transition-colors">
              {commonDict.header.ideas}
            </Link>
            <Link href={`${getPathPrefix(lang)}/philosophy`} className="hover:text-primary transition-colors">
              {commonDict.header.philosophy}
            </Link>
            <Link href="#contact" className="hover:text-primary transition-colors">
              {commonDict.header.contact}
            </Link>
          </nav>

          <div className="flex gap-3">
            <Button size="icon" variant="ghost" className="rounded-full" onClick={() => window.open('https://www.linkedin.com/in/hasanaliahmad/', '_blank')}>
              <LinkedinIcon className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full" onClick={() => window.open('https://x.com/hasanahmadsw', '_blank')}>
              <TwitterIcon className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full" onClick={() => window.open('https://www.instagram.com/hasanahmadsw', '_blank')}>
              <InstagramIcon className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full" onClick={() => window.open('https://github.com/hasanahmadsw', '_blank')}>
              <GithubIcon className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col-reverse md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Hasan Smadi. {commonDict.footer.rights}
          </p>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={scrollToTop}
          >
            <ArrowUpIcon className="h-5 w-5" />
            <span className="sr-only">Back to top</span>
          </Button>
        </div>
      </div>
    </footer>
  );
} 