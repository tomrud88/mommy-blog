import Link from 'next/link';
import styles from "./menuCategories.module.css"

const MenuCategories = () => {
  return (
    <div className={styles.categoryList}>
      <Link
        href="/blog?cat=style"
        className={`${styles.categoryItem} ${styles.mommy}`}
      >
        Mama
      </Link>
      <Link
        href="/blog?cat=style"
        className={`${styles.categoryItem} ${styles.child}`}
      >
        Dziecko
      </Link>
      <Link
        href="/blog?cat=style"
        className={`${styles.categoryItem} ${styles.play}`}
      >
        Zabawy
      </Link>
      <Link
        href="/blog?cat=style"
        className={`${styles.categoryItem} ${styles.books}`}
      >
        Książki
      </Link>
    </div>
  );
}

export default MenuCategories