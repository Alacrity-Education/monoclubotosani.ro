import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'homeHero',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Home Hero',
          value: 'homeHero',
        },
        {
          label: 'Sliding Hero',
          value: 'slidingHero',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      admin: {
        condition: (_, { type } = {}) => !['homeHero', "slidingHero"].includes(type),
      },
      label: false,
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => ['homeHero'].includes(type),
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => ['homeHero'].includes(type),
      },
    },
    {
      name:"slides",
      label:"Slides",
      interfaceName: "Slides",
      type:"array",
      minRows: 1,
      maxRows: 10,
      required:true,
      admin: {
        condition: (_, { type } = {}) => ['slidingHero'].includes(type),
      },
      fields:[
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
        {
          name: 'title',
          type: 'text',

        },
        {
          name: 'subtitle',
          type: 'text',

        },
      ]
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['homeHero'].includes(type),
      },
      relationTo: 'media',
      required: false,
    },
  ],
  label: false,
}
