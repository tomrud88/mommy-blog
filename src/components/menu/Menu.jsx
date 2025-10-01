import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./menu.module.css";
import MenuCategories from "./menuCategories/MenuCategories";
import { getApiUrl } from "@/utils/getBaseUrl";

const Menu = async () => {
  let popularPosts = [];

  try {
    const res = await fetch(getApiUrl("/posts/popular-by-category"), {
      cache: "no-store", // Disable caching for testing
    });

    if (res.ok) {
      popularPosts = await res.json();
      console.log(
        "Popular posts fetched in Menu:",
        popularPosts.map((p) => ({ title: p.title, views: p.views }))
      );
    } else {
      console.error("Failed to fetch popular posts, status:", res.status);
    }
  } catch (error) {
    console.error("Failed to fetch popular posts by category:", error);
  }

  console.log("Popular posts count:", popularPosts.length);

  // Mapping for CSS class names
  const categoryStyleMap = {
    mama: styles.mommy,
    dziecko: styles.child,
    zabawy: styles.play,
    książki: styles.books,
  };

  return (
    <div className={styles.container}>
      <h2 style={{ fontSize: "22px" }}>Najpopularniejsze</h2>
      <div className={styles.items}>
        {popularPosts.length > 0 ? (
          popularPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className={styles.item}
            >
              <div className={styles.textContainer}>
                <span
                  className={`${styles.category} ${
                    categoryStyleMap[post.cat.slug] || styles.mommy
                  }`}
                >
                  {post.cat.title}
                </span>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <div className={styles.detail}>
                  <span className={styles.username}>Ewa B</span>
                  <span className={styles.date}>
                    - {new Date(post.createdAt).toLocaleDateString("pl-PL")}
                  </span>
                  <span className={styles.views}>
                    {" "}
                    • {post.views} wyświetleń
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          // Fallback to hardcoded content if API fails
          <>
            <Link href="/" className={styles.item}>
              <div className={styles.textContainer}>
                <span className={`${styles.category} ${styles.mommy}`}>
                  Mama
                </span>
                <h3 className={styles.postTitle}>
                  5 sposobów jak spędzać aktywnie czas z dzieckiem
                </h3>
                <div className={styles.detail}>
                  <span className={styles.username}>Ewa B</span>
                  <span className={styles.date}> - 20.11.2024</span>
                  <span className={styles.views}> • 0 wyświetleń</span>
                </div>
              </div>
            </Link>
            <Link href="/" className={styles.item}>
              <div className={styles.textContainer}>
                <span className={`${styles.category} ${styles.child}`}>
                  Dziecko
                </span>
                <h3 className={styles.postTitle}>
                  5 sposobów jak spędzać aktywnie czas z dzieckiem
                </h3>
                <div className={styles.detail}>
                  <span className={styles.username}>Ewa B</span>
                  <span className={styles.date}> - 20.11.2024</span>
                  <span className={styles.views}> • 0 wyświetleń</span>
                </div>
              </div>
            </Link>
            <Link href="/" className={styles.item}>
              <div className={styles.textContainer}>
                <span className={`${styles.category} ${styles.play}`}>
                  Zabawy
                </span>
                <h3 className={styles.postTitle}>
                  5 sposobów jak spędzać aktywnie czas z dzieckiem
                </h3>
                <div className={styles.detail}>
                  <span className={styles.username}>Ewa B</span>
                  <span className={styles.date}> - 20.11.2024</span>
                  <span className={styles.views}> • 0 wyświetleń</span>
                </div>
              </div>
            </Link>
            <Link href="/" className={styles.item}>
              <div className={styles.textContainer}>
                <span className={`${styles.category} ${styles.books}`}>
                  Książki
                </span>
                <h3 className={styles.postTitle}>
                  5 sposobów jak spędzać aktywnie czas z dzieckiem
                </h3>
                <div className={styles.detail}>
                  <span className={styles.username}>Ewa B</span>
                  <span className={styles.date}> - 20.11.2024</span>
                  <span className={styles.views}> • 0 wyświetleń</span>
                </div>
              </div>
            </Link>
          </>
        )}
      </div>
      <h1 className={styles.title}>Kategorie</h1>
      <MenuCategories />
      <h2 style={{ fontSize: "22px" }}>Autor poleca</h2>
      <div className={styles.items}>
        <Link
          href="/posts/czas-dla-siebie-jak-znale-rwnowag-midzy-macierzystwem-a-chwil-oddechu"
          className={styles.item}
        >
          <div className={styles.imageContainer}>
            <Image
              src="/balance.webp"
              height={100}
              width={100}
              alt=""
              className={styles.image}
            />
          </div>
          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles.mommy}`}>Mama</span>
            <h3 className={styles.postTitle}>
              Czas dla siebie: Jak znaleźć równowagę między macierzyństwem a
              chwilą oddechu
            </h3>
            <div className={styles.detail}>
              <span className={styles.username}>Ewa B</span>
              <span className={styles.date}> - 15.11.2024</span>
            </div>
          </div>
        </Link>
        <Link
          href="/posts/wsplne-czy-osobne-grupy-w-przedszkolu-plusy-i-minusy-obu-rozwiza"
          className={styles.item}
        >
          <div className={styles.imageContainer}>
            <Image
              src="/children-block-game.jpg"
              height={100}
              width={100}
              alt=""
              className={styles.image}
            />
          </div>
          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles.child}`}>
              Dziecko
            </span>
            <h3 className={styles.postTitle}>
              Wspólne czy osobne grupy w przedszkolu? Plusy i minusy obu
              rozwiązań
            </h3>
            <div className={styles.detail}>
              <span className={styles.username}>Ewa B</span>
              <span className={styles.date}> - 18.11.2024</span>
            </div>
          </div>
        </Link>
        <Link
          href="/posts/5-sposobow-jak-spedzac-aktywnie-czas-z-dzieckiem"
          className={styles.item}
        >
          <div className={styles.imageContainer}>
            <Image
              src="/mother-with-daughter-summer.webp"
              height={100}
              width={100}
              alt=""
              className={styles.image}
            />
          </div>
          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles.play}`}>Zabawy</span>
            <h3 className={styles.postTitle}>
              5 sposobów jak spędzać aktywnie czas z dzieckiem
            </h3>
            <div className={styles.detail}>
              <span className={styles.username}>Ewa B</span>
              <span className={styles.date}> - 22.11.2024</span>
            </div>
          </div>
        </Link>
        <Link
          href="/posts/jak-mowic-zeby-dzieci-nas-sluchaly-jak-sluchac-zeby-dzieci-do-nas-mowily"
          className={styles.item}
        >
          <div className={styles.imageContainer}>
            <Image
              src="/Jak-mówić-żeby-dzieci-nas-słuchały.webp"
              height={100}
              width={100}
              alt=""
              className={styles.image}
            />
          </div>
          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles.books}`}>
              Książki
            </span>
            <h3 className={styles.postTitle}>
              Jak mówić, żeby dzieci nas słuchały. Jak słuchać, żeby dzieci do
              nas mówiły
            </h3>
            <div className={styles.detail}>
              <span className={styles.username}>Ewa B</span>
              <span className={styles.date}> - 25.11.2024</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Menu;
