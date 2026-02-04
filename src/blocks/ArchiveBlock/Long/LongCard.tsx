"use client";
import { cn } from "@/utilities/ui";
import useClickableCard from "@/utilities/useClickableCard";
import Link from "next/link";
import React from "react";

import type { Post } from "@/payload-types";

import { Media } from "@/components/Media";

export type CardPostData = Pick<Post, "slug" | "categories" | "meta" | "title">;

export const LongCard: React.FC<{
  alignItems?: "center";
  className?: string;
  doc?: CardPostData;
  relationTo?: "posts";
  showCategories?: boolean;
  title?: string;
  variant?: "primary" | "secondary" | "starry" | "transparent";
}> = (props) => {
  const { card, link } = useClickableCard({});
  const {
    className,
    doc,
    relationTo,
    title: titleFromProps,
    variant = "primary",
  } = props;

  // @ts-ignore
  const { slug, meta, title, eventDate, subtitle } = doc ;
  const { description, image: metaImage } = meta || {};

  const titleToUse = titleFromProps || title;
  const sanitizedDescription = description?.replace(/\s/g, " ");
  const href = `/${relationTo}/${slug}`;

  const variantClasses =
    variant === "primary"
      ? "bg-primary text-primary-content"
      : variant === "secondary"
      ? "bg-secondary  text-secondary-content"
      : variant === "transparent"
      ? "bg-base-100 text-base-content border border-neutral/20 "
      : "bg-gradient-to-tr from-primary to-black stars [--star-scale:200px]  text-primary-content "; // starry fallback; decorative stars can be added later

  return (
    <article
      className={cn(
        variantClasses,
        // Ensure the article itself takes full height on desktop
        "lg:border-primary shadow-lg rounded-lg p-4 flex h-52 w-full flex-row-reverse  hover:cursor-pointer lg:h-auto lg:w-max lg:flex-col-reverse lg:justify-end lg:gap-4 lg:p-6",
        className,
      )}
      ref={card.ref}
    >
      <button className="btn-primary btn btn-sm hidden lg:inline-block">
        Citeste mai mult &rarr;
      </button>
      <div className="relative h-60 w-60 lg:h-100 lg:w-66 xl:h-100">
        {!metaImage && <div className="">No image</div>}
        {metaImage && typeof metaImage !== "string" && (
          <Media
            resource={metaImage}
            imgClassName="h-full w-full object-cover rounded-lg overflow-clip object-center shadow-xl absolute inset-0"
            pictureClassName="h-full w-full rounded-lg overflow-clip object-center bg-base-200 shadow-lg "
            fill
          />
        )}
      </div>
      <div className=" lg:pr-0 max-w-full w-full h-52  md:grow text-base lg:h-52 lg:w-66 lg:max-w-full lg:flex lg:flex-col lg:items-center ">
        {titleToUse && (
              <Link
                className=" w-40 lg:w-full lg:h-28 text-start text-base sm:text-xl font-bold no-underline lg:text-2xl lg:leading-normal"
                href={href}
                ref={link.ref}
              >
                <h3>
                {titleToUse}
                </h3>
                {subtitle && (
                  <div className="w-full text-start text-base sm:text-xl mb-2 sm:mb-0 no-underline">
                    <h3>{subtitle}</h3>
                  </div>
                )}
              </Link>
        )}

        {eventDate && <div className="not-prose w-40 lg:w-full text-start text-sm sm:text-sm  mb-4 lg:mb-2 lg:text-lg">

          Data: {new Date(eventDate).toLocaleDateString()}
        </div>}
        {description && (
          <div className="line-clamp-7 font-light sm:line-clamp-2 md:line-clamp-4 lg:line-clamp-2 text-xs sm:text-sm lg:text-sm w-40 lg:w-full text-start">
            {description && <p>{sanitizedDescription}</p>}
          </div>
        )}
      </div>
    </article>
  );
};

