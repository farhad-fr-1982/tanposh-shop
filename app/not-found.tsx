'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4 text-center select-none" dir="rtl">
      <div className="space-y-6 max-w-sm flex flex-col items-center">
        
        {/* لوگو یا تصویر */}
        <div className="relative w-48 h-48 animate-pulse">
          <Image
            src="/images/logo.svg"
            alt="404"
            fill
            priority
            className="object-contain opacity-80"
          />
        </div>

        {/* متن ارور */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-primary">صفحه پیدا نشد!</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            آدرسی که وارد کردید اشتباه است یا این صفحه حذف شده است.
          </p>
        </div>

        {/* دکمه بازگشت */}
        <Button asChild size="lg" className="gap-2 font-medium shadow-sm w-full sm:w-auto">
          <Link href="/">
            <Home className="size-4" />
            بازگشت به صفحه اصلی
          </Link>
        </Button>

      </div>
    </div>
  )
}