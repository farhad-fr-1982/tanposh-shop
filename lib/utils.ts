import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

// فرمت کردن خطاها
export function formatError(error: any): string {
  if (error?.name === 'ZodError') {
    try {
      const errors = error.errors?.map((err: any) => err.message) || []
      if (errors.length > 0) {
        return errors.join(' - ')
      }
    } catch {
      // اگه خطا خورد، برگردون پیام پیش‌فرض
    }
    return 'اطلاعات وارد شده صحیح نیست'
  }

  if (error?.code === 'P2002') {
    return 'این ایمیل قبلاً ثبت شده است'
  }

  return error?.message || 'خطایی رخ داده است'
}

// گرد کردن اعداد به دو رقم اعشار
export function round2(value: number | string): number {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100
  } else {
    return 0
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price) + ' تومان'
}

// فرمت قیمت با استفاده از فرمت‌کننده بالا
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return new Intl.NumberFormat('fa-IR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' تومان'
  } else if (typeof amount === 'string') {
    return new Intl.NumberFormat('fa-IR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(amount)) + ' تومان'
  } else {
    return '۰ تومان'
  }
}