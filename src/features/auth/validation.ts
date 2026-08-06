export const loginSchema = {
  email: (val: string) => val.includes("@"),
  password: (val: string) => val.length >= 6,
};
