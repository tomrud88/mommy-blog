"use client";
import React, { useState } from "react";
import styles from "./comments.module.css";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useCSRFForm } from "@/hooks/useCSRFToken";

const fetcher = async (url) => {
  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message);
    throw error;
  }

  return data;
};

const Comments = ({ postSlug }) => {
  const { status } = useSession();
  const { submitJSON, isReady: csrfReady } = useCSRFForm();

  const { data, mutate, isLoading, isError } = useSWR(
    `/api/comments?postSlug=${postSlug}`,
    fetcher
  );

  const [desc, setDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!desc.trim()) {
      alert("Proszę napisać komentarz");
      return;
    }

    if (!csrfReady) {
      alert("Ładowanie zabezpieczeń, spróbuj ponownie za chwilę");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitJSON("/api/comments", {
        desc: desc.trim(),
        postSlug,
      });

      if (res.ok) {
        setDesc("");
        mutate(); // Refresh comments
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Błąd podczas dodawania komentarza"
        );
      }
    } catch (error) {
      console.error("Comment submission error:", error);
      alert(error.message || "Wystąpił błąd podczas dodawania komentarza");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Komentarze</h1>
      {status === "authenticated" ? (
        <div className={styles.write}>
          <textarea
            placeholder="Napisz komentarz..."
            className={styles.input}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            disabled={isSubmitting}
          />
          <button
            className={styles.button}
            onClick={handleSubmit}
            disabled={isSubmitting || !csrfReady}
          >
            {isSubmitting ? "Dodawanie..." : "Dodaj"}
          </button>
        </div>
      ) : (
        <Link href="/login">Zaloguj się żeby dodać opinie</Link>
      )}
      <div className={styles.comments}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.loadingText}>Ładowanie komentarzy...</div>
          </div>
        ) : isError ? (
          <div className={styles.error}>Błąd podczas ładowania komentarzy</div>
        ) : data?.length === 0 ? (
          <div className={styles.noComments}>
            Brak komentarzy. Bądź pierwszy!
          </div>
        ) : (
          data?.map((item) => (
            <div className={styles.comment} key={item._id}>
              <div className={styles.user}>
                {item?.user?.img && (
                  <Image
                    src={item.user.img}
                    alt=""
                    width={50}
                    height={50}
                    className={styles.image}
                  />
                )}
                <div className={styles.userInfo}>
                  <span className={styles.username}>{item.user.name}</span>
                  <span className={styles.date}>
                    {new Date(item.createdAt).toLocaleDateString("pl-PL")}
                  </span>
                </div>
              </div>
              <p className={styles.desc}>{item.desc}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
