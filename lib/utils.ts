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