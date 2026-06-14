'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get('success') === 'true';
  const orderId = searchParams.get('orderId');
  const message = searchParams.get('message');

  useEffect(() => {
    if (success) {
      Swal.fire({
        title: 'پرداخت موفق!',
        text: 'سفارش شما با موفقیت ثبت و پرداخت شد.',
        icon: 'success',
        confirmButtonText: 'مشاهده سفارش',
        confirmButtonColor: '#3085d6',
        background: '#fff',
        customClass: {
          popup: 'rtl-text',
        },
      }).then(() => {
        router.push(`/order/${orderId}`);
      });
    } else {
      Swal.fire({
        title: 'پرداخت ناموفق!',
        text: message || 'متأسفانه پرداخت با مشکل مواجه شد. لطفاً مجدداً تلاش کنید.',
        icon: 'error',
        confirmButtonText: 'بازگشت به سبد خرید',
        confirmButtonColor: '#d33',
        background: '#fff',
        customClass: {
          popup: 'rtl-text',
        },
      }).then(() => {
        router.push('/cart');
      });
    }
  }, [success, orderId, message, router]);

  return null;
}