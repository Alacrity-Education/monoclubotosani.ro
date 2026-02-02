import type { Block } from "payload";

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import { linkGroup } from "../../fields/linkGroup";

export const CallToAction: Block = {
  slug: "cta",
  interfaceName: "CallToActionBlock",
  fields: [
    {
      name: "title",
      type: "text",
      label: "Block Title",
    },
    {
      name: "richText",
      type: "richText",
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
      label: false,
    },
    {
      name: "variant",
      type: "select",
      options: [
        { label: "Regular", value: "primary" },
        { label: "Starry", value: "starry" },
        { label: "Background", value: "background" },
        { label: "Secondary", value: "secondary" },
      ],
    },
    {
      name: "media",
      type: "upload",
      relationTo: "media",
      admin: {
        condition: (data, sibling) => {
          return sibling.variant === "background";
        },
      },
    },
    {
      name: "ctaType",
      type: "select",
      label: "CTA Type",
      defaultValue: "links",
      options: [
        { label: "Links", value: "links" },
        { label: "Modal", value: "modal" },
      ],
    },
    {
      name: "modalButtonText",
      type: "text",
      label: "Modal Button Text",
      admin: {
        condition: (_, sibling) => sibling?.ctaType === "modal",
      },
    },
    {
      name: "form",
      type: "relationship",
      relationTo: "forms",
      label: "Form to render",
      admin: {
        condition: (_, sibling) => sibling?.ctaType === "modal",
      },
    },
    linkGroup({
      appearances: ["outline","secondary","default"],
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, sibling) => sibling?.ctaType !== "modal",
        },
      },
    }),
  ],
  labels: {
    plural: "Calls to Action",
    singular: "Call to Action",
  },
};
