"use client";
import Image from "next/image";
import React, { useState } from "react";
import styles from "./postCard.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IMAGE_SIZES, IMAGE_QUALITY } from "../utils/imageOptimization";
import { getOptimizedImageUrl } from "../utils/cloudinaryOptimizer";

const PostCard = ({ item, priority = false, compact = false }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

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

  // Compact version for search results
  if (compact) {
    return (
      <Link href={`/posts/${item.slug}`} className={styles.compactContainer}>
        {item.img && (
          <div className={styles.compactImageContainer}>
            <Image
              src={getOptimizedImageUrl(item.img, "thumbnail")}
              alt={item.title || "Blog post image"}
              fill
              style={{ objectFit: "cover" }}
              className={styles.compactImage}
              sizes="80px"
              quality={60}
            />
          </div>
        )}
        <div className={styles.compactTextContainer}>
          <h4 className={styles.compactTitle}>{item.title}</h4>
          {item.desc && (
            <p
              className={styles.compactDesc}
              dangerouslySetInnerHTML={{
                __html: item.highlightedDesc || item.desc,
              }}
            />
          )}
          <div className={styles.compactMeta}>
            {item.category && (
              <span className={styles.compactCategory}>
                {item.category.title}
              </span>
            )}
            {item.commentCount && item.commentCount > 0 && (
              <span className={styles.compactComments}>
                {item.commentCount} komentarzy
              </span>
            )}
            <span className={styles.compactDate}>
              {new Date(item.createdAt).toLocaleDateString("pl-PL")}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className={styles.container}>
      {item.img ? (
        <div className={styles.imageContainer}>
          <Image
            src={getOptimizedImageUrl(item.img, "post")}
            alt={item.title || "Blog post image"}
            fill
            style={{ objectFit: "cover" }}
            className={styles.image}
            data-loaded={imageLoaded}
            sizes={IMAGE_SIZES.post}
            quality={70}
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      ) : (
        <div
          className={styles.imageContainer}
          style={{
            backgroundColor: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#999", fontSize: "14px" }}>Brak zdjęcia</span>
        </div>
      )}
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
