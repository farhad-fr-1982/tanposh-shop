import React from 'react'
import { auth } from '@/auth'
import { getMyCart } from '@/lib/actions/cart.actions'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserById } from '@/lib/actions/user.actions'
import ShippingaddressForm from './shipping-address-form'
import { ShippingAddress } from '@/types'
import CheckoutSteps from '@/components/shared/checkout-steps'

export const metadata: Metadata = {
  title: 'آدرس ارسال'
}

const ShippingAddressPage = async () => {
  const cart = await getMyCart()

  if (!cart || cart.items.length === 0) redirect('/cart')

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error('کاربری یافت نشد')
  const user = await getUserById(userId)

  return (
    <div>
      <CheckoutSteps current={1}/>
      <ShippingaddressForm address={user.address as ShippingAddress}/>
    </div>
  )
}

export default ShippingAddressPage