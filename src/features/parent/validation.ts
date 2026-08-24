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

export const parentSettingsSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "يرجى إدخال الاسم الكامل")
      .max(100, "الحد الأقصى للاسم 100 حرف"),
    phone: z.string().trim().optional().or(z.literal("")),
    currentPassword: z.string().optional().or(z.literal("")),
    newPassword: z.string().optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length > 0) {
        return data.newPassword.length >= 6;
      }
      return true;
    },
    {
      message: "كلمة المرور الجديدة يجب أن لا تقل عن 6 أحرف",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length > 0) {
        return !!data.currentPassword && data.currentPassword.length > 0;
      }
      return true;
    },
    {
      message: "يرجى إدخال كلمة المرور الحالية لتغيير كلمة المرور",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length > 0) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "تأكيد كلمة المرور غير مطابق لكلمة المرور الجديدة",
      path: ["confirmPassword"],
    }
  );

export type ParentSettingsFormData = z.infer<typeof parentSettingsSchema>;


