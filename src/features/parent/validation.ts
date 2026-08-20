import { z } from "zod";

export const childBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "يرجى إدخال اسم الطفل")
    .max(50, "الحد الأقصى لاسم الطفل 50 حرفاً"),
  birthDate: z
    .string()
    .min(1, "يرجى تحديد تاريخ الميلاد")
    .refine(
      (val) => {
        const d = new Date(val);
        return !isNaN(d.getTime()) && d <= new Date();
      },
      { message: "تاريخ الميلاد غير صالح أو في المستقبل" }
    ),
  gender: z.enum(["male", "female"] as const, {
    message: "يرجى تحديد جنس الطفل",
  }),
});

export const addChildSchema = childBaseSchema.extend({
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "يجب الموافقة على شروط الاشتراك وسياسة الاستخدام",
  }),
});

export const updateChildSchema = childBaseSchema.extend({
  agreedToTerms: z.boolean().optional(),
});

export type AddChildFormData = z.infer<typeof addChildSchema>;
export type UpdateChildFormData = z.infer<typeof updateChildSchema>;
export type ChildFormData = z.infer<typeof childBaseSchema> & {
  agreedToTerms?: boolean;
};
