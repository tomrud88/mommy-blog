"use client";
import { sanitizeBlogContent } from "@/utils/htmlSanitizer";
import styles from "../posts/[slug]/singlePage.module.css";

const PostContent = ({ content }) => {
  return (
    <div
      className={styles.description}
      dangerouslySetInnerHTML={{
        __html: sanitizeBlogContent(content || ""),
      }}
    />
  );
};

export default PostContent;
