// app/api/payment/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { captureZibalPayment } from '@/lib/actions/order.actions';
import { prisma } from '@/db/prisma';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const trackId = searchParams.get('trackId');
    const success = searchParams.get('success');

    console.log('📥 Callback received:', { trackId, success });

    if (!trackId) {
        return NextResponse.redirect(new URL('/payment/result?success=false&message=Track ID missing', req.url));
    }

    // دریافت کاربر لاگین شده
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.redirect(new URL('/payment/result?success=false&message=User not authenticated', req.url));
    }

    // پیدا کردن سفارش بر اساس userId و trackId
    const order = await prisma.order.findFirst({
        where: {
            zibalTrackId: String(trackId),
            userId: userId,
        },
    });

    if (!order) {
        return NextResponse.redirect(new URL(`/payment/result?success=false&message=Order not found`, req.url));
    }

    if (success === '0') {
        return NextResponse.redirect(new URL(`/payment/result?success=false&orderId=${order.id}`, req.url));
    }

    const result = await captureZibalPayment(trackId, order.id);

    if (result.success) {
        // ✅ هدایت به صفحه نتیجه با موفقیت
        return NextResponse.redirect(new URL(`/payment/result?success=true&orderId=${order.id}`, req.url));
    } else {
        // ❌ هدایت به صفحه نتیجه با خطا
        return NextResponse.redirect(new URL(`/payment/result?success=false&orderId=${order.id}`, req.url));
    }
}