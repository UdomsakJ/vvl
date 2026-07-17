import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    intro: z.string(),
    order: z.number().default(0),
    theme: z.enum(['blue', 'pink', 'yellow']).default('blue'),
    badges: z.array(z.string()).default([]),
    logo: z.string().optional(),
    heroImage: z.string().optional(),
    brochure: z.string().optional(),
    items: z
      .array(
        z.object({
          name: z.string(),
          size: z.string().optional(),
          description: z.string(),
          image: z.string().optional(),
        })
      )
      .default([]),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(),
    excerpt: z.string().optional(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    order: z.number().default(0),
  }),
});

export const collections = { products, posts, faq };
