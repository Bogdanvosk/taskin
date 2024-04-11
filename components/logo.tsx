import localFont from 'next/font/local'
import Image from 'next/image'
import Link from 'next/link'

import { logoImage } from '@/constants/images'
import { cn } from '@/lib/utils'

const headingFont = localFont({
  src: '../public/fonts/font.woff2'
})

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image
          priority={true}
          src={logoImage}
          alt="logo"
          width={32}
          height={32}
        />
        <p className={cn('text-lg text-neutral-700', headingFont.className)}>
          Taskin
        </p>
      </div>
    </Link>
  )
}
