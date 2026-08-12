import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "يرجى كتابة اسمكم الكريم بشكل صحيح" }),
  email: z
    .string()
    .min(1, { message: "يرجى كتابة البريد الإلكتروني" })
    .email({ message: "صيغة البريد الإلكتروني غير صحيحة (مثال: user@website.com)" }),
  message: z
    .string()
    .min(5, { message: "يرجى كتابة رسالتكم (أقله 5 أحرف)" }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
