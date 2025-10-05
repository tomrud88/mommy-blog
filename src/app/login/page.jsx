"use client";
import React from "react";
import styles from "./loginPage.module.css";
import Image from "next/image";
import Link from "next/link";
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
        <Image
          src="/door.jpg"
          fill
          style={{ objectFit: "cover" }}
          alt="door"
          sizes="(max-width: 768px) 100vw, 50vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      </div>
      <div className={styles.wrapper}>
        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            await signIn("credentials", {
              email,
              password,
              callbackUrl: "/",
            });
          }}
        >
          <h1 className={styles.title}>Zaloguj się</h1>
          <input
            name="email"
            type="email"
            placeholder="Wpisz email"
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
        <p className={styles.link}>
          Nie masz konta? <Link href="/register">Zarejestruj się</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
