'use client'

import { Button } from '@/components/ui/button'
import { addItemToCart, removeItemFromCart, updateCartItemQty } from '@/lib/actions/cart.actions'
import { Cart, CartItem } from '@/types'
import { Plus, Minus, Loader, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import { useTransition } from 'react'

const AddToCart = ({ cart, item }: { cart?: Cart, item: CartItem }) => {
    const router = useRouter()

    const [isAddPending, startAddTransition] = useTransition()
    const [isRemovePending, startRemoveTransition] = useTransition()
    const [isDecreasePending, startDecreaseTransition] = useTransition()

    const handleAddToCart = () => {
        startAddTransition(async () => {
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
        })
    }

    //* افزایش تعداد
    const handleIncrease = () => {
        startAddTransition(async () => {
            const res = await addItemToCart(item)
            if (!res.success) {
                toast.error(res.message)
            }
        })
    }

    //* کاهش تعداد (دونه دونه)
    const handleDecrease = () => {
        startDecreaseTransition(async () => {
            const existItem = cart?.items.find((x) => x.productId === item.productId)
            const newQty = (existItem?.qty || 1) - 1
            
            if (newQty < 1) {
                // اگه تعداد به صفر رسید، محصول رو حذف کن
                const res = await removeItemFromCart(item.productId)
                if (!res.success) {
                    toast.error(res.message)
                } else {
                    toast.success(`${item.name} از سبد خرید حذف شد`)
                }
            } else {
                const res = await updateCartItemQty(item.productId, newQty)
                if (!res.success) {
                    toast.error(res.message)
                }
            }
        })
    }

    //* حذف کامل محصول
    const handleRemoveComplete = () => {
        startRemoveTransition(async () => {
            const res = await removeItemFromCart(item.productId)
            if (!res.success) {
                toast.error(res.message)
                return
            }
            toast.success(`${item.name} از سبد خرید حذف شد`)
        })
    }

    //*Check if item is in cart
    const existItem = cart && cart.items.find((x) => x.productId === item.productId)
    
    return existItem ? (
        <div className='flex items-center gap-2'>
            <Button 
                type='button' 
                variant='outline' 
                size='icon'
                onClick={handleDecrease}
                disabled={isDecreasePending}
            >
                {isDecreasePending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                ) : (
                    <Minus className='h-4 w-4' />
                )}
            </Button>
            <span className="w-8 text-center font-medium">{existItem.qty}</span>
            <Button 
                type='button' 
                variant='outline' 
                size='icon'
                onClick={handleIncrease}
                disabled={isAddPending}
            >
                {isAddPending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                ) : (
                    <Plus className='h-4 w-4' />
                )}
            </Button>
            <Button 
                type='button' 
                variant='destructive' 
                size='icon'
                onClick={handleRemoveComplete}
                disabled={isRemovePending}
            >
                {isRemovePending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                ) : (
                    <Trash2 className='h-4 w-4' />
                )}
            </Button>
        </div>
    ) : (
        <Button 
            className='w-full' 
            type='button' 
            onClick={handleAddToCart}
            disabled={isAddPending}
        >
            {isAddPending ? (
                <Loader className='w-4 h-4 animate-spin ml-2' />
            ) : (
                <Plus className='h-4 w-4 ml-2' />
            )} 
            افزودن به سبد خرید
        </Button>
    )
}

export default AddToCart