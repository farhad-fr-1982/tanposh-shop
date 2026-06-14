'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatId, formatDateTime } from '@/lib/utils';
import { Order } from '@/types';
import { useState } from 'react';
import { createZibalOrder, captureZibalPayment } from '@/lib/actions/order.actions';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

const OrderDetailsTable = ({ order }: { order: Order }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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
    deliveredAt,
  } = order;

  // هندل کردن پرداخت زیبال
  const handleCreateZibalOrder = async () => {
    setIsLoading(true);
    const res = await createZibalOrder(id);

    if (!res.success) {
      toast.error(res.message);
      setIsLoading(false);
      return;
    }

    if (res.approvalUrl) {
      window.location.href = res.approvalUrl;
    }
  };

  // تابع کمکی برای نمایش وضعیت (مشابه PrintLoadingState)
  const renderPaymentButton = () => {
    if (isPaid) return null;

    if (paymentMethod === 'Zibal') {
      return (
        <Button onClick={handleCreateZibalOrder} disabled={isLoading} className="w-full mt-4">
          {isLoading ? <Loader className="animate-spin" /> : 'پرداخت با زیبال'}
        </Button>
      );
    }

    if (paymentMethod === 'CashOnDelivery') {
      return (
        <Button disabled className="w-full mt-4">
          پرداخت در محل
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="py-4 text-2xl font-bold">سفارش {formatId(id)}</h1>

      <div className="grid md:grid-cols-3 md:gap-5">
        {/* ستون راست */}
        <div className="md:col-span-2 space-y-4">
          {/* روش پرداخت */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold pb-4">روش پرداخت</h2>
              </div>
              <p>{paymentMethod === 'Zibal' ? 'پرداخت آنلاین (زیبال)' : 'پرداخت در محل'}</p>
              {isPaid ? (
                <Badge variant="secondary" className="mt-2">
                  پرداخت شده در {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive" className="mt-2">
                  پرداخت نشده
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* آدرس ارسال */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold pb-4">آدرس ارسال</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.streetAddress}, {shippingAddress.city}{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant="secondary" className="mt-2">
                  تحویل داده شده در {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive" className="mt-2">
                  تحویل داده نشده
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* سفارشات */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold pb-4">سفارشات</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2">محصول</th>
                      <th className="text-center p-2">تعداد</th>
                      <th className="text-right p-2">قیمت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item: any) => (
                      <tr key={item.productId} className="border-b">
                        <td className="p-2">{item.name}</td>
                        <td className="text-center p-2">{item.qty}</td>
                        <td className="text-right p-2">
                          {Number(item.price).toLocaleString()} تومان
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ستون چپ - خلاصه سفارش و دکمه پرداخت */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold pb-4">خلاصه سفارش</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>قیمت محصولات:</span>
                  <span>{Number(itemsPrice).toLocaleString()} تومان</span>
                </div>
                <div className="flex justify-between">
                  <span>هزینه ارسال:</span>
                  <span>{Number(shippingPrice).toLocaleString()} تومان</span>
                </div>
                <div className="flex justify-between">
                  <span>مالیات:</span>
                  <span>{Number(taxPrice).toLocaleString()} تومان</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold text-lg">
                  <span>مجموع:</span>
                  <span>{Number(totalPrice).toLocaleString()} تومان</span>
                </div>
              </div>

              {/* دکمه پرداخت - معادل PayPalButtons */}
              {renderPaymentButton()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsTable;