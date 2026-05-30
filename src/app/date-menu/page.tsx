import type { Metadata } from 'next'
import { Great_Vibes, Cormorant_Garamond } from 'next/font/google'
import DateMenu from './DateMenu'

export const metadata: Metadata = {
  title: 'The Kitchen',
  description: 'A private dinner, prepared by hand — just for you.',
}

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-great-vibes',
})

const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
})

export default function DateMenuPage() {
  return (
    <div className={`${greatVibes.variable} ${cormorant.variable}`}>
      <DateMenu />
    </div>
  )
}
