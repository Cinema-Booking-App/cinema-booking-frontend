"use client"

import { Phone, Globe } from 'lucide-react'
import Link from 'next/link'

interface TopBarProps {
  languages: string[]
}

const TopBar = ({ languages }: TopBarProps) => {
  return (
    <div className="bg-primary text-primary-foreground py-2">
      <div className="container mx-auto px-4 flex justify-between items-center text-xs sm:text-sm">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-accent-foreground" />
            <span className="hidden sm:inline">Hotline: 1900 1234</span>
            <span className="sm:hidden">1900 1234</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-accent-foreground" />
            <select className="bg-transparent border-none outline-none text-xs sm:text-sm">
              {languages.map((lang) => (
                <option className='bg-black' key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 lg:gap-4">
          <Link href="/ho-tro" className="hover:text-accent-foreground transition-colors text-xs sm:text-sm">Hỗ trợ</Link>
          <Link href="/lien-he" className="hover:text-accent-foreground transition-colors text-xs sm:text-sm">Liên hệ</Link>
        </div>
      </div>
    </div>
  )
}

export default TopBar 