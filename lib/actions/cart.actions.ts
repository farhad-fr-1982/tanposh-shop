'use server'

import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema } from "../validators";
import { revalidatePath } from "next/cache";

// محاسبه قیمت‌های سبد خرید
const calcPrice = (items: CartItem[]) => {
    const itemsPrice = items.reduce(
        (acc, item) => acc + Number(item.price) * item.qty, 
        0
    )
    
    const roundedItemsPrice = round2(itemsPrice)
    const shippingPrice = round2(roundedItemsPrice > 100 ? 0 : 100)
    const taxPrice = round2(roundedItemsPrice * 0.09)
    const totalPrice = round2(roundedItemsPrice + shippingPrice + taxPrice)
    
    return {
        itemsPrice: roundedItemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    }
}

// دریافت سبد خرید کاربر
export async function getMyCart() {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value
        if (!sessionCartId) {
            return undefined
        }
        
        const session = await auth()
        const userId = session?.user?.id ? (session.user.id as string) : undefined

        const cart = await prisma.cart.findFirst({
            where: userId ? { userId: userId } : { sessionCartId: sessionCartId }
        })

        if (!cart) {
            return undefined
        }

        return convertToPlainObject({
            ...cart,
            items: cart.items as CartItem[],
            itemsPrice: cart.itemsPrice.toString(),
            totalPrice: cart.totalPrice.toString(),
            shippingPrice: cart.shippingPrice.toString(),
            taxPrice: cart.taxPrice.toString(),
        })
        
    } catch (error) {
        return undefined
    }
}

// اضافه کردن آیتم به سبد خرید
export async function addItemToCart(data: CartItem) {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value
        if (!sessionCartId) {
            throw new Error('سبد خرید یافت نشد')
        }
        
        const session = await auth()
        const userId = session?.user?.id ? (session.user.id as string) : undefined

        const cart = await getMyCart()
        const item = cartItemSchema.parse(data)

        const product = await prisma.product.findFirst({
            where: { id: item.productId }
        })

        if (!product) {
            throw new Error('محصول یافت نشد')
        }

        // اگر سبد خرید وجود نداشت، یکی بساز
        if (!cart) {
            const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice([item])
            
            const newCart = await prisma.cart.create({
                data: {
                    userId: userId,
                    sessionCartId: sessionCartId,
                    items: [item],
                    itemsPrice: itemsPrice,
                    totalPrice: totalPrice,
                    shippingPrice: shippingPrice,
                    taxPrice: taxPrice,
                }
            })

            revalidatePath(`/product/${product.slug}`)

            return {
                success: true,
                message: 'محصول به سبد خرید اضافه شد',
                cart: convertToPlainObject({
                    ...newCart,
                    items: newCart.items as CartItem[],
                    itemsPrice: newCart.itemsPrice.toString(),
                    totalPrice: newCart.totalPrice.toString(),
                    shippingPrice: newCart.shippingPrice.toString(),
                    taxPrice: newCart.taxPrice.toString(),
                })
            }
        } 
        
        // اگر سبد خرید وجود داشت، بروزرسانی کن
        const cartItems = [...(cart.items as CartItem[])]
        const existingItemIndex = cartItems.findIndex(
            (i) => i.productId === item.productId
        )

        if (existingItemIndex > -1) {
            // اگر محصول موجود بود، تعداد رو زیاد کن
            cartItems[existingItemIndex].qty += item.qty
        } else {
            // اگر محصول موجود نبود، اضافه کن
            cartItems.push(item)
        }

        const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(cartItems)

        const updatedCart = await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: cartItems,
                itemsPrice: itemsPrice,
                totalPrice: totalPrice,
                shippingPrice: shippingPrice,
                taxPrice: taxPrice,
            }
        })

        revalidatePath(`/product/${product.slug}`)

        return {
            success: true,
            message: 'محصول به سبد خرید اضافه شد',
            cart: convertToPlainObject({
                ...updatedCart,
                items: updatedCart.items as CartItem[],
                itemsPrice: updatedCart.itemsPrice.toString(),
                totalPrice: updatedCart.totalPrice.toString(),
                shippingPrice: updatedCart.shippingPrice.toString(),
                taxPrice: updatedCart.taxPrice.toString(),
            })
        }

    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

// حذف آیتم از سبد خرید
export async function removeItemFromCart(productId: string) {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value
        if (!sessionCartId) {
            throw new Error('سبد خرید یافت نشد')
        }

        const cart = await getMyCart()
        if (!cart) {
            throw new Error('سبد خرید یافت نشد')
        }

        const cartItems = (cart.items as CartItem[]).filter(
            (item) => item.productId !== productId
        )

        const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(cartItems)

        const updatedCart = await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: cartItems,
                itemsPrice: itemsPrice,
                totalPrice: totalPrice,
                shippingPrice: shippingPrice,
                taxPrice: taxPrice,
            }
        })

        revalidatePath('/cart')

        return {
            success: true,
            message: 'محصول از سبد خرید حذف شد',
            cart: convertToPlainObject({
                ...updatedCart,
                items: updatedCart.items as CartItem[],
                itemsPrice: updatedCart.itemsPrice.toString(),
                totalPrice: updatedCart.totalPrice.toString(),
                shippingPrice: updatedCart.shippingPrice.toString(),
                taxPrice: updatedCart.taxPrice.toString(),
            })
        }

    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}