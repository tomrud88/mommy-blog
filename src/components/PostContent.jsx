"use client";
import { sanitizeBlogContent } from "@/utils/htmlSanitizer";

const PostContent = ({ content, className }) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: sanitizeBlogContent(content || ""),
      }}
    />
  );
};

export default PostContent;
