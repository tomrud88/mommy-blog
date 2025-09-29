import React from 'react'
import styles from "./navbar.module.css"
import Link from 'next/link'
import Image from 'next/image';
import AuthLinks from '@/AuthLinks/AuthLinks';

const Navbar = () => {
  return (
      <div className={styles.container}>
          <div className={styles.logo}>
              <Image src="/logo-mom.transformed.png" width={110} height={90} alt='logo'></Image>
          </div>
      <div className={styles.title}>Mama z Wyobraźnią</div>
      <div className={styles.links}>
        <Link href="/"  className={styles.link}>Strona Główna</Link>
        <Link href="/about"  className={styles.link}>O mnie</Link>
        <Link href="/"  className={styles.link}>Dziennik Mamy</Link>
        <AuthLinks/>
      </div>
    </div>
  );
}

export default Navbar


