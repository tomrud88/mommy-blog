import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer
      id="footer"
      className={styles.container}
      role="contentinfo"
      aria-label="Stopka strony"
    >
      <div className={styles.insideContainer}>
        <div className={styles.info}>
          <Link
            href="/"
            className={styles.logo}
            aria-label="Powrót na stronę główną"
          >
            <Image
              src="/logoN.png"
              alt="Logo Mama z Wyobraźnią"
              width={50}
              height={50}
              className={styles.imgLogo}
              sizes="50px"
              quality={90}
            />
            <h2 className={styles.logoText}>Mama z Wyobraźnią</h2>
          </Link>
          <p className={styles.desc}>
            Mama z Wyobraźnią to strona internetowa stworzona z myślą o mamach,
            które szukają inspiracji i praktycznych porad na co dzień.
            Znajdziesz tu kreatywne pomysły na zabawy z dziećmi, sprawdzone
            porady dotyczące rodzicielstwa, zdrowia i rozwoju dziecka, a także
            inspiracje na ciekawe i twórcze spędzanie czasu z rodziną.
          </p>
          <div className={styles.icons}>
            <a
              href="https://facebook.com/mamazzwyobraznia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook - Mama z Wyobraźnią"
            >
              <Image
                src="/communication.png"
                alt="Facebook"
                width={18}
                height={18}
              />
            </a>
            <a
              href="https://instagram.com/mamazzwyobraznia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram - Mama z Wyobraźnią"
            >
              <Image
                src="/instagram.png"
                alt="Instagram"
                width={18}
                height={18}
              />
            </a>
            <a
              href="https://tiktok.com/@mamazzwyobraznia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok - Mama z Wyobraźnią"
            >
              <Image src="/tiktok.png" alt="TikTok" width={18} height={18} />
            </a>
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
            <Link
              href="https://facebook.com/mamazzwyobraznia"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </Link>
            <Link
              href="https://instagram.com/mamazzwyobraznia"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </Link>
            <Link
              href="https://tiktok.com/@mamazzwyobraznia"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
