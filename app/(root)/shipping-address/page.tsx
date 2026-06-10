import React from 'react'
import { auth } from '@/auth'
import { getMyCart } from '@/lib/actions/cart.actions'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserById } from '@/lib/actions/user.actions'

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
    <div>ShippingAddressPage</div>
  )
}

export default ShippingAddressPage