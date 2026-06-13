'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatId, formatDateTime } from '@/lib/utils';

// 💥 با any کار رو تموم کن
const OrderDetailsTable = ({ order }: { order: any }) => {
    const {
        id,
        shippingAddress,
        orderItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        isDelivered,
        isPaid,
        paidAt,
        deliveredAt
    } = order;

    return (
        <div className="max-w-4xl mx-auto p-5">
            <h1 className='py-4 text-2xl font-bold'>سفارش {formatId(id)}</h1>

            <div className="space-y-6">
                {/* روش پرداخت */}
                <Card>
                    <CardContent className='p-4'>
                        <h2 className="text-xl font-semibold pb-4">روش پرداخت</h2>
                        <p>{paymentMethod === 'Zibal' ? 'پرداخت آنلاین (زیبال)' : 'پرداخت در محل'}</p>
                        {isPaid ? (
                            <Badge variant='secondary' className='mt-2'>
                                پرداخت شده در {formatDateTime(paidAt!).dateTime}
                            </Badge>
                        ) : (
                            <Badge variant='destructive' className='mt-2'>پرداخت نشده</Badge>
                        )}
                    </CardContent>
                </Card>

                {/* آدرس ارسال */}
                <Card>
                    <CardContent className='p-4'>
                        <h2 className="text-xl font-semibold pb-4">آدرس ارسال</h2>
                        <p>{shippingAddress?.fullName}</p>
                        <p>{shippingAddress?.streetAddress}, {shippingAddress?.city} {shippingAddress?.postalCode}, {shippingAddress?.country}</p>
                        {isDelivered ? (
                            <Badge variant='secondary' className='mt-2'>
                                تحویل داده شده در {formatDateTime(deliveredAt!).dateTime}
                            </Badge>
                        ) : (
                            <Badge variant='destructive' className='mt-2'>تحویل داده نشده</Badge>
                        )}
                    </CardContent>
                </Card>

                {/* سفارشات */}
                <Card>
                    <CardContent className='p-4'>
                        <h2 className="text-xl font-semibold pb-4">سفارشات</h2>
                        <div className="overflow-x-auto">
                            <table className='w-full'>
                                <thead>
                                    <tr className='border-b'>
                                        <th className='text-right p-2'>محصول</th>
                                        <th className='text-center p-2'>تعداد</th>
                                        <th className='text-right p-2'>قیمت</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems?.map((item: any) => (
                                        <tr key={item.productId} className='border-b'>
                                            <td className='p-2'>{item.name}</td>
                                            <td className='text-center p-2'>{item.qty}</td>
                                            <td className='text-right p-2'>{Number(item.price).toLocaleString()} تومان</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* خلاصه سفارش */}
                <Card>
                    <CardContent className='p-4'>
                        <h2 className="text-xl font-semibold pb-4">خلاصه سفارش</h2>
                        <div className='space-y-2'>
                            <div className='flex justify-between'>
                                <span>قیمت محصولات:</span>
                                <span>{Number(itemsPrice).toLocaleString()} تومان</span>
                            </div>
                            <div className='flex justify-between'>
                                <span>هزینه ارسال:</span>
                                <span>{Number(shippingPrice).toLocaleString()} تومان</span>
                            </div>
                            <div className='flex justify-between'>
                                <span>مالیات:</span>
                                <span>{Number(taxPrice).toLocaleString()} تومان</span>
                            </div>
                            <div className='flex justify-between border-t pt-2 font-bold text-lg'>
                                <span>مجموع:</span>
                                <span>{Number(totalPrice).toLocaleString()} تومان</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OrderDetailsTable;