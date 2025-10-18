import Image from "next/image";
import styles from "./page.module.css";
import PostList from "@/postList/PostList";
import TopSection from "@/topSection/TopSection";
import Menu from "@/components/menu/Menu";
import CategoryLIst from "@/components/menu/categoryList/CategoryLIst";
import { getCategoryBySlug } from "@/utils/categories";

export default async function Home({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const cat = searchParams.cat;
  const category = getCategoryBySlug(cat);

  if (category) {
    return (
      <div>
        <div className={`${styles.categoryHeader} ${styles[category.slug]}`}>
          <h1 className={styles.categoryTitle}>{category.title}</h1>
        </div>
        <div className={styles.content}>
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
        <PostList page={page} cat={cat} />
        <Menu />
      </div>
    </div>
  );
}
