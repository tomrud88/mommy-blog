"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const AuthLinks = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const { status } = useSession();

  // Close mobile menu when screen size increases above 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && open) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={menuRef}>
      {status === "unauthenticated" ? (
        <Link className={styles.link} href="/login">
          Login
        </Link>
      ) : (
        <>
          <Link href="/write" className={styles.link}>
            Napisz post
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
          <button className={styles.closeButton} onClick={() => setOpen(false)}>
            ✕
          </button>
          <Link href="/" onClick={() => setOpen(false)}>
            Strona Główna
          </Link>
          <Link href="/about" onClick={() => setOpen(false)}>
            O mnie
          </Link>
          {status === "unauthenticated" ? (
            <Link
              className={styles.loginLink}
              href="/login"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                href="/write"
                className={styles.sidelink}
                onClick={() => setOpen(false)}
              >
                Dodaj post
              </Link>
              <span
                className={styles.sidelink}
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
              >
                Logout
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthLinks;
