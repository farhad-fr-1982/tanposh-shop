'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const orderId = searchParams.get('orderId');

  return (
    <div className='max-w-md mx-auto p-5 text-center'>
      <h1 className='text-2xl font-bold mb-4'>
        {success ? '✅ پرداخت موفق' : '❌ پرداخت ناموفق'}
      </h1>
      <p className='mb-6'>
        {success 
          ? 'سفارش شما با موفقیت ثبت و پرداخت شد.' 
          : 'متأسفانه پرداخت با مشکل مواجه شد.'}
      </p>
      <Button asChild>
        <Link href={success ? `/order/${orderId}` : '/cart'}>
          {success ? 'مشاهده سفارش' : 'بازگشت به سبد خرید'}
        </Link>
      </Button>
    </div>
  );
}