import type { Post, ArchiveBlock as ArchiveBlockProps } from "@/payload-types";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import React from "react";
import RichText from "@/components/RichText";
import { cn } from "@/utilities/ui";
import { CMSLink } from "@/components/Link";

export const ListArchiveBlock: React.FC<
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
  } = props;

  const limit = limitFromProps || 10;

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
    <div className="container mx-auto my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-8">
          <RichText
            className="ms-0 max-w-3xl"
            data={introContent}
            enableGutter={false}
          />
        </div>
      )}
      <ul className={cn(
        "divide-y divide-border rounded-lg border border-border bg-card text-base-content",
        "sm:p-2 md:p-4"
      )}>
        {posts.map((post, i) => (
          <li key={i} className={cn(
            "flex flex-col gap-2 p-3 text-base-content",
            "sm:flex-row sm:items-center sm:justify-between"
          )}>
            <div className="min-w-0">
              <CMSLink url={typeof post === 'object' ? `/posts/${post.slug}` : '#'} className="line-clamp-2 font-medium hover:text-primary">
                {typeof post === 'object' ? post.title : ''}
              </CMSLink>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 text-xs">
              {typeof post === 'object' && Array.isArray(post.categories) && post.categories.map((cat, idx) => (
                <span key={idx} className="rounded-full border border-border px-2 py-0.5">{typeof cat === 'object' ? cat.title : ''}</span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
