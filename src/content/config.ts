import { defineCollection, reference, z } from "astro:content";

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
      spotlight: z.string().max(300, "Spotlight is too long").optional(),
      logo: image(),
      leaders: z
        .array(reference("ledere"))
        .min(1, "At least one leader must be provided")
        .optional(),
    }),
});

const ledere = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    email: z.string().email("Not a valid email"),
    image: z.string().url(),
    gender: z.enum(["male", "female", "other"]),
    leaderOf: z
      .array(
        z.object({
          group: reference("grupper"),
          title: z.string().default("Leder"),
        }),
      )
      .min(1, "Not a leader of any group"),
  }),
});

export const collections = { om_oss, grupper, ledere };
