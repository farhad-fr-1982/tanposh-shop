'use client'

import React from 'react'
import ModeToggle from './mode-toggle'
import { Button } from '@/components/ui/button'
import { EllipsisVertical, ShoppingCart, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const Menu = () => {
  return (
    <div className='flex justify-end gap-3'>

      {/* 💻 منوی حالت دسکتاپ (صفحات بزرگ) */}
      <nav className="hidden md:flex w-full max-w-xl gap-2 items-center">
        <ModeToggle />
        
        <Button asChild variant='ghost' className="flex items-center gap-1.5">
          <Link href='/cart'>
            <ShoppingCart className="size-5" /> سبد خرید
          </Link>
        </Button>
        
        <Button asChild className="flex items-center gap-1.5">
          <Link href='/sign-in'>
            <UserIcon className="size-5" /> ورود
          </Link>
        </Button>
      </nav>

      {/* 📱 منوی حالت موبایل (صفحات کوچک) */}
      <nav className='md:hidden flex items-center'>
        <Sheet>
          {/* دکمه سه نقطه متمایز با حالت hover */}
          <SheetTrigger className='align-middle p-2 rounded-md hover:bg-accent cursor-pointer'>
            <EllipsisVertical className="size-5" />
          </SheetTrigger>
          
          {/* تغییر ۱: اضافه شدن side="right" برای باز شدن منو از راست */}
          <SheetContent side="right" className='flex flex-col items-start gap-4 pt-10' dir="rtl">
            
            <SheetTitle className="text-right w-full font-bold text-lg border-b pb-2">
              فهرست گزینه‌ها
            </SheetTitle>
            
            {/* تنظیم تراز دکمه تغییر تم در موبایل */}
            <div className="flex items-center justify-between w-full border-b pb-3">
              <span className="text-sm text-muted-foreground">پوسته سایت</span>
              <ModeToggle />
            </div>

            {/* تغییر ۲: تمام‌عرض و مرتب کردن دکمه‌های سبد خرید و ورود در موبایل */}
            <Button asChild variant='ghost' className="w-full justify-start gap-3 text-right">
              <Link href='/cart'>
                <ShoppingCart className="size-5" /> 
                <span>سبد خرید</span>
              </Link>
            </Button>

            <Button asChild className="w-full justify-start gap-3 text-right">
              <Link href='/sign-in'>
                <UserIcon className="size-5" /> 
                <span>ورود به حساب</span>
              </Link>
            </Button>

            <SheetDescription className="hidden"></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu