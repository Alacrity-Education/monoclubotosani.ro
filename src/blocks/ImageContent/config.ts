import type { Block } from "payload";
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { link } from "@/fields/link";
import { linkGroup } from "@/fields/linkGroup";

export const ImageContentBlock: Block = {
  slug: "imageContent",
  interfaceName: "ImageContentBlock",
  labels: {
    plural: "Image Content Blocks",
    singular: "Image Content Block",
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Block Title",
    },
    // Optional grid controls for lg screens
    {
      name: "colsLg",
      type: "number",
      label: "Columns on Large Screens",
      defaultValue: 2,
      min: 1,
      max: 4,
      admin: { description: "Number of columns at lg breakpoint (1-4)" },
    },
    {
      name: "rowsLg",
      type: "number",
      label: "Rows on Large Screens",
      defaultValue: 2,
      min: 1,

      admin: { description: "Number of rows at lg breakpoint" },
    },
    {
      name: "cells",
      type: "array",
      label: "Cells",
      minRows: 1,
      maxRows: 8,
      labels: {
        plural: "Cells",
        singular: "Cell",
      },
      fields: [
        {
          name: "type",
          type: "select",
          label: "Cell Type",
          defaultValue: "text",
          options: [
            { label: "Text", value: "text" },
            { label: "Media", value: "media" },
          ],
          required: true,
        },
        {
          name: "rowSpan",
          type: "number",
          label: "Row Span (md+)",
          defaultValue: 1,
          min: 1,

          admin: { description: "How many rows this cell spans on md+ (1-2)" },
        },
        {
          name: "richText",
          type: "richText",
          label: "Text",
          admin: {
            condition: (data, siblingData) => siblingData?.type === "text",
          },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ];
            },
          }),
        },
            linkGroup({
              appearances: ["default", "secondary"],
              overrides: {
                name:"links",
                maxRows: 2,
                
              },
            }),
        {
          name: "media",
          type: "upload",
          relationTo: "media",
          label: "Media",
          admin: {
            condition: (data, siblingData) => siblingData?.type === "media",
          },
        },
      ],
    },
  ],
};
