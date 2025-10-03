import React from 'react';
import styles from './skipLinks.module.css';

/**
 * Skip Links component for keyboard navigation accessibility
 * Allows screen reader users to skip repetitive navigation
 */
const SkipLinks = () => {
  return (
    <nav className={styles.skipLinks} aria-label="Skip links">
      <a href="#main-content" className={styles.skipLink}>
        Przejdź do głównej treści
      </a>
      <a href="#navigation" className={styles.skipLink}>
        Przejdź do nawigacji
      </a>
      <a href="#search" className={styles.skipLink}>
        Przejdź do wyszukiwania
      </a>
      <a href="#footer" className={styles.skipLink}>
        Przejdź do stopki
      </a>
    </nav>
  );
};

export default SkipLinks;