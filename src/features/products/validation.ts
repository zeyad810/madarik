export const productSchema = {
  title: (val: string) => val.trim().length > 0,
  price: (val: number) => val >= 0,
};
