import { z } from "zod";

export const contactFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "يرجى كتابة الاسم بشكل صحيح (حرفين على الأقل)")
      .max(100, "الاسم لا يمكن أن يتجاوز 100 حرف"),
    email: z
      .string()
      .trim()
      .max(255, "البريد الإلكتروني لا يمكن أن يتجاوز 255 حرفاً")
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .trim()
      .max(20, "رقم الهاتف لا يمكن أن يتجاوز 20 حرفاً")
      .optional()
      .or(z.literal("")),
    message: z
      .string()
      .trim()
      .min(10, "يرجى كتابة رسالتكم (10 أحرف على الأقل)")
      .max(500, "الرسالة لا يمكن أن تتجاوز 500 حرف"),
  })
  .superRefine((data, ctx) => {
    const hasEmail = Boolean(data.email && data.email.trim().length > 0);
    const hasPhone = Boolean(data.phone && data.phone.trim().length > 0);

    if (!hasEmail && !hasPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "يرجى إدخال البريد الإلكتروني أو رقم الهاتف على الأقل للتواصل",
        path: ["email"],
      });
      return;
    }

    if (hasEmail && data.email) {
      const emailValidation = z.string().email();
      if (!emailValidation.safeParse(data.email.trim()).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "صيغة البريد الإلكتروني غير صحيحة (مثال: user@website.com)",
          path: ["email"],
        });
      }
    }

    if (hasPhone && data.phone) {
      const phoneVal = data.phone.trim();
      if (phoneVal.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "يرجى إدخال رقم هاتف صالح (6 أرقام على الأقل)",
          path: ["phone"],
        });
      }
    }
  });

export type ContactFormValues = z.infer<typeof contactFormSchema>;

