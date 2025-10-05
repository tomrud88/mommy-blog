import Image from "next/image";
import React from "react";
import styles from "./topSection.module.css";

const TopSection = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.textSection}>
          <div className={styles.decorativeElements}>
            <div className={styles.roundBlue}></div>
            <div className={styles.roundOrange}></div>
          </div>
          <div className={styles.titleSquare}>
            <h1>Macierzyństwo pełne pomysłów i wsparcia</h1>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src="/front.webp"
            alt="Mama z dzieckiem - macierzyństwo pełne radości"
            className={styles.mainImg}
            width={800}
            height={500}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            quality={85}
          />
        </div>
      </div>
    </div>
  );
};

export default TopSection;
