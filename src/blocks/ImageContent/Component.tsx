import React from "react";
import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import { cn } from "@/utilities/ui";
import { ImageContentBlock  as ImageContentBlockProps} from "@/payload-types";
import { link } from "fs";
import { CMSLink } from "@/components/Link";

type Cell = {
  type: 'text' | 'media';
  rowSpan?: number; // numeric row span
  richText?: unknown;
  links:any[]
  media?: unknown;
};

type Props = {
  title?: string;
  cells?: Cell[];
  colsLg?: number; // dynamic lg columns
  rowsLg?: number; // dynamic lg rows
  disableInnerContainer?: boolean;
};

export const ImageContentBlock: React.FC<ImageContentBlockProps> = (props) => {
  const { title, cells, colsLg = 2, rowsLg = 2 } = props || {};

  if (!cells || !Array.isArray(cells) || cells.length === 0) return null;


  return (
    <div className="w-full">
      {title && (
        <h2 className="text-primary py-10 text-center text-base font-semibold md:text-3xl">{title}</h2>
      )}
      <div className={cn("container mx-auto")}>
        <div
          className={cn(
            "grid gap-4 lg:gap-12",
            "grid-cols-1", // Default for mobile/tablet
            "lg:grid-cols-[var(--cols-lg)] lg:grid-rows-[var(--rows-lg)] lg:h-full lg:grid-flow-row" // Only use variables at lg+
          )}
          style={{
            "--cols-lg": `repeat(${colsLg}, minmax(0, 1fr))`,
            "--rows-lg": `repeat(${rowsLg}, minmax(0, 1fr))`
          } as React.CSSProperties}
        >
          {cells.map((cell, i) => {
            const spanRows = Math.max(1,  cell.rowSpan || 1);

            const common = cn("rounded-lg h-full w-full" );

            if (cell.type === "media" && cell.media) {
              return (
                <div style={{ gridRow: `span ${spanRows} / span ${spanRows}` }} key={i} className={cn(common,"h-full w-full flex items-start")}>
                  <Media resource={cell.media as any} imgClassName="rounded-lg object-cover min-h-[40vh] h-full w-full md:mt-8" pictureClassName={"w-full min-h-[40vh] h-full  "} />
                </div>
              );
            }

            if (cell.type === "text" && cell.richText) {
    
              const links = cell.links
              return (
                <div style={{ gridRow: `span ${spanRows} / span ${spanRows}` }} key={i} className={cn(common, "p-4  border rounded-lg flex flex-col")}>
                  <RichText data={cell.richText as any} enableGutter={false} className={"text-start m-0!"} />
                  <div className={"grow"}></div>
                  {links && (
                    <div className="mt-6 flex w-full flex-row gap-2 justify-end">
                {(links || []).map(({ link }, i) => {
                                return <CMSLink key={i} size="lg" {...link} className={"btn btn-primary"} />;
                              })}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
};
