import React from 'react'
import styles from './comments.module.css'
import Link from 'next/link';
import Image from 'next/image';

const Comments = () => {
    const status = "authenticated";
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Komentarze</h1>
      {status === "authenticated" ? (
        <div className={styles.write}>
          <textarea placeholder="write a comment..." className={styles.input} />
          <button className={styles.button}>Dodaj</button>
        </div>
      ) : (
        <Link href="/login">Zaloguj się żeby dodać opinie</Link>
      )}
      <div className={styles.comments}>
        <div className={styles.comment}>
          <div className={styles.user}>
            <Image
              src="/front.jpg"
              alt=""
              width={50}
              height={50}
              className={styles.image}
            />
            <div className={styles.userInfo}>
              <span className={styles.username}>Ewa</span>
              <span className={styles.date}>10.12.2024</span>
            </div>
          </div>
          <p className={styles.description}>
            Jeśli trudno znaleźć czas na pełną sesję ulubionej aktywności,
            spróbuj dzielić ją na krótsze etapy – np. jeśli lubisz malować,
            poświęć 15 minut dziennie, zamiast szukać godziny w tygodniu.
          </p>
        </div>
        <div className={styles.comment}>
          <div className={styles.user}>
            <Image
              src="/front.jpg"
              alt=""
              width={50}
              height={50}
              className={styles.image}
            />
            <div className={styles.userInfo}>
              <span className={styles.username}>Ewa</span>
              <span className={styles.date}>10.12.2024</span>
            </div>
          </div>
          <p className={styles.description}>
            Jeśli trudno znaleźć czas na pełną sesję ulubionej aktywności,
            spróbuj dzielić ją na krótsze etapy – np. jeśli lubisz malować,
            poświęć 15 minut dziennie, zamiast szukać godziny w tygodniu.
          </p>
        </div>
        <div className={styles.comment}>
          <div className={styles.user}>
            <Image
              src="/front.jpg"
              alt=""
              width={50}
              height={50}
              className={styles.image}
            />
            <div className={styles.userInfo}>
              <span className={styles.username}>Ewa</span>
              <span className={styles.date}>10.12.2024</span>
            </div>
          </div>
          <p className={styles.description}>
            Jeśli trudno znaleźć czas na pełną sesję ulubionej aktywności,
            spróbuj dzielić ją na krótsze etapy – np. jeśli lubisz malować,
            poświęć 15 minut dziennie, zamiast szukać godziny w tygodniu.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Comments