import React from 'react'
import styles from "./pagination.module.css";

const Pagination = () => {
  return (
    <div className={styles.container}>
      <button className={styles.button}>Wstecz</button>
      <button className={styles.button}>Do przodu</button>
    </div>
  );
}

export default Pagination