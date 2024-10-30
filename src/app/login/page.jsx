
import React from 'react'
import styles from "./loginPage.module.css"
import Image from 'next/image';
import { auth,signIn, signOut } from '@/utils/auth';


export default async function LoginPage(){

  const session = await auth();
  console.log('session:', session);
  const user = session?.user

  return (
    <div className={styles.container}>
      <div className={styles.picture}>
        <Image src="/door.jpg" layout="fill" objectFit="cover" alt="door" />
      </div>
      {user ? (
        <>
          <div className={styles.wrapper}>
            <h2>Witaj {user.name}</h2>
            <form
              action={async () => {
                "use server";
                await signOut("google");
              }}
            >
              <button className={styles.googleButton} type="submit">
                wyloguj
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className={styles.wrapper}>
            <h2>Witaj Ponownie</h2>
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
              }}
            >
              <button className={styles.googleButton} type="submit">
                Zaloguj z Google
              </button>
            </form>
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
        </>
      )}
    </div>
  );
}
