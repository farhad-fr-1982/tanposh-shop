import { email, z } from 'zod'

const currency = z.string().refine(
    (value) => /^\d+(\.\d{2})?$/.test(value),
    'قیمت باید دقیقاً دو رقم اعشار داشته باشد'
)

export const insertProductSchema = z.object({
    name: z.string().min(3, 'نام باید حداقل ۳ کاراکتر باشد'),
    slug: z.string().min(3, 'اسلاگ باید حداقل ۳ کاراکتر باشد'),
    category: z.string().min(3, 'دسته‌بندی باید حداقل ۳ کاراکتر باشد'),
    brand: z.string().min(3, 'برند باید حداقل ۳ کاراکتر باشد'),
    description: z.string().min(3, 'توضیحات باید حداقل ۳ کاراکتر باشد'),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, 'محصول باید حداقل یک تصویر داشته باشد'),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency
});


// طرح اعتبارسنجی برای ورود کاربران
export const signInFormSchema = z.object({
  email: z.string().email('آدرس ایمیل نامعتبر است'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
});