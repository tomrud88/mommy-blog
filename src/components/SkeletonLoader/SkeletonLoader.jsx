import React from "react";
import styles from "./SkeletonLoader.module.css";

const PostCardSkeleton = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonText}></div>
        <div className={`${styles.skeletonText} ${styles.short}`}></div>
      </div>
    </div>
  );
};

const PostListSkeleton = () => {
  return (
    <>
      {[...Array(4)].map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </>
  );
};

export default PostListSkeleton;
export { PostCardSkeleton };
