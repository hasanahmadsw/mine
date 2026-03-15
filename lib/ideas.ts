import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const ideasDirectory = path.join(process.cwd(), "public/ideas-content");

export type IdeaMeta = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: number;
  featured: boolean;
  image: string;
  author: string;
  lang: string;
};

export type Idea = IdeaMeta & {
  content: string;
};

// Helper function to convert title to slug if not explicitly provided
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .trim();
}

// Helper function to get sorted ideas data
export function getSortedIdeasData(language: string = "en"): IdeaMeta[] {
  // Get file names under /ideas-content
  const fileNames = fs.readdirSync(ideasDirectory);

  const allIdeasData = fileNames
    .filter((fileName) => {
      // Only process files for the specified language (en.md or ar.md)
      if (language === "en") {
        return fileName.endsWith(".md") && !fileName.endsWith(".ar.md");
      } else if (language === "ar") {
        return fileName.endsWith(".ar.md");
      }
      return false;
    })
    .map((fileName) => {
      // Read markdown file as string
      const fullPath = path.join(ideasDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the idea metadata section
      const matterResult = matter(fileContents);

      // Use title to create slug if not provided
      const slug =
        matterResult.data.slug || createSlug(matterResult.data.title);

      // Combine the data with the id
      return {
        id: matterResult.data.id,
        slug,
        title: matterResult.data.title,
        excerpt: matterResult.data.excerpt,
        date: matterResult.data.date,
        category: matterResult.data.category,
        readTime: matterResult.data.readTime,
        featured: matterResult.data.featured,
        image: matterResult.data.image,
        author: matterResult.data.author,
        lang: matterResult.data.lang || language,
      } as IdeaMeta;
    });

  // Sort ideas by date
  return allIdeasData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Get all thought categories
export function getAllIdeaCategories(language: string = "en"): string[] {
  const ideas = getSortedIdeasData(language);
  const categories = new Set(ideas.map((idea) => idea.category));
  return Array.from(categories);
}

// Get featured ideas
export function getFeaturedIdeas(language: string = "en"): IdeaMeta[] {
  const ideas = getSortedIdeasData(language);
  return ideas.filter((idea) => idea.featured);
}

// Get ideas by category
export function getIdeasByCategory(
  category: string,
  language: string = "en",
): IdeaMeta[] {
  const ideas = getSortedIdeasData(language);
  return ideas.filter((idea) => idea.category === category);
}

// Get idea by slug
export async function getIdeaBySlug(
  slug: string,
  language: string = "en",
): Promise<Idea | null> {
  // Get all ideas
  const ideas = getSortedIdeasData(language);

  // Find idea with matching slug
  const idea = ideas.find((i) => i.slug === slug);

  if (!idea) {
    return null;
  }

  // Find the correct file for this idea
  const fileNames = fs.readdirSync(ideasDirectory);
  let fileName: string | undefined;

  if (language === "en") {
    fileName = fileNames.find(
      (fn) =>
        !fn.endsWith(".ar.md") &&
        fn.endsWith(".md") &&
        matter(fs.readFileSync(path.join(ideasDirectory, fn), "utf8")).data
          .id === idea.id,
    );
  } else if (language === "ar") {
    fileName = fileNames.find(
      (fn) =>
        fn.endsWith(".ar.md") &&
        matter(fs.readFileSync(path.join(ideasDirectory, fn), "utf8")).data
          .id === idea.id,
    );
  }

  if (!fileName) {
    return null;
  }

  // Read the file content
  const fullPath = path.join(ideasDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the idea metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    ...idea,
    content: matterResult.content, // Return raw markdown content instead of HTML
  };
}

// Get idea by ID (keeping for backwards compatibility)
export async function getIdeaData(
  id: string,
  language: string = "en",
): Promise<Idea | null> {
  // Find the correct file
  const fileNames = fs.readdirSync(ideasDirectory);
  let fileName: string | undefined;

  if (language === "en") {
    fileName = fileNames.find(
      (fn) =>
        !fn.endsWith(".ar.md") &&
        fn.endsWith(".md") &&
        matter(fs.readFileSync(path.join(ideasDirectory, fn), "utf8")).data
          .id === id,
    );
  } else if (language === "ar") {
    fileName = fileNames.find(
      (fn) =>
        fn.endsWith(".ar.md") &&
        matter(fs.readFileSync(path.join(ideasDirectory, fn), "utf8")).data
          .id === id,
    );
  }

  if (!fileName) {
    return null;
  }

  const fullPath = path.join(ideasDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the idea metadata section
  const matterResult = matter(fileContents);

  // Get slug or create from title
  const slug = matterResult.data.slug || createSlug(matterResult.data.title);

  // Return raw markdown content
  return {
    id: matterResult.data.id,
    slug,
    title: matterResult.data.title,
    excerpt: matterResult.data.excerpt,
    date: matterResult.data.date,
    category: matterResult.data.category,
    readTime: matterResult.data.readTime,
    featured: matterResult.data.featured,
    image: matterResult.data.image,
    author: matterResult.data.author,
    lang: matterResult.data.lang || language,
    content: matterResult.content, // Return raw markdown content
  };
}

// Get related ideas
export function getRelatedIdeas(
  slug: string,
  category: string,
  language: string = "en",
  limit: number = 3,
): IdeaMeta[] {
  const ideas = getSortedIdeasData(language);

  // Get ideas from the same category, excluding the current one
  return ideas
    .filter((idea) => idea.category === category && idea.slug !== slug)
    .slice(0, limit);
}

// Get next and previous ideas
export function getAdjacentIdeas(
  slug: string,
  language: string = "en",
): {
  previous: IdeaMeta | null;
  next: IdeaMeta | null;
} {
  const ideas = getSortedIdeasData(language);
  const currentIndex = ideas.findIndex((idea) => idea.slug === slug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  // Previous is the one after in the array (since we sort by date descending)
  const previous =
    currentIndex < ideas.length - 1 ? ideas[currentIndex + 1] : null;

  // Next is the one before in the array
  const next = currentIndex > 0 ? ideas[currentIndex - 1] : null;

  return { previous, next };
}
