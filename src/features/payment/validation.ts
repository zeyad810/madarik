import { z } from "zod";

export const creditCardFormSchema = z.object({
  name: z
    .string()
    .min(2, "يرجى إدخال اسم حامل البطاقة كاملاً")
    .max(100, "الاسم طويل جداً"),
  number: z
    .string()
    .min(1, "يرجى إدخال رقم البطاقة")
    .refine((val) => {
      const cleaned = val.replace(/\s+/g, "");
      return /^\d{13,19}$/.test(cleaned);
    }, "رقم البطاقة غير صالح (يجب أن يتكون من 13 إلى 19 رقماً)"),
  expiry: z
    .string()
    .min(1, "يرجى إدخال تاريخ الانتهاء")
    .refine((val) => {
      const match = val.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
      if (!match) return false;
      const month = parseInt(match[1], 10);
      const year = parseInt(`20${match[2]}`, 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (year < currentYear) return false;
      if (year === currentYear && month < currentMonth) return false;
      return true;
    }, "تاريخ الانتهاء غير صالح أو منتهي الصلاحية"),
  cvc: z
    .string()
    .min(1, "يرجى إدخال رمز الأمان CVC")
    .refine((val) => /^\d{3,4}$/.test(val.trim()), "رمز CVC يجب أن يتكون من 3 أو 4 أرقام"),
});

export type CreditCardFormData = z.infer<typeof creditCardFormSchema>;

export function parseExpiry(expiryStr: string): { month: string; year: string } {
  const parts = expiryStr.split("/");
  const month = parts[0]?.trim() || "";
  const shortYear = parts[1]?.trim() || "";
  const year = shortYear.length === 2 ? `20${shortYear}` : shortYear;
  return { month, year };
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiryDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export function detectCardType(numberStr: string): "mada" | "visa" | "mastercard" | "unknown" {
  const cleaned = numberStr.replace(/\s+/g, "");
  // Common Mada BINs prefixes
  const madaPrefixes = [
    "588845", "440647", "440795", "446404", "457865", "457997", "458456", "484783",
    "968208", "968211", "589206", "589005", "535825", "543357", "524130", "529415"
  ];
  for (const prefix of madaPrefixes) {
    if (cleaned.startsWith(prefix)) return "mada";
  }

  if (/^4/.test(cleaned)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(cleaned)) return "mastercard";
  return "unknown";
}
