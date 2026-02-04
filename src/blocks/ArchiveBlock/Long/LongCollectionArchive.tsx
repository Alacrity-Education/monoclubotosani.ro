import { cn } from "@/utilities/ui";
import React from "react";

import { CardPostData } from "@/components/Card";
import { LongCard } from "./LongCard";

export type Props = {
  posts: CardPostData[];
  styles?: ("primary" | "secondary" | "starry" | "transparent")[];
};

export const LongCollectionArchive: React.FC<Props> = ({ posts, styles }) => {
  return (
    <div className={cn("relative z-10")}>
      <div className="relative">
        <div
          className={cn(
            "relative flex w-full  flex-col gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-4",
            "lg:[&>*:nth-child(n+4)]:hidden xl:[&>*:nth-child(n+4)]:flex xl:[&>*:nth-child(n+5)]:hidden"
          )}
        >
          {posts?.map((result, index) => {


            const styleVariant = styles?.[index] ?? "primary";
            return typeof result === "object" && result !== null ? (
              <LongCard
                key={index}
                variant={styleVariant}
                className="h-full w-full"
                doc={result}
                relationTo="posts"
                subtitle={result.subtitle || ""}
                showCategories
                title={undefined}
              />
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};
