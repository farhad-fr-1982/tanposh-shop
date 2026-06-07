import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

//*Format Error
export function formatError(error: any): string {
  // خطای Zod
  if (error?.name === 'ZodError') {
    try {
      // روش استاندارد برای گرفتن خطاهای Zod
      const errors = error.errors?.map((err: any) => err.message) || []
      if (errors.length > 0) {
        return errors.join(' - ')
      }
    } catch {
      // اگه خطا خورد، برگردون پیام پیش‌فرض
    }
    return 'اطلاعات وارد شده صحیح نیست'
  }
  
  // خطای Prisma (تکراری بودن ایمیل)
  if (error?.code === 'P2002') {
    return 'این ایمیل قبلاً ثبت شده است'
  }
  
  // خطای عادی
  return error?.message || 'خطایی رخ داده است'
}