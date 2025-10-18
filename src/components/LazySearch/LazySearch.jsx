"use client";
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./lazySearch.module.css";

// Lazy load Search component
const Search = dynamic(() => import("../search/Search"), {
  loading: () => (
    <div className={styles.searchPlaceholder}>
      <div className={styles.searchIcon}>🔍</div>
      <span className={styles.searchText}>Kliknij aby wyszukać...</span>
    </div>
  ),
  ssr: false,
});

const LazySearch = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded]);

  const handleClick = () => {
    if (!hasLoaded) {
      setIsVisible(true);
      setHasLoaded(true);
    }
  };

  return (
    <div ref={containerRef} onClick={handleClick} className={styles.container}>
      {isVisible || hasLoaded ? (
        <Search />
      ) : (
        <div className={styles.searchPlaceholder}>
          <div className={styles.searchIcon}>🔍</div>
          <span className={styles.searchText}>Wyszukaj posty...</span>
        </div>
      )}
    </div>
  );
};

export default LazySearch;
