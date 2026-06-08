'use client'

import { Button } from '@/components/ui/button'
import { addItemToCart } from '@/lib/actions/cart.actions'
import { CartItem } from '@/types'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const AddToCart = ({ item }: { item: CartItem }) => {
    const router = useRouter()

    const handleAddToCart = async () => {
        const res = await addItemToCart(item)

        if (!res.success) {
            toast.error(res.message)
            return
        }
        
        toast.success(`${item.name} به سبد خرید اضافه شد`, {
            action: {
                label: "مشاهده سبد خرید",
                onClick: () => router.push('/cart')
            }
        })
    }

    return (
        <div>
            <Button className='w-full' type='button' onClick={handleAddToCart}>
               <Plus/> افزودن به سبد خرید
            </Button>
        </div>
    )
}

export default AddToCart