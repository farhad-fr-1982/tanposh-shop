'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { createOrder } from '@/lib/actions/order.actions'

const PlaceOrderForm = () => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handlePlaceOrder = () => {
    console.log("1️⃣ دکمه کلیک شد")
    
    startTransition(async () => {
        console.log("2️⃣ داخل startTransition")
        const res = await createOrder()
        console.log("3️⃣ نتیجه از createOrder:", res)
        
        if (!res.success) {
            console.log("4️⃣ خطا:", res.message)
            toast.error(res.message)
            return
        }
        
        console.log("5️⃣ موفقیت، ریدایرکت به:", res.redirectTo)
        toast.success('سفارش با موفقیت ثبت شد')
        if (res.redirectTo) {
            router.push(res.redirectTo)
        }
    })
}
    return (
        <Button 
            className='w-full mt-4' 
            onClick={handlePlaceOrder}
            disabled={isPending}
        >
            {isPending ? 'در حال ثبت سفارش...' : 'ثبت سفارش و پرداخت'}
        </Button>
    )
}

export default PlaceOrderForm