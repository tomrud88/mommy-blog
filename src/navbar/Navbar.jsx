import React from "react";
import styles from "./navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import AuthLinks from "@/AuthLinks/AuthLinks";

const Navbar = () => {
  return (
    <header className={styles.container} role="banner">
      <nav id="navigation" className={styles.nav} role="navigation" aria-label="Główna nawigacja">
        <Link href="/" className={styles.logo} aria-label="Strona główna - Mama z Wyobraźnią">
          <Image
            src="/logo-mom.transformed.png"
            width={110}
            height={90}
            alt="Logo Mama z Wyobraźnią - stylizowany obraz mamy z dzieckiem"
          />
        </Link>
        <Link href="/" className={styles.title}>
          Mama z Wyobraźnią
        </Link>
        <div className={styles.links}>
          <Link href="/" className={styles.link} aria-label="Przejdź do strony głównej">
            Strona Główna
          </Link>
          <Link href="/about" className={styles.link} aria-label="Przejdź do sekcji o mnie">
            O mnie
          </Link>
          <AuthLinks />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
