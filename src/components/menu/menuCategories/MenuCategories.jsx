import Link from "next/link";
import styles from "./menuCategories.module.css";
import { getAllCategories, CATEGORY_COLORS } from "@/utils/categories";

const MenuCategories = async () => {
  const data = getAllCategories();

  return (
    <div className={styles.categoryList}>
      {data.map((item) => (
        <Link
          key={item.id}
          href={`/?cat=${item.slug}`}
          className={styles.categoryItem}
          style={{ backgroundColor: CATEGORY_COLORS[item.slug] || "#6b7280" }}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};

export default MenuCategories;
