import React from 'react'
import styles from "./loginPage.module.css"
import Image from 'next/image';

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.picture}>
        <Image src="/door.jpg" layout="fill" objectFit="cover" alt="door" />
      </div>
      <div className={styles.wrapper}>
        <h2>Witaj Ponownie</h2>
        <button className={styles.googleButton}>Zaloguj z Google</button>
        <p>lub przez email</p>
        <form action="" className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Adres email</label>
            <input
              className={styles.input}
              type="text"
              for="email"
              placeholder="adres email"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Hasło</label>
            <input
              className={styles.input}
              type="text"
              for="password"
              placeholder="Hasło"
            />
          </div>

          <button className={styles.loginButton}>Zaloguj</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage