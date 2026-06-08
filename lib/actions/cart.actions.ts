'use server'

import { CartItem } from "@/types";
import { convertToPlainObject, formatError } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema } from "../validators";

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

        if (!cart) {
            // ایجاد سبد خرید جدید
            const newCart = await prisma.cart.create({
                data: {
                    sessionCartId: sessionCartId,
                    userId: userId,
                    items: [item],
                    itemsPrice: item.price,
                    totalPrice: item.price,
                    shippingPrice: '0',
                    taxPrice: '0',
                }
            })

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
        } else {
            // به روز رسانی سبد خرید موجود
            const existingItem = (cart.items as CartItem[]).find(
                (i) => i.productId === item.productId
            )

            if (existingItem) {
                // افزایش تعداد
                existingItem.qty += item.qty
            } else {
                // اضافه کردن آیتم جدید
                (cart.items as CartItem[]).push(item)
            }

            const itemsPrice = (cart.items as CartItem[]).reduce(
                (sum, i) => sum + Number(i.price) * i.qty,
                0
            ).toString()

            const updatedCart = await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    items: cart.items,
                    itemsPrice: itemsPrice,
                    totalPrice: itemsPrice,
                }
            })

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
        }

    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

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