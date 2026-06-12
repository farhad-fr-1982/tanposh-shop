import React from 'react'
import { Metadata } from 'next'
import { getMyCart } from '@/lib/actions/cart.actions'
import { auth } from '@/auth'
import { getUserById } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { ShippingAddress } from '@/types'
import CheckoutSteps from '@/components/shared/checkout-steps'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
    title: 'ثبت سفارش'
}

const PlaceOrderPage = async () => {
    const cart = await getMyCart()
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) throw new Error('کاربری یافت نشد')

    const user = await getUserById(userId)

    if (!cart || cart.items.length === 0) redirect('/cart')

    if (!user.address) redirect('/shipping-address')

    if (!user.paymentMethod) redirect('/payment-method')

    const userAddress = user.address as ShippingAddress
    const paymentMethod = user.paymentMethod

    return (
        <>
            <CheckoutSteps current={3} />
            <div className='max-w-6xl mx-auto p-5'>
                <div className='grid md:grid-cols-3 md:gap-5'>
                    {/* ستون سمت راست - اطلاعات اصلی */}
                    <div className='md:col-span-2 overflow-x-auto space-y-4'>
                        
                        {/* آدرس ارسال */}
                        <Card>
                            <CardContent className='p-4'>
                                <div className='flex justify-between items-center'>
                                    <h2 className='text-xl pb-4'>آدرس ارسال</h2>
                                    <Button variant='outline' size='sm' asChild>
                                        <a href='/shipping-address'>ویرایش</a>
                                    </Button>
                                </div>
                                <div className='space-y-1'>
                                    <p>{userAddress.fullName}</p>
                                    <p>{userAddress.streetAddress}</p>
                                    <p>{userAddress.city}, {userAddress.postalCode}</p>
                                    <p>{userAddress.country}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* روش پرداخت */}
                        <Card>
                            <CardContent className='p-4'>
                                <div className='flex justify-between items-center'>
                                    <h2 className='text-xl pb-4'>روش پرداخت</h2>
                                    <Button variant='outline' size='sm' asChild>
                                        <a href='/payment-method'>ویرایش</a>
                                    </Button>
                                </div>
                                <p>{paymentMethod === 'Zibal' ? 'پرداخت آنلاین (زیبال)' : 'پرداخت در محل'}</p>
                            </CardContent>
                        </Card>

                        {/* سفارشات */}
                        <Card>
                            <CardContent className='p-4'>
                                <h2 className='text-xl pb-4'>سفارشات</h2>
                                <table className='w-full'>
                                    <thead>
                                        <tr className='border-b'>
                                            <th className='text-right p-2'>محصول</th>
                                            <th className='text-center p-2'>تعداد</th>
                                            <th className='text-right p-2'>قیمت</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart?.items.map((item) => (
                                            <tr key={item.productId} className='border-b'>
                                                <td className='p-2'>{item.name}</td>
                                                <td className='text-center p-2'>{item.qty}</td>
                                                <td className='text-right p-2'>{Number(item.price).toLocaleString()} تومان</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ستون چپ - خلاصه سفارش */}
                    <div className='md:col-span-1'>
                        <Card>
                            <CardContent className='p-4'>
                                <h2 className='text-xl pb-4'>خلاصه سفارش</h2>
                                <div className='space-y-2'>
                                    <div className='flex justify-between'>
                                        <span>قیمت محصولات:</span>
                                        <span>{Number(cart?.itemsPrice).toLocaleString()} تومان</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>هزینه ارسال:</span>
                                        <span>{Number(cart?.shippingPrice).toLocaleString()} تومان</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>مالیات:</span>
                                        <span>{Number(cart?.taxPrice).toLocaleString()} تومان</span>
                                    </div>
                                    <div className='flex justify-between border-t pt-2 font-bold'>
                                        <span>مجموع:</span>
                                        <span>{Number(cart?.totalPrice).toLocaleString()} تومان</span>
                                    </div>
                                </div>
                                <Button className='w-full mt-4'>
                                    ثبت سفارش و پرداخت
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PlaceOrderPage