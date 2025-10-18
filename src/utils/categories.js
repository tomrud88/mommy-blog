// Static categories - these never change
export const CATEGORIES = [
  {
    id: "1",
    slug: "mama",
    title: "Mama",
    img: "/momCategory.jpg",
  },
  {
    id: "2",
    slug: "dziecko",
    title: "Dziecko",
    img: "/boy-nature.png",
  },
  {
    id: "3",
    slug: "zabawy",
    title: "Zabawy",
    img: "/playtime.png",
  },
  {
    id: "4",
    slug: "książki",
    title: "Książki",
    img: "/books.png",
  },
];

export const getCategoryBySlug = (slug) => {
  if (!slug) return null;
  return CATEGORIES.find((cat) => cat.slug === slug) || null;
};

export const getAllCategories = () => {
  return CATEGORIES;
};

export const isValidCategory = (slug) => {
  return CATEGORIES.some((cat) => cat.slug === slug);
};

export const getCategorySlugs = () => {
  return CATEGORIES.map((cat) => cat.slug);
};

// Color mapping for CSS classes
export const CATEGORY_COLORS = {
  mama: "rgb(65, 65, 245)",
  dziecko: "rgb(223, 115, 196)",
  zabawy: "rgb(245, 161, 65)",
  książki: "rgb(67, 185, 13)",
};

// Style mapping for CSS classes (to be imported where styles are available)
export const getCategoryStyleMap = (styles) => ({
  mama: styles.mommy,
  dziecko: styles.child,
  zabawy: styles.play,
  książki: styles.books,
});
