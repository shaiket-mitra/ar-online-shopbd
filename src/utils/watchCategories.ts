export type WatchCategorySlug =
  | "new-arrival"
  | "best-selling"
  | "limited-edition"
  | "couple-watch"
  | "gift-collection"
  | "eid-special-offer";

export const WATCH_CATEGORIES: { value: WatchCategorySlug; label: string }[] = [
  { value: "new-arrival", label: "New Arrival" },
  { value: "best-selling", label: "Best Selling" },
  { value: "limited-edition", label: "Limited Edition" },
  { value: "couple-watch", label: "Couple Watch" },
  { value: "gift-collection", label: "Gift Collection" },
  { value: "eid-special-offer", label: "Eid Special Offer" },
];

export const CATEGORY_META: Record<WatchCategorySlug, { label: string }> =
  WATCH_CATEGORIES.reduce((acc, c) => {
    acc[c.value] = { label: c.label };
    return acc;
  }, {} as Record<WatchCategorySlug, { label: string }>);

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