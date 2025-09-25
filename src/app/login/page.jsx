"use client";
import React from "react";
import styles from "./loginPage.module.css";
import Image from "next/image";
// import { auth, signIn, signOut } from '@/utils/auth';
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { status } = useSession();

  const router = useRouter();

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === "authenticated") {
    router.push("/");
  }

  return (
    <div className={styles.container}>
      <div className={styles.picture}>
        <Image src="/door.jpg" fill style={{ objectFit: "cover" }} alt="door" />
      </div>
      <div className={styles.wrapper}>
        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
            const username = e.target.username.value;
            const password = e.target.password.value;
            await signIn("credentials", {
              username,
              password,
              callbackUrl: "/",
            });
          }}
        >
          <input
            name="username"
            type="text"
            placeholder="Wpisz nazwę użytkownika"
            className={styles.input}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Wpisz hasło"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            Zaloguj się
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
