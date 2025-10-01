import React from "react";
import styles from "./postList.module.css";
import Pagination from "@/pagination/Pagination";
import PostCard from "@/postCard/PostCard";
import { getApiUrl } from "@/utils/getBaseUrl";

const getData = async (page, cat) => {
  try {
    const apiUrl = getApiUrl(`/posts?page=${page}&cat=${cat || ""}`);
    console.log("Fetching from:", apiUrl); // Debug log

    const res = await fetch(apiUrl, {
      next: {
        revalidate: 60,
        tags: ["posts", cat ? `posts-${cat}` : "posts-all"],
      },
    });

    if (!res.ok) {
      console.error("API Error:", res.status, res.statusText);
      // Return empty data instead of throwing
      return { posts: [], count: 0 };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getData error:", error);
    // Return empty data on error
    return { posts: [], count: 0 };
  }
};

const PostList = async ({ page, cat }) => {
  const { posts, count } = await getData(page, cat);

  const POST_PER_PAGE = 4;

  const hasPrev = POST_PER_PAGE * (page - 1) > 0;
  const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

  return (
    <div className={styles.container}>
      <div className={styles.posts}>
        {posts && posts.length > 0 ? (
          posts.map((item, index) => (
            <PostCard key={item.id} item={item} priority={index === 0} />
          ))
        ) : (
          <div className={styles.noPosts}>
            <p>Brak postów do wyświetlenia.</p>
          </div>
        )}
      </div>
      <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} cat={cat} />
    </div>
  );
};

export default PostList;
