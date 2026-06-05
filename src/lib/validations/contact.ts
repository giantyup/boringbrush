import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please share your name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(200),
  twitter_handle: z.string().trim().max(80).optional().or(z.literal("")),
  collection_interest: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (10+ characters).")
    .max(4000),
  attachment_url: z.string().trim().url().optional().or(z.literal("")),
  // Honeypot: must remain empty. Bots tend to fill every field.
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
