import type { ContactInfoItem, SocialLinks } from "../types";

export interface ContactData {
  title: string;
  description: string;
  contactInfo: ContactInfoItem;
  socialLinks: SocialLinks;
}

export const defaultContactData: ContactData = {
  title: "سعدنا بتواصلكم واستفساراتكم",
  description:
    "نحن هنا لمساعدتكم في كل ما يتعلق برحلة طفلكم التعليمية. لا تترددوا بالاتصال بنا في أي وقت.",
  contactInfo: {
    email: "support@iqra-kids.com",
    phone: "+95136987452125",
    address: "المملكة العربية السعودية، الرياض، حي النخيل",
  },
  socialLinks: {
    instagram: "#",
    twitter: "#",
    facebook: "#",
  },
};
