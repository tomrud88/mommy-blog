"use client";
import { useEffect } from "react";

const ViewTracker = ({ postSlug }) => {
  useEffect(() => {
    const incrementView = async () => {
      // Create a unique key for this post in this session
      const viewedKey = `viewed_${postSlug}`;
      const sessionViewed = sessionStorage.getItem(viewedKey);

      // If we've already incremented the view for this post in this session, don't do it again
      if (sessionViewed) {
        console.log(
          `View already incremented for post: ${postSlug} in this session`
        );
        return;
      }

      try {
        console.log(`Incrementing view for post: ${postSlug}`);
        const response = await fetch(`/api/posts/${postSlug}/increment-view`, {
          method: "POST",
        });

        const data = await response.json();
        console.log(`View increment response:`, data);

        if (response.ok) {
          // Mark this post as viewed in this session
          sessionStorage.setItem(viewedKey, "true");
        } else {
          console.error(
            `View increment failed with status: ${response.status}`
          );
        }
      } catch (error) {
        console.error("Failed to increment view:", error);
      }
    };

    // Only increment once per visit
    incrementView();
  }, [postSlug]);

  return null; // This component doesn't render anything
};

export default ViewTracker;
