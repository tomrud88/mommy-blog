import Link from "next/link";
import Image from "next/image";
import styles from "./PostNavigation.module.css";

const PostNavigation = ({ previousPost, nextPost }) => {
  return (
    <nav className={styles.navigation} aria-label="Nawigacja między artykułami">
      <div className={styles.navContainer}>
        {/* Previous Post */}
        <div className={styles.navItem}>
          {previousPost ? (
            <Link
              href={`/posts/${previousPost.slug}`}
              className={styles.navLink}
            >
              <div className={styles.navDirection}>
                <span className={styles.arrow}>←</span>
                <span className={styles.label}>Poprzedni artykuł</span>
              </div>
              <div className={styles.postPreview}>
                {previousPost.img && (
                  <div className={styles.thumbnailContainer}>
                    <Image
                      src={previousPost.img}
                      alt={`Miniaturka: ${previousPost.title}`}
                      width={60}
                      height={60}
                      className={styles.thumbnail}
                    />
                  </div>
                )}
                <h3 className={styles.postTitle}>{previousPost.title}</h3>
              </div>
            </Link>
          ) : (
            <div className={styles.navPlaceholder}>
              <span className={styles.disabledLabel}>
                Brak poprzedniego artykułu
              </span>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className={styles.homeButton}>
          <Link href="/" className={styles.homeLink}>
            <span className={styles.homeIcon}>🏠</span>
            <span className={styles.homeLabel}>Strona główna</span>
          </Link>
        </div>

        {/* Next Post */}
        <div className={styles.navItem}>
          {nextPost ? (
            <Link href={`/posts/${nextPost.slug}`} className={styles.navLink}>
              <div className={styles.navDirection}>
                <span className={styles.label}>Następny artykuł</span>
                <span className={styles.arrow}>→</span>
              </div>
              <div className={styles.postPreview}>
                <h3 className={styles.postTitle}>{nextPost.title}</h3>
                {nextPost.img && (
                  <div className={styles.thumbnailContainer}>
                    <Image
                      src={nextPost.img}
                      alt={`Miniaturka: ${nextPost.title}`}
                      width={60}
                      height={60}
                      className={styles.thumbnail}
                    />
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <div className={styles.navPlaceholder}>
              <span className={styles.disabledLabel}>
                Brak następnego artykułu
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PostNavigation;
