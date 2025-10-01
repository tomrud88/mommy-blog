import Image from "next/image";
import styles from "./singlePage.module.css";
import Menu from "@/components/menu/Menu";
import Comments from "@/components/menu/comments/Comments";
import ViewTracker from "@/components/ViewTracker";
import HeroImage from "@/components/HeroImage/HeroImage";
import { getApiUrl } from "@/utils/getBaseUrl";

const getData = async (slug) => {
  try {
    const res = await fetch(getApiUrl(`/posts/${slug}`), {
      next: {
        revalidate: 60,
        tags: ["posts", `post-${slug}`],
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Post "${slug}" nie został znaleziony`);
      }
      throw new Error(`Błąd podczas ładowania posta: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

const SinglePage = async ({ params }) => {
  const { slug } = params;

  try {
    const data = await getData(slug);

    return (
      <div className={styles.container}>
        <ViewTracker postSlug={slug} />
        <div className={styles.infoContainer}>
          <div className={styles.textContainer}>
            <h1 className={styles.title}>{data?.title}</h1>
          </div>
          <div className={styles.imageContainer}>
            {data?.img && (
              <HeroImage
                src={data.img}
                alt={`Zdjęcie do artykułu: ${data.title}`}
                className={styles.image}
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority={true}
                quality={75}
              />
            )}
          </div>
        </div>
        <div className={styles.contentSingle}>
          <div className={styles.post}>
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: data?.desc }}
            />
            <Comments postSlug={slug} />
          </div>
          <Menu />
        </div>
      </div>
    );
  } catch (error) {
    // Return a not-found page for 404 errors
    if (error.message.includes("nie został znaleziony")) {
      return (
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <h1 className={styles.errorTitle}>404 - Post nie znaleziony</h1>
            <p className={styles.errorMessage}>
              Szukany artykuł &quot;{slug}&quot; nie istnieje lub został
              usunięty.
            </p>
            <a href="/" className={styles.backLink}>
              ← Powrót do strony głównej
            </a>
          </div>
        </div>
      );
    }

    // For other errors, re-throw to be caught by error boundary
    throw error;
  }
};

export default SinglePage;
