export type ProductCategorySlug =
  | "new-arrival"
  | "best-selling"
  | "birthday-cake"
  | "wedding-cake"
  | "anniversary-cake"
  | "kids-theme-cake"
  | "chocolate-cake"
  | "fruit-cake"
  | "red-velvet-cake"
  | "cupcake"
  | "bento-cake"
  | "jar-cake"
  | "custom-cake"
  | "special-offer";

export const PRODUCT_CATEGORIES: { value: ProductCategorySlug; label: string }[] = [
  { value: "new-arrival", label: "New Arrival" },
  { value: "best-selling", label: "Best Selling" },
  { value: "birthday-cake", label: "Birthday Cake" },
  { value: "wedding-cake", label: "Wedding Cake" },
  { value: "anniversary-cake", label: "Anniversary Cake" },
  { value: "kids-theme-cake", label: "Kids Theme Cake" },
  { value: "chocolate-cake", label: "Chocolate Cake" },
  { value: "fruit-cake", label: "Fruit Cake" },
  { value: "red-velvet-cake", label: "Red Velvet Cake" },
  { value: "cupcake", label: "Cupcake" },
  { value: "bento-cake", label: "Bento Cake" },
  { value: "jar-cake", label: "Jar Cake" },
  { value: "custom-cake", label: "Custom Cake" },
  { value: "special-offer", label: "Special Offer" },
];

export const CATEGORY_META: Record<ProductCategorySlug, { label: string }> =
  PRODUCT_CATEGORIES.reduce((acc, c) => {
    acc[c.value] = { label: c.label };
    return acc;
  }, {} as Record<ProductCategorySlug, { label: string }>);

// optional helpers
export function normalizeCategory(input: string) {
  return input.trim().toLowerCase().replace(/\s+/g, "-");
}

export function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}