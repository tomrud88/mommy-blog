import React from 'react'
import styles from './categoryList.module.css'
import Link from 'next/link'
import Image from 'next/image'

const CategoryLIst = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kategorie</h1>
      <div className={styles.categories}>
        <Link
          href="/blog?cat=style"
          className={`${styles.category} ${styles.mommy}`}
        >
          <Image
            src="/sunsetMom.jpg"
            alt=""
            width={46}
            height={46}
            className={styles.image}
          />
          Mama
        </Link>
        <Link
          href="/blog?cat=style"
          className={`${styles.category} ${styles.child}`}
        >
          <Image
            src="/boy-nature.jpg"
            alt=""
            width={46}
            height={46}
            className={styles.image}
          />
          Dziecko
        </Link>
        <Link
          href="/blog?cat=style"
          className={`${styles.category} ${styles.play}`}
        >
          <Image
            src="/playtime.jpg"
            alt=""
            width={46}
            height={46}
            className={styles.image}
          />
          Zabawy
        </Link>
        <Link
          href="/blog?cat=style"
          className={`${styles.category} ${styles.books}`}
        >
          <Image
            src="/books.jpg"
            alt=""
            width={46}
            height={46}
            className={styles.image}
          />
          Książki
        </Link>
        <Link
          href="/blog?cat=style"
          className={`${styles.category} ${styles.style}`}
        >
          <Image
            src="/first-steps.png"
            alt=""
            width={46}
            height={46}
            className={styles.image}
          />
          Mama
        </Link>
      </div>
    </div>
  );
}

export default CategoryLIst