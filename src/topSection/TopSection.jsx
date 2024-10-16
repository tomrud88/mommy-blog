import Image from 'next/image';
import React from 'react';
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
      <div className={styles.imgContainer}>
        <Image
          src="/front.jpg"
          alt="mom width child"
          className={styles.mainImg}
          width={1400}
          height={900}
          layout="responsive"
        ></Image>
      </div>
    </div>
  );
}

export default TopSection