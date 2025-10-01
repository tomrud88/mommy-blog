"use client";
import Image from "next/image";
import React from "react";
import styles from "./postCard.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const PostCard = ({ item }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Czy na pewno chcesz usunąć ten post?")) return;
    const res = await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, slug: item.slug }),
    });
    if (res.ok) {
      alert("Post usunięty!");
    } else {
      const error = await res.json().catch(() => null);
      alert(error?.message || "Błąd podczas usuwania.");
    }
    router.refresh();
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src={item.img}
          alt="children playing with blocks"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.textContainer}>
        <Link href={`posts/${item.slug}`}>
          <div className={styles.title}>
            <h3>{item.title}</h3>
          </div>
        </Link>
        <div className={styles.text}>
          <Link href={`posts/${item.slug}`} className={styles.readMore}>
            Czytaj więcej
          </Link>
        </div>
        {session && session.user.role === "admin" && (
          <button onClick={handleDelete} className={styles.deleteButton}>
            Usuń
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
