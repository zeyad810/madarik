import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "يرجى إدخال البريد الإلكتروني")
    .email("برجاء إدخال بريد إلكتروني صحيح (مثال: user@example.com)")
    .max(255, "البريد الإلكتروني لا يمكن أن يتجاوز 255 حرفاً"),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
