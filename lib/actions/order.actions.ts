'use server'

import { isRedirectError } from "next/dist/client/components/redirect"
import { formatError } from "../utils"
import { auth } from "@/auth"
import { getMyCart } from "./cart.actions"
import { getUserById } from "./user.actions"
import { insertOrderSchema } from "../validators"
import { prisma } from "@/db/prisma"
import { CartItem } from "@/types"

//*Create order and create the order items 
export async function createOrder() {
    try {
        const session = await auth()
        if (!session) throw new Error('کاربر احراز هویت نشده است')
        
        const cart = await getMyCart()
        const userId = session?.user?.id
        if (!userId) throw new Error('کاربری یافت نشد')

        const user = await getUserById(userId)

        if (!cart || cart.items.length === 0) {
            return { success: false, message: 'سبد خرید شما خالی است', redirectTo: '/cart' }
        }

        // ✅ اصلاح: اگر آدرس وجود نداشت
        if (!user.address) {
            return { success: false, message: 'آدرس پستی یافت نشد', redirectTo: '/shipping-address' }
        }

        if (!user.paymentMethod) {
            return { success: false, message: 'روش پرداخت انتخاب نشده است', redirectTo: '/payment-method' }
        }

        // Create order object
        const order = insertOrderSchema.parse({
            userId: userId,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });

        //*Transaction
        const insertOrderId = await prisma.$transaction(async (tx) => {
            //*Create order
            const insertedOrder = await tx.order.create({ data: order })

            for (const item of cart.items as CartItem[]) {
                await tx.orderItem.create({
                    data: {
                        ...item,
                        price: item.price,
                        orderId: insertedOrder.id
                    }
                })
            }
            await tx.cart.update({
                where: { id: cart.id },
                data: {
                    items: [],
                    totalPrice: 0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    itemsPrice: 0
                }
            })
            return insertedOrder.id
        })
        
        if (!insertOrderId) throw new Error('امکان ثبت سفارش وجود ندارد')
        
        return { success: true, message: 'سفارش ثبت شد', redirectTo: `/order/${insertOrderId}` }
        
    } catch (error) {
        if (isRedirectError(error)) throw error
        return { success: false, message: formatError(error) }
    }
}