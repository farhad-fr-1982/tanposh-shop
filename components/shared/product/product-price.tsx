import { cn } from '@/lib/utils'
import React from 'react'

const ProductPrice = ({ value, className }: { value: number; className?: string }) => {
    // سه رقم سه رقم جدا کردن عدد و تبدیل به فرمت خوانای فارسی
    const formattedValue = Math.round(value).toLocaleString('fa-IR')

    return (
        <div dir="rtl">
            <p className={cn('text-2xl font-bold flex items-baseline gap-1', className)}>
                {/* مقدار اصلی عدد */}
                <span>{formattedValue}</span>
                {/* واحد پولی کوچک‌تر در کنار عدد */}
                <span className='text-xs text-muted-foreground font-normal'>تومان</span>
            </p>
        </div>
    )
}

export default ProductPrice