import React from "react";
import styles from "./categoryList.module.css";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "@/utils/getBaseUrl";
import Search from "../../search/Search";

const getData = async () => {
  const res = await fetch(getApiUrl("/categories"), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const CategoryLIst = async () => {
  const data = await getData();

  if (!Array.isArray(data)) {
    console.error("Expected an array but got:", data);
    return <p>Failed to load categories</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Kategorie</h1>
        <div className={styles.searchWrapper}>
          <Search />
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
