import React from "react";
import styles from "./categoryList.module.css";
import Link from "next/link";
import Image from "next/image";
import LazySearch from "../../LazySearch/LazySearch";
import { getAllCategories } from "@/utils/categories";

const CategoryLIst = async () => {
  const data = getAllCategories();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Kategorie</h1>
        <div className={styles.searchWrapper}>
          <LazySearch />
        </div>
      </div>
      <div className={styles.categories}>
        {data.map((item) => (
          <Link
            href={`/?cat=${item.slug}`}
            className={`${styles.category} ${styles[item.slug]}`}
            key={item.id}
          >
            {item.img && (
              <Image
                src={item.img}
                alt=""
                width={46}
                height={46}
                className={styles.image}
              />
            )}
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryLIst;
