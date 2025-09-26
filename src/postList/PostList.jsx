import React from "react";
import styles from "./postList.module.css";
import Pagination from "@/pagination/Pagination";
import PostCard from "@/postCard/PostCard";

const getData = async (page, cat) => {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/posts?page=${page}&cat=${cat || ""}`,
    {
      next: {
        revalidate: 60,
        tags: ["posts", cat ? `posts-${cat}` : "posts-all"],
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const PostList = async ({ page, cat }) => {
  const { posts, count } = await getData(page, cat);

  const POST_PER_PAGE = 4;

  const hasPrev = POST_PER_PAGE * (page - 1) > 0;
  const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

  return (
    <div className={styles.container}>
      <div className={styles.posts}>
        {posts?.map((item) => (
          <PostCard key={item.id} item={item} />
        ))}
      </div>
      <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} cat={cat} />
    </div>
  );
};

export default PostList;
