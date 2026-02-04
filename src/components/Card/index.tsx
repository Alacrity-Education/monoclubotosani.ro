"use client";
import { cn } from "@/utilities/ui";
import useClickableCard from "@/utilities/useClickableCard";
import Link from "next/link";
import React, { Fragment } from "react";

import type { Post } from "@/payload-types";

import { Media } from "@/components/Media";

export type CardPostData = Pick<Post, "slug" | "categories" | "meta" | "title" | "subtitle">;

export const Card: React.FC<{
  alignItems?: "center";
  className?: string;
  doc?: CardPostData;
  relationTo?: "posts";
  showCategories?: boolean;
  title?: string;
}> = (props) => {
  const { card, link } = useClickableCard({});
  const {
    className,
    doc,
    relationTo,
    showCategories,
    title: titleFromProps,
  } = props;

  const { slug, categories, meta, title } = doc || {};
  const { description, image: metaImage } = meta || {};

  const hasCategories =
    categories && Array.isArray(categories) && categories.length > 0;
  const titleToUse = titleFromProps || title;
  const sanitizedDescription = description?.replace(/\s/g, " "); // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`;

  return (
    <article
      className={cn(
        "card bg-base-200 border-neutral/10 overflow-clip rounded-lg border shadow-xl transition-all hover:-translate-y-1 hover:cursor-pointer",
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full">
        {!metaImage && <div className="">No image</div>}
        {metaImage && typeof metaImage !== "string" && (
          <Media resource={metaImage} size="33vw" />
        )}
      </div>
      <div className="card-body min-h-40">
        {showCategories && hasCategories && (
          <div className="mb-4 text-sm uppercase">
            {showCategories && hasCategories && (
              <div>
                {categories?.map((category, index) => {
                  if (typeof category === "object") {
                    const { title: titleFromCategory } = category;

                    const categoryTitle =
                      titleFromCategory || "Untitled category";

                    const isLast = index === categories.length - 1;

                    return (
                      <Fragment key={index}>
                        {categoryTitle}
                        {!isLast && <Fragment>, &nbsp;</Fragment>}
                      </Fragment>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link
                className="not-prose text-base-content"
                href={href}
                ref={link.ref}
              >
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && (
          <div className="text-base-content mt-2">
            {description && <p>{sanitizedDescription}</p>}
          </div>
        )}
      </div>
    </article>
  );
};
