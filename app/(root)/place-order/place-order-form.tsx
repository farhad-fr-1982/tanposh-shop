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
        startTransition(async () => {
            const res = await createOrder()
            
            if (!res.success) {
                toast.error(res.message)
                return
            }
            
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