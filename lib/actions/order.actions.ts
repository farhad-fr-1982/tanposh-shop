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

// Get order by id
export async function getOrderById(orderId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId },
            include: {
                orderItems: true,
                user: { select: { name: true, email: true } },
            }
        });

        if (!order) return { success: false, message: 'سفارش یافت نشد' };

        // تبدیل دستی داده‌ها به فرمتی که کامپوننت میخواد
        const formattedOrder = {
            id: order.id,
            userId: order.userId,
            itemsPrice: order.itemsPrice.toString(),
            shippingPrice: order.shippingPrice.toString(),
            taxPrice: order.taxPrice.toString(),
            totalPrice: order.totalPrice.toString(),
            paymentMethod: order.paymentMethod,
            isPaid: order.isPaid,
            paidAt: order.paidAt,
            isDelivered: order.isDelivered,
            deliveredAt: order.deliveredAt,
            createdAt: order.createdAt,
            shippingAddress: {
                fullName: (order.shippingAddress as any).fullName || '',
                streetAddress: (order.shippingAddress as any).streetAddress || '',
                city: (order.shippingAddress as any).city || '',
                postalCode: (order.shippingAddress as any).postalCode || '',
                country: (order.shippingAddress as any).country || '',
            },
            orderItems: order.orderItems.map((item: any) => ({
                productId: item.productId,
                name: item.name,
                slug: item.slug,
                qty: item.qty,
                image: item.image,
                price: item.price.toString(),
                orderId: item.orderId,
            })),
            user: {
                name: order.user.name,
                email: order.user.email,
            },
        };

        return { success: true, order: formattedOrder };
    } catch (error) {
        console.error("Error in getOrderById:", error);
        return { success: false, message: formatError(error) };
    }
}

// Get orders by user id
export async function getOrdersByUserId(userId: string) {
    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: userId,
            },
            include: {
                orderItems: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        
        return { success: true, orders }
        
    } catch (error) {
        return { success: false, message: formatError(error) }
    }
}

// Update order to paid
export async function updateOrderToPaid(orderId: string, paymentResult: any) {
    try {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
                paidAt: new Date(),
                paymentResult: paymentResult
            }
        })
        
        return { success: true, order }
        
    } catch (error) {
        return { success: false, message: formatError(error) }
    }
}

// Update order to delivered
export async function updateOrderToDelivered(orderId: string) {
    try {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                isDelivered: true,
                deliveredAt: new Date()
            }
        })
        
        return { success: true, order }
        
    } catch (error) {
        return { success: false, message: formatError(error) }
    }
}

