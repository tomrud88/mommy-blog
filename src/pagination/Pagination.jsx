"use client";
import React from "react";
import styles from "./pagination.module.css";
import { useRouter } from "next/navigation";

const Pagination = ({ page, hasPrev, hasNext, cat }) => {
  const router = useRouter();

  const createQuery = (newPage) => {
    const params = new URLSearchParams();
    params.set("page", newPage);
    if (cat) params.set("cat", cat);
    return `?${params.toString()}`;
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        disabled={!hasPrev}
        onClick={() => router.push(createQuery(page - 1), { scroll: false })}
        aria-label={`Przejdź do strony ${page - 1}`}
        title={hasPrev ? `Strona ${page - 1}` : "Brak poprzedniej strony"}
      >
        Wstecz
      </button>
      <button
        className={styles.button}
        disabled={!hasNext}
        onClick={() => router.push(createQuery(page + 1), { scroll: false })}
        aria-label={`Przejdź do strony ${page + 1}`}
        title={hasNext ? `Strona ${page + 1}` : "Brak następnej strony"}
      >
        Do przodu
      </button>
    </div>
  );
};

export default Pagination;
