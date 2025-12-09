"use client";
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./lazyComments.module.css";

// Lazy load Comments component
const Comments = dynamic(() => import("../menu/comments/Comments"), {
  loading: () => (
    <div className={styles.commentsLoading}>
      <div className={styles.loadingSpinner}></div>
      <p className={styles.loadingText}>Ładowanie komentarzy...</p>
    </div>
  ),
  ssr: false
});

const LazyComments = ({ postSlug }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px" // Start loading 200px before element is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      {shouldLoad ? (
        <Comments postSlug={postSlug} />
      ) : (
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>💬</div>
          <h3 className={styles.placeholderTitle}>Komentarze</h3>
          <p className={styles.placeholderText}>
            Przewiń w dół aby zobaczyć komentarze
          </p>
        </div>
      )}
    </div>
  );
};

export default LazyComments;