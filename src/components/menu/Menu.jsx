import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import styles from './menu.module.css'
import MenuCategories from './menuCategories/MenuCategories'

const Menu = () => {
  return (
    <div className={styles.container}>
      <h2 style={{ fontSize: "28px" }}>Najpopularniejsze</h2>
      <div className={styles.items}>
        <Link href="/" className={styles.item}>
          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles.mommy}`}>Mama</span>
            <h3 className={styles.postTitle}>
              5 sposobów jak spędzać aktywnie czas z dzieckiem
            </h3>
            <div className={styles.detail}>
              <span className={styles.username}>Ewa B</span>
              <span className={styles.date}> - 20.11.2024</span>
            </div>
          </div>
        </Link>
        <Link href="/" className={styles.item}>
          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles.child}`}>
              Dziecko
            </span>
            <h3 className={styles.postTitle}>
              5 sposobów jak spędzać aktywnie czas z dzieckiem
            </h3>
            <div className={styles.detail}>
              <span className={styles.username}>Ewa B</span>
              <span className={styles.date}> - 20.11.2024</span>
            </div>
          </div>
        </Link>
        <Link href="/" className={styles.item}>
          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles.play}`}>Zabawy</span>
            <h3 className={styles.postTitle}>
              5 sposobów jak spędzać aktywnie czas z dzieckiem
            </h3>
            <div className={styles.detail}>
              <span className={styles.username}>Ewa B</span>
              <span className={styles.date}> - 20.11.2024</span>
            </div>
          </div>
        </Link>
        <Link href="/" className={styles.item}>
          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles.books}`}>
              Książki
            </span>
            <h3 className={styles.postTitle}>
              5 sposobów jak spędzać aktywnie czas z dzieckiem
            </h3>
            <div className={styles.detail}>
              <span className={styles.username}>Ewa B</span>
              <span className={styles.date}> - 20.11.2024</span>
            </div>
          </div>
        </Link>
      </div>
      <h1 className={styles.title}>Kategorie</h1>
      <MenuCategories/>
      <h2 style={{ fontSize: "28px" }}>Autor poleca</h2>
      <div className={styles.items}>
        <Link href="/" className={styles.item}>
          <div className={styles.imageContainer}>
            <Image
              src="/front.jpg"
              height={100}
              width={100}
              alt=""
              className={styles.image}
            />
          </div>
          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles.mommy}`}>Mama</span>
            <h3 className={styles.postTitle}>
              5 sposobów jak spędzać aktywnie czas z dzieckiem
            </h3>
            <div className={styles.detail}>
              <span className={styles.username}>Ewa B</span>
              <span className={styles.date}> - 20.11.2024</span>
            </div>
          </div>
        </Link>
        <Link href="/" className={styles.item}>
          <div className={styles.imageContainer}>
            <Image
              src="/front.jpg"
              height={100}
              width={100}
              alt=""
              className={styles.image}
            />
          </div>
          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles.child}`}>
              Dziecko
            </span>
            <h3 className={styles.postTitle}>
              5 sposobów jak spędzać aktywnie czas z dzieckiem
            </h3>
            <div className={styles.detail}>
              <span className={styles.username}>Ewa B</span>
              <span className={styles.date}> - 20.11.2024</span>
            </div>
          </div>
        </Link>
        <Link href="/" className={styles.item}>
          <div className={styles.imageContainer}>
            <Image
              src="/front.jpg"
              height={100}
              width={100}
              alt=""
              className={styles.image}
            />
          </div>
          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles.play}`}>Zabawy</span>
            <h3 className={styles.postTitle}>
              5 sposobów jak spędzać aktywnie czas z dzieckiem
            </h3>
            <div className={styles.detail}>
              <span className={styles.username}>Ewa B</span>
              <span className={styles.date}> - 20.11.2024</span>
            </div>
          </div>
        </Link>
        <Link href="/" className={styles.item}>
          <div className={styles.imageContainer}>
            <Image
              src="/front.jpg"
              height={100}
              width={100}
              alt=""
              className={styles.image}
            />
          </div>
          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles.books}`}>
              Książki
            </span>
            <h3 className={styles.postTitle}>
              5 sposobów jak spędzać aktywnie czas z dzieckiem
            </h3>
            <div className={styles.detail}>
              <span className={styles.username}>Ewa B</span>
              <span className={styles.date}> - 20.11.2024</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Menu