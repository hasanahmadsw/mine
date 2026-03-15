import type { Metadata } from "next";
import { seoConfig } from "../seo.config";

export interface TwitterInput {
  title: string;
  description: string;
  image?: string;
}

export function buildTwitter(input: TwitterInput): Metadata["twitter"] {
  const { title, description } = input;
  const img = input.image || seoConfig.ogImage;

  return {
    card: "summary_large_image",
    title,
    description,
    images: [img],
    creator: "@hasanahmad",
  };
}
