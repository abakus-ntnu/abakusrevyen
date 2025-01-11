import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const om_oss = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updateDate: z.coerce.date().optional(),
    language: z.enum(["no"]),
  }),
});

const grupper = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      brief: z.string().min(1, "Missing brief").max(60, "Brief is too long"),
      logo: image(),
    }),
});

export const collections = { om_oss, grupper };
