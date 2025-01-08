import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const oss = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./om_oss"}),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updateDate: z.coerce.date().optional(),
        language: z.enum(['no']),
    })
});

export const collections = { oss };