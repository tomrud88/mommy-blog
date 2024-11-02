import React from 'react'
import styles from './categoryList.module.css'
import Link from 'next/link'
import Image from 'next/image'

const getData = async () => {
  const res = await fetch("http://localhost:3000/api/categories", {
    cache:"no-store",
  })

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
}

const CategoryLIst = async () => {
  const data = await getData();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kategorie</h1>
      <div className={styles.categories}>
        {data?.map((item) => (
          <Link
          href="/blog?cat=style"
            className={`${styles.category} ${styles[item.slug]}`}
            key={item._id}
          >
            {item.img && (
              <Image
                src="/sunsetMom.jpg"
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
}

export default CategoryLIst