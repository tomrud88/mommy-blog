"use client";

const PostContent = ({ content, className }) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: content || "",
      }}
    />
  );
};

export default PostContent;
