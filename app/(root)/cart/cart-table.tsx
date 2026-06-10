'use client'

import React from 'react'
import { Cart } from '@/types'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useTransition } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { removeItemFromCart, updateCartItemQty } from '@/lib/actions/cart.actions'
import { ArrowLeft, ArrowRight, Loader, Minus, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

const CartTable = ({ cart }: { cart?: Cart }) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    // تابع حذف کامل آیتم
    const handleRemoveItem = (productId: string, name: string) => {
        startTransition(async () => {
            const res = await removeItemFromCart(productId)
            if (!res.success) {
                toast.error(res.message)
                return
            }
            toast.success(`${name} از سبد خرید حذف شد`)
        })
    }

    // تابع کاهش تعداد
    const handleDecreaseQty = (item: CartItem) => {
        if (item.qty <= 1) {
            handleRemoveItem(item.productId, item.name)
        } else {
            startTransition(async () => {
                const res = await updateCartItemQty(item.productId, item.qty - 1)
                if (!res.success) {
                    toast.error(res.message)
                }
            })
        }
    }

    // تابع افزایش تعداد
    const handleIncreaseQty = (item: CartItem) => {
        startTransition(async () => {
            const res = await updateCartItemQty(item.productId, item.qty + 1)
            if (!res.success) {
                toast.error(res.message)
            }
        })
    }

    return (
        <div>
            <h1 className='py-4 h2-bold'>سبد خرید</h1>
            {!cart || cart.items.length === 0 ? (
                <div>
                    سبد خرید شما خالی است. <Link href='/'>خرید کردن</Link>
                </div>
            ) : (
                <div className='grid md:grid-cols-4 md:gap-5'>
                    <div className='overflow-x-auto md:col-span-3'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>محصول</TableHead>
                                    <TableHead className='text-center'>تعداد</TableHead>
                                    <TableHead className='text-right'>قیمت</TableHead>
                                    <TableHead className='text-center'>عملیات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.items.map((item) => (
                                    <TableRow key={item.productId}>
                                        <TableCell>
                                            <Link href={`/product/${item.slug}`} className='flex items-center'>
                                                <Image src={item.image} alt={item.name} width={50} height={50} />
                                                <span className='px-2'>{item.name}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            <div className='flex items-center justify-center gap-2'>
                                                <Button
                                                    disabled={isPending}
                                                    variant='outline'
                                                    size='icon'
                                                    onClick={() => handleDecreaseQty(item)}
                                                >
                                                    <Minus className='h-3 w-3' />
                                                </Button>
                                                <span className='w-8 text-center'>{item.qty}</span>
                                                <Button
                                                    disabled={isPending}
                                                    variant='outline'
                                                    size='icon'
                                                    onClick={() => handleIncreaseQty(item)}
                                                >
                                                    <Plus className='h-3 w-3' />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className='text-right font-medium'>
                                            {Number(item.price).toLocaleString()} تومان
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            <Button
                                                disabled={isPending}
                                                variant='destructive'
                                                size='icon'
                                                onClick={() => handleRemoveItem(item.productId, item.name)}
                                            >
                                                <Trash2 className='h-4 w-4' />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <Card>
                        <CardContent className='p-4 gap-4'>
                            <div className="pb-3 text-xl">
                                مجموع ({cart.items.reduce((a, c) => a + c.qty, 0)}) :
                                <span className='font-bold'>{formatCurrency(cart.itemsPrice)}</span>
                            </div>
                            <Button className='w-full' disabled={isPending} onClick={() => startTransition(() => router.push('/shipping-address'))}>
                                {isPending ? (
                                    <Loader className='w-4 h-4 animate-spin' />
                                ) : (
                                    <ArrowLeft className='w-4 h-4' />
                                )} {' '} تکمیل خرید
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default CartTable