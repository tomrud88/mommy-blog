import Image from "next/image";
import styles from "./page.module.css";
import PostList from "@/postList/PostList";
import TopSection from "@/topSection/TopSection";
import Menu from "@/components/menu/Menu";
import CategoryLIst from "@/components/menu/categoryList/CategoryLIst";

const getCategory = async (cat) => {
  if (!cat) return null;
  const { getApiUrl } = await import("@/utils/getBaseUrl");
  const res = await fetch(getApiUrl("/categories"), {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const categories = await res.json();
  return categories.find((c) => c.slug === cat);
};

export default async function Home({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const cat = searchParams.cat;
  const category = await getCategory(cat);

  if (category) {
    return (
      <div>
        <div className={`${styles.categoryHeader} ${styles[category.slug]}`}>
          <h1 className={styles.categoryTitle}>{category.title}</h1>
        </div>
        <div className={styles.content}>
          <div className={styles.blueDot}></div>
          <PostList page={page} cat={cat} />
          <Menu />
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopSection />
      <CategoryLIst />
      <div className={styles.content}>
        <div className={styles.blueDot}></div>
        <PostList page={page} cat={cat} />
        <Menu />
      </div>
    </div>
  );
}
