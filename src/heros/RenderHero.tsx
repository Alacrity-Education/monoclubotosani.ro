import React from 'react'

import type { Page } from '@/payload-types'

import { HomeHero } from './Home'
import {SlidingHero} from "@/heros/SlidingHero";

const heroes = {
  homeHero: HomeHero,
  slidingHero: SlidingHero
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null


  const HeroToRender = heroes[type]

  if (!HeroToRender) return null



  return <HeroToRender {...props} />
}
