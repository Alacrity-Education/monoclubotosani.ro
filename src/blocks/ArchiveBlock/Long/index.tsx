import type { Post, ArchiveBlock as ArchiveBlockProps } from "@/payload-types";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import React from "react";
import RichText from "@/components/RichText";

import { LongCollectionArchive } from "./LongCollectionArchive";

export const LongArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string | null;
  }
> = async (props) => {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    longCardStyles,
  } = props;

  // Prepare styles array for up to 4 cards
  const styles: ("primary" | "secondary" | "starry" | "transparent")[] = [
    longCardStyles?.card1 ?? "primary",
    longCardStyles?.card2 ?? "secondary",
    longCardStyles?.card3 ?? "starry",
    longCardStyles?.card4 ?? "transparent",
  ];

  const limit = limitFromProps || 3;

  let posts: Post[] = [];

  if (populateBy === "collection") {
    const payload = await getPayload({ config: configPromise });

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === "object") return category.id;
      else return category;
    });

    const fetchedPosts = await payload.find({
      collection: "posts",
      depth: 1,
      sort:"-eventDate",
      limit,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    });

    posts = fetchedPosts.docs;
  } else {
    if (selectedDocs?.length) {
      posts = selectedDocs
        .map((post) => (typeof post.value === "object" ? post.value : null))
        .filter(Boolean) as Post[];
    }
  }

  return (
    <div
      className="relative my-16 w-full  overflow-x-clip  container mx-auto "
      id={`block-${id}`}
    >
      {introContent && (
        <div className="relative container mb-16">
          <RichText
            className="ms-0 max-w-3xl"
            data={introContent}
            enableGutter={false}
          />
        </div>
      )}
      <LongCollectionArchive posts={posts} styles={styles} />
    </div>
  );
};
