"use client"

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CartButtonProps {
  cartCount: number
}

const CartButton = ({ cartCount }: CartButtonProps) => {
  return (
    <Link href="/gio-hang" className="relative">
      <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-accent-foreground">
        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Button>
    </Link>
  )
}

export default CartButton 