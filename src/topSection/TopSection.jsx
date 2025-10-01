import Image from "next/image";
import React from "react";
import styles from "./topSection.module.css";

const TopSection = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftSite}>
        <div className={styles.roundBlue}></div>
        <div className={styles.titleSquare}>
          <h1>Macierzyństwo pełne pomysłów i wsparcia</h1>
        </div>
        <div className={styles.roundOrange}></div>
      </div>
      <div className={styles.imageContainer}>
        <Image
          src="/front.webp"
          alt="Mama z dzieckiem - macierzyństwo pełne radości"
          className={styles.mainImg}
          width={1400}
          height={700}
          priority
          style={{ width: "auto", height: "auto" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1400px"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          quality={85}
        />
      </div>
    </div>
  );
};

export default TopSection;
