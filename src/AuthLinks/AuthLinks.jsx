"use client"
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const AuthLinks = () => {

    const [open, setOpen] = useState(false);

   const { status } = useSession();
  
    return (
      <>
        {status === "unauthenticated" ? (
          <Link className={styles.link} href="/login">
            Login
          </Link>
        ) : (
          <>
            <Link href="/write" className={styles.link}>
              Write
            </Link>
            <span className={styles.link} onClick={signOut}>
              Logout
            </span>
          </>
        )}
        <div className={styles.burger} onClick={() => setOpen(!open)}>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </div>
        {open && (
          <div className={styles.responsiveMenu}>
            <Link href="/">Strona Główna</Link>
            <Link href="/">O mnie</Link>
            <Link href="/">Dziennik Mamy</Link>
            {status === "unauthenticated" ? (
              <Link className={styles.loginLink} href="/login">
                Login
              </Link>
            ) : (
              <>
                <Link href="/write" className={styles.sidelink}>
                  Dodaj post
                </Link>
                <span className={styles.sidelink} onClick={signOut}>Logout</span>
              </>
            )}
          </div>
        )}
      </>
    );
};

export default AuthLinks