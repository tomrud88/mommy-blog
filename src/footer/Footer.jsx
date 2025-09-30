import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.insideContainer}>
        <div className={styles.info}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/logoN.png"
              alt="logo"
              width={50}
              height={50}
              className={styles.imgLogo}
            />
            <h1 className={styles.logoText}>Mama z Wyobraźnią</h1>
          </Link>
          <p className={styles.desc}>
            Mama z Wyobraźnią to strona internetowa stworzona z myślą o mamach,
            które szukają inspiracji i praktycznych porad na co dzień.
            Znajdziesz tu kreatywne pomysły na zabawy z dziećmi, sprawdzone
            porady dotyczące rodzicielstwa, zdrowia i rozwoju dziecka, a także
            inspiracje na ciekawe i twórcze spędzanie czasu z rodziną.
          </p>
          <div className={styles.icons}>
            <Image
              src="/communication.png"
              alt="facebook"
              width={18}
              height={18}
            />
            <Image
              src="/instagram.png"
              alt="instagram"
              width={18}
              height={18}
            />
            <Image src="/tiktok.png" alt="tiktok" width={18} height={18} />
          </div>
        </div>
        <div className={styles.links}>
          <div className={styles.list}>
            <span className={styles.listTitle}>Menu</span>
            <Link href="/">Strona Główna</Link>
            <Link href="/about">O mnie</Link>
            <Link href="/contact">Kontakt</Link>
          </div>
          <div className={styles.list}>
            <span className={styles.listTitle}>Kategorie</span>
            <Link href="/?cat=mama">Mama</Link>
            <Link href="/?cat=zabawy">Zabawy</Link>
            <Link href="/?cat=książki">Książki</Link>
            <Link href="/?cat=dziecko">Dziecko</Link>
          </div>
          <div className={styles.list}>
            <span className={styles.listTitle}>Social</span>
            <Link href="/">Facebook</Link>
            <Link href="/">Instagram</Link>
            <Link href="/">TikTok</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
