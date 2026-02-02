import React from "react";
import type { CardBlock as CardBlockProps } from "@/payload-types";
import { cn } from "@/utilities/ui";
import RichText from "@/components/RichText";
import { Media } from "@/components/Media";
import {CMSLink} from "@/components/Link";
import Link from "next/link";

type Variant = "primary" | "secondary" | "starry" | "white";

export const CardBlock: React.FC<CardBlockProps & { title?: string }> = ({ title, cards }) => {
  const getVariantClasses = (variant: Variant) => {
    if (variant === "primary") return "bg-primary text-primary-content";
    if (variant === "secondary") return "bg-secondary text-secondary-content";
    if (variant === "white") return "bg-transparent text-base-content";
    // starry background: gradient from primary to black with stars
    return "text-primary-content bg-linear-to-tr from-primary to-black stars";
  };

  // Match arrow color with text color per variant
  const getArrowTextClass = (variant: Variant) => {
    if (variant === "primary") return "text-primary-content";
    if (variant === "secondary") return "text-secondary-content";
    if (variant === "white") return "text-base-content";
    return "text-primary-content"; // starry
  };

  const visibleCards = (cards || []);
  // grid columns responsive setup
  const gridColsBase = "grid grid-cols-1 gap-6";
  const gridColsMd = "md:grid-cols-2";
  const gridColsLg = "lg:grid-cols-3";

  return (
    <section className={cn("container mx-auto w-full h-max py-12 px-2 md:px-3 lg:px-4")}>
      {title && (
        <h2 className={cn(
          "text-primary pb-20 text-center",
          "text-xl font-semibold",
          "md:text-3xl"
        )}>{title}</h2>
      )}
      <div className={cn(
        gridColsBase,
        gridColsMd,
        gridColsLg,
        "h-full w-full"
      )}>
        {visibleCards.map((card, i) => {
          const rawVariant = card?.variant as Variant | undefined;
          const link = card?.link;
          const variant: Variant = rawVariant ?? "primary";
          const isWhite = variant === "white";
          // row and col span support (clamped to 1-2)
          const rowSpan = Math.min(Math.max((card)?.rowSpan ?? 1, 1), 2);
          const colSpan = Math.min(Math.max((card)?.colSpan ?? 1, 1), 2);
          const sizeClasses = card.size === 'spanable'? cn(
            // apply spans from md and up
            rowSpan === 2 ? "md:row-span-2" : "md:row-span-1",
            colSpan === 2 ? "md:col-span-2 lg:col-span-2" : "md:col-span-1 lg:col-span-1",
          ) : card.size === "vertical" ? cn("aspect-2/3","w-full") : cn("h-58","aspect-3/2");



          const cardRecord = card as Record<string, unknown>;
          const href = typeof cardRecord.link === "string" ? (cardRecord.link as string) : undefined;

          // Background controls
          const bgStyle = (cardRecord.backgroundStyle as string) || "none";
          const bgMedia = cardRecord.backgroundImage as any;
          const bgOpacityPct = typeof cardRecord.backgroundOpacity === "number" ? cardRecord.backgroundOpacity : 100;
          const bgOpacity = Math.max(0, Math.min(100, bgOpacityPct)) / 100;

          const cardInner = (
            <article
              className={cn(
                "relative rounded-lg p-8 h-full w-full min-h-64 overflow-hidden",
                // apply shadow except for white variant
                !isWhite && "shadow-xl hover:shadow-2xl transition-shadow duration-300",
                getVariantClasses(variant),

              )}
            >
              {/* Background image layer */}
              {bgStyle === "image" && bgMedia && (
                <div
                  style={{ 'opacity': bgOpacity }}
                  className="absolute inset-0 z-0 select-none">
                  <Media
                    fill

                    resource={bgMedia}
                    pictureClassName={"absolute inset-0 "}
                    imgClassName="h-full w-full object-cover z-0"
                  />

                </div>
              )}

              {/* Foreground content */}
              <div className="relative z-10">
                {card?.title && (
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                )}

                {card?.description && (
                  <div className={
                    card.variant === "white" || card.variant === "secondary"?
                    "prose prose-sm text-secondary-content" :
                    "prose prose-sm text-primary-content"
                  }>

                    <RichText data={card.description} enableGutter={false} />
                  </div>
                )}
              </div>

              {/* Arrow indicator when link exists */}
              {link && card.withLink && (
                <span
                  className={cn(
                    "absolute bottom-4 right-4 inline-flex items-center justify-center",
                    getArrowTextClass(variant),
                    "text-xl",
                    // rotate -45deg (counterclockwise) to point to top-right
                    "-rotate-45",
                  )}
                  aria-hidden="true"
                >
                  &rarr;
                </span>
              )}
            </article>
          );




          return link && card.withLink ? (
            <CMSLink {...link} key={i} className={cn("block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ", sizeClasses)}>
              {cardInner}
            </CMSLink>
          ) : (
            <div className={cn(" h-full w-full",sizeClasses)} key={i}>{cardInner}</div>
          );
        })}
      </div>
    </section>
  );
};
