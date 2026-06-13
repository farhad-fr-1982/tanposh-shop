import { z } from 'zod'
import { PAYMENT_METHODS } from './constants';

// قیمت با دو رقم اعشار
const currency = z.string().refine(
    (value) => /^\d+(\.\d{2})?$/.test(value),
    'قیمت باید دقیقاً دو رقم اعشار داشته باشد'
)

// طرح اعتبارسنجی محصول
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
    password: z.string().min(6, 'کلمه عبور باید حداقل ۶ کاراکتر باشد'),
});

// طرح اعتبارسنجی برای ثبت نام کاربران
export const signIUpFormSchema = z.object({
    name: z.string().min(3, 'نام باید حداقل شامل 3 کاراکتر باشد'),
    email: z.string().email('آدرس ایمیل نامعتبر است'),
    password: z.string().min(6, 'کلمه عبور باید حداقل ۶ کاراکتر باشد'),
    confirmPassword: z.string().min(6, 'تکرار کلمه عبور باید حداقل ۶ کاراکتر باشد'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'کلمه عبور و تکرار کلمه عبور یکسان نمی باشند',
    path: ['confirmPassword']
});

// طرح اعتبارسنجی آیتم سبد خرید
export const cartItemSchema = z.object({
    productId: z.string().min(1, 'شناسه محصول الزامی است'),
    name: z.string().min(1, 'نام محصول الزامی است'),
    slug: z.string().min(1, 'اسلاگ محصول الزامی است'),
    qty: z.number().int().nonnegative('تعداد باید عددی مثبت باشد'),
    image: z.string().min(1, 'تصویر محصول الزامی است'),
    price: currency
});

// طرح اعتبارسنجی سبد خرید
export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'شناسه جلسه سبد خرید الزامی است'),
    userId: z.string().optional().nullable(),
});

// Schema برای آدرس حمل و نقل
export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'نام کامل باید حداقل ۳ کاراکتر باشد'),
    streetAddress: z.string().min(3, 'آدرس باید حداقل ۳ کاراکتر باشد'),
    city: z.string().min(3, 'شهر باید حداقل ۳ کاراکتر باشد'),
    postalCode: z.string().min(3, 'کد پستی باید حداقل ۳ کاراکتر باشد'),
    country: z.string().min(3, 'کشور باید حداقل ۳ کاراکتر باشد'),
    lat: z.number().optional(),
    lng: z.number().optional(),
})

// Schema برای روش پرداخت
export const paymentMethodSchema = z
    .object({
        type: z.string().min(1, 'روش پرداخت الزامی است'),
    })
    .refine((data) => PAYMENT_METHODS.includes(data.type), {
        path: ['type'],
        message: 'روش پرداخت نامعتبر است',
    });

// Schema for inserting order
export const insertOrderSchema = z.object({
    userId: z.string().min(1, 'شناسه کاربر الزامی است'),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalPrice: currency,
    paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
        message: 'روش پرداخت نامعتبر است'
    }),
    shippingAddress: shippingAddressSchema
});

// Schema for inserting an order item
export const insertOrderItemSchema = z.object({
    productId: z.string(),
    slug: z.string(),
    image: z.string(),
    name: z.string(),
    price: currency,
    qty: z.number(),
});