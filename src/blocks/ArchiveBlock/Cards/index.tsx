import type { Post, ArchiveBlock as ArchiveBlockProps } from "@/payload-types";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import React from "react";
import RichText from "@/components/RichText";
import { cn } from "@/utilities/ui";
import Link from "next/link";
import { Media } from "@/components/Media";

export const CardsArchiveBlock: React.FC<
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

  const styles: ("primary" | "secondary" | "starry" | "transparent")[] = [
    longCardStyles?.card1 ?? "primary",
    longCardStyles?.card2 ?? "secondary",
    longCardStyles?.card3 ?? "starry",
    longCardStyles?.card4 ?? "transparent",
  ];

  const limit = limitFromProps || 6;

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

  const getVariantClasses = (
    variant: "primary" | "secondary" | "starry" | "transparent"
  ) =>
    variant === "primary"
      ? "bg-primary text-primary-content"
      : variant === "secondary"
        ? "bg-secondary text-secondary-content"
        : variant === "transparent"
          ? "bg-base-100 text-base-content border border-neutral/20"
          : "bg-gradient-to-tr from-primary to-black stars [--star-scale:200px] text-primary-content";

  return (
    <div className="container mx-auto my-8" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-6">
          <RichText
            className="ms-0 max-w-3xl"
            data={introContent}
            enableGutter={false}
          />
        </div>
      )}
      <div className={cn("w-full")}>
        <div
          className={cn(
            "grid grid-cols-1 gap-4",
            "sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          )}
        >
          {posts?.map((post, index) => {
            if (typeof post !== "object" || post === null) return null;
            const styleVariant = styles?.[index % styles.length] ?? "primary";
            const variantClasses = getVariantClasses(styleVariant);
            const href = `/posts/${post.slug}`;
            const metaImage = post.meta?.image;
            const description = post.meta?.description;
            const title = post.title;
            const subtitle = post.subtitle;
            const sanitizedDescription = description?.replace(/\s/g, " ");

            return (
              <Link
                // 1. REMOVED `min-w-max` here. Added `min-w-0` to be safe.
                className={
                  "h-full w-full min-w-0 max-w-full hover:-translate-y-1 transition-all"
                }
                key={href}
                href={href}
              >
                <article
                  key={index}
                  className={cn(
                    variantClasses,
                    "shadow-lg rounded-lg p-4 flex h-max w-full flex-row-reverse hover:cursor-pointer"
                  )}
                >
                  <div className="relative h-46 sm:h-60 aspect-2/3 shrink-0">
                    {!metaImage && (
                      <div className="bg-base-200 rounded-lg h-full w-full flex items-center justify-center text-xs">
                        No Image
                      </div>
                    )}
                    {metaImage && typeof metaImage === "object" && (
                      <Media
                        resource={metaImage}
                        imgClassName="h-full w-full object-cover rounded-lg overflow-clip object-center shadow-xl absolute inset-0"
                        pictureClassName="h-full w-full rounded-lg overflow-clip object-center bg-base-200 shadow-lg"
                        fill
                      />
                    )}
                  </div>


                  <div className="min-w-0 flex-1 lg:pr-0 h-full text-base flex flex-col pr-4">
                    {title && (
                      <div className="w-full text-start text-base sm:text-xl font-bold no-underline ">
                        <h3>{title}</h3>
                      </div>
                    )}
                    {subtitle && (
                      <div className="w-full text-start text-base sm:text-xl no-underline ">
                        <h3>{subtitle}</h3>
                      </div>
                    )}

                    {post.eventDate && (
                      <div className="not-prose w-full text-start text-sm mb-4">
                        {new Date(post.eventDate).toLocaleDateString()}
                      </div>
                    )}

                    {description && (
                      <div className="line-clamp-7 font-light sm:line-clamp-3 md:line-clamp-5 text-xs sm:text-sm w-full text-start break-words">
                        <p>{sanitizedDescription}</p>
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
