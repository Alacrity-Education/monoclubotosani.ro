import type { Block } from "payload";
import {FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor} from "@payloadcms/richtext-lexical";
import { link } from '@/fields/link'
export const CardBlock: Block = {
  slug: "cardBlock",
  interfaceName: "CardBlock",
  labels: {
    singular: "Card Block",
    plural: "Card Blocks",
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Block Title",
    },
    {
      name: "cards",
      type: "array",
      label: "Cards",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "description",
          type: "richText",
          label: "Description",
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
        },
        {
          name:"size",
          type:"select",
          required: true,
          defaultValue: "spanable",
          options:[
            { label: "Spanable (grid-like)", value: "spanable" },
            { label: "Vertical", value: "vertical" },
            { label: "Horizontal", value: "horizontal" },
          ]
        },
        {
          name: "variant",
          type: "select",
          required: true,
          defaultValue: "primary",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Starry", value: "starry" },
            { label: "White", value: "white" },
          ],
        },
        {
          name: "colSpan",
          type: "number",
          label: "Column Span (md+)",
          defaultValue: 1,
          admin: { step: 1, description: "1 or 2 columns (on md and larger)",  condition: (_, sibling) => sibling?.size === "spanable", },
          min: 1,
          max: 2,
        },
        {
          name: "rowSpan",
          type: "number",
          label: "Row Span (md)",
          defaultValue: 1,
          admin: { step: 1, description: "1 or 2 rows (on lg screens)", condition: (_, sibling) => sibling?.size === "spanable",  },
          min: 1,
          max: 2,
        },
        {
          name: "withLink",
          type: "checkbox",
          label: "Enable Link",
          defaultValue: false,
          admin: {
            description: "Enable to add a link to the card",
          },

        },
        link({ appearances: false, overrides:{
            required:false,
            // Skip validation when link is disabled
            validate: (_val:any, { siblingData }) => {
              // siblingData here refers to the card-level data
              if (!(siblingData as Partial<any>)?.withLink) return true;
              return true;
            },
          admin:
            {
              condition: (data, siblingData) => siblingData?.withLink === true,
            }
          }
        })
       ,
        // Background image toggle and media
        {
          name: "backgroundStyle",
          type: "select",
          label: "Background",
          defaultValue: "none",
          options: [
            { label: "None", value: "none" },
            { label: "Image (PNG)", value: "image" },
          ],
        },
        {
          name: "backgroundImage",
          type: "upload",
          relationTo: "media",
          label: "Background Image (PNG)",
          admin: {
            description: "Shown as an object-cover background when enabled",
            condition: (data, siblingData) => siblingData?.backgroundStyle === "image",
          },
        },
        {
          name: "backgroundOpacity",
          type: "number",
          label: "Background Overlay Opacity (%)",
          defaultValue: 10,
          min: 0,
          max: 100,
          admin: {
            description: "Controls the darkness overlay over the background image",
            step: 1,
            condition: (data, siblingData) => siblingData?.backgroundStyle === "image",
          },
        },
      ],
    },
  ],
};
