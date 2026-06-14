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
        return new NextResponse('Track ID missing', { status: 400 });
    }

    // دریافت کاربر لاگین شده
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return new NextResponse('User not authenticated', { status: 401 });
    }

    // پیدا کردن سفارش بر اساس userId و trackId ذخیره شده در paymentResult
    const order = await prisma.order.findFirst({
        where: {
            zibalTrackId: String(trackId),
            userId: userId,
            paymentResult: {
                path: ['trackId'],
                equals: trackId,
            },
        },
    });

    if (!order) {
        console.error('❌ Order not found for trackId:', trackId);
        return new NextResponse('Order not found', { status: 404 });
    }

    if (success === '0') {
        return NextResponse.redirect(new URL(`/order/${order.id}?payment=failed`, req.url));
    }

    const result = await captureZibalPayment(trackId, order.id);

    if (result.success) {
        return NextResponse.redirect(new URL(`/order/${order.id}`, req.url));
    } else {
        return NextResponse.redirect(new URL(`/order/${order.id}?payment=failed`, req.url));
    }
}