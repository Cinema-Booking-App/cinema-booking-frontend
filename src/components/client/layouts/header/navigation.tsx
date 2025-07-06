"use client"

import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
}

interface NavigationProps {
  items: NavigationItem[]
  isMobile?: boolean
  onItemClick?: () => void
}

const Navigation = ({ items, isMobile = false, onItemClick }: NavigationProps) => {
  if (isMobile) {
    return (
      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors text-sm"
            onClick={onItemClick}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </nav>
    )
  }

  return (
    <nav className="hidden xl:flex items-center gap-4 lg:gap-6">
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground transition-colors font-medium text-sm lg:text-base"
        >
          <item.icon className="w-4 h-4" />
          <span className="hidden 2xl:inline">{item.name}</span>
        </Link>
      ))}
    </nav>
  )
}

export default Navigation 