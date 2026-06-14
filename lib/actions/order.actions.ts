'use server';

import { isRedirectError } from 'next/dist/client/components/redirect';
import { formatError } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.actions';
import { insertOrderSchema } from '../validators';
import { prisma } from '@/db/prisma';
import { CartItem } from '@/types';
import { zibal } from '../zibal';
import { revalidatePath } from 'next/cache';

// ==================== تابع اصلی ثبت سفارش اولیه ====================
export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error('کاربر احراز هویت نشده است');

    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error('کاربری یافت نشد');

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return { success: false, message: 'سبد خرید شما خالی است', redirectTo: '/cart' };
    }

    if (!user.address) {
      return { success: false, message: 'آدرس پستی یافت نشد', redirectTo: '/shipping-address' };
    }

    if (!user.paymentMethod) {
      return { success: false, message: 'روش پرداخت انتخاب نشده است', redirectTo: '/payment-method' };
    }

    console.log('🔍 Order object before validation:', {
      userId: userId,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });
    const order = insertOrderSchema.parse({
      userId: userId,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    const insertOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({ data: order });
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: { ...item, price: item.price, orderId: insertedOrder.id },
        });
      }
      await tx.cart.update({
        where: { id: cart.id },
        data: { items: [], totalPrice: 0, taxPrice: 0, shippingPrice: 0, itemsPrice: 0 },
      });
      return insertedOrder.id;
    });

    if (!insertOrderId) throw new Error('امکان ثبت سفارش وجود ندارد');

    return { success: true, message: 'سفارش ثبت شد', redirectTo: `/order/${insertOrderId}` };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}

// ==================== دریافت سفارش با آیدی ====================
export async function getOrderById(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: { orderItems: true, user: { select: { name: true, email: true } } },
    });

    if (!order) return { success: false, message: 'سفارش یافت نشد' };

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
      user: { name: order.user.name, email: order.user.email },
    };

    return { success: true, order: formattedOrder };
  } catch (error) {
    console.error('Error in getOrderById:', error);
    return { success: false, message: formatError(error) };
  }
}

// ==================== دریافت سفارش‌های کاربر ====================
export async function getOrdersByUserId(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { orderItems: true },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, orders };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// ==================== آپدیت وضعیت سفارش (عمومی) ====================
export async function updateOrderToPaid(orderId: string, paymentResult: any) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { isPaid: true, paidAt: new Date(), paymentResult },
    });
    return { success: true, order };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateOrderToDelivered(orderId: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { isDelivered: true, deliveredAt: new Date() },
    });
    return { success: true, order };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// ==================== توابع مربوط به پرداخت زیبال ====================
async function updateOrderToPaidWithStock({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult: any;
}) {
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderItems: true },
  });

  if (!order) throw new Error('سفارش یافت نشد');
  if (order.isPaid) throw new Error('سفارش قبلاً پرداخت شده است');

  await prisma.$transaction(async (tx) => {
    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.qty } },
      });
    }
    await tx.order.update({
      where: { id: orderId },
      data: { isPaid: true, paidAt: new Date(), paymentResult },
    });
  });

  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderItems: true, user: { select: { name: true, email: true } } },
  });

  if (!updatedOrder) throw new Error('خطا در آپدیت سفارش');
  return updatedOrder;
}

export async function createZibalOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({ where: { id: orderId } });
    if (!order) throw new Error('سفارش یافت نشد');

    // تبدیل مبلغ به عدد صحیح
    let amountInTomans = Math.floor(Number(order.totalPrice));

    // 🔥 اگر مبلغ کمتر از 1000 تومان است، به 1000 تومان افزایش بده
    if (amountInTomans < 1000) {
      console.log(`⚠️ Amount ${amountInTomans} is less than 1000, setting to 1000 for testing`);
      amountInTomans = 1000;
    }

    console.log('💰 Raw amount from DB:', order.totalPrice);
    console.log('💰 Amount sent to Zibal:', amountInTomans);

    const zibalOrder = await zibal.createOrder(
      amountInTomans,
      `پرداخت سفارش شماره ${orderId}`
    );

    await prisma.order.update({
      where: { id: orderId },
      data: {
        zibalTrackId: String(zibalOrder.trackId), // ← تبدیل به String
        paymentResult: {
          trackId: String(zibalOrder.trackId),    // ← تبدیل به String
          result: 0,
          amount: amountInTomans,
          status: 'PENDING',
          paymentMethod: 'Zibal',
        },
      },
    });

    return {
      success: true,
      message: 'سفارش با موفقیت ایجاد شد',
      data: zibalOrder.trackId,
      approvalUrl: zibalOrder.approvalUrl,
    };
  } catch (error) {
    console.error('Error in createZibalOrder:', error);
    return { success: false, message: formatError(error) };
  }
}

export async function captureZibalPayment(trackId: string, orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!order) throw new Error('سفارش یافت نشد');

    const savedTrackId = (order.paymentResult as any)?.trackId;
    if (savedTrackId !== trackId) throw new Error('اطلاعات پرداخت مطابقت ندارد');

    const captureResult = await zibal.captureOrder(trackId);
    if (!captureResult.success) throw new Error(captureResult.message || 'پرداخت ناموفق بود');

    const updatedOrder = await updateOrderToPaidWithStock({
      orderId,
      paymentResult: {
        trackId,
        result: 100,
        amount: captureResult.amount,
        cardNumber: captureResult.cardNumber,
        status: 'COMPLETED',
        paymentMethod: 'Zibal',
      },
    });

    revalidatePath(`/order/${orderId}`);
    return { success: true, message: 'پرداخت با موفقیت انجام شد', order: updatedOrder };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getZibalPaymentStatus(orderId: string) {
  try {
    const order = await prisma.order.findFirst({ where: { id: orderId } });
    if (!order) throw new Error('سفارش یافت نشد');

    const paymentResult = order.paymentResult as any;
    return {
      success: true,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      trackId: paymentResult?.trackId,
      status: paymentResult?.status,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}