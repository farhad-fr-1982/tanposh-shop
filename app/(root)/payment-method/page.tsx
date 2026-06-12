import React from 'react'
import { Metadata } from 'next'
import { auth } from '@/auth'
import { getUserById } from '@/lib/actions/user.actions'
import PaymentMethodForm from './payment-method'

export const metadata: Metadata = {
    title: 'انتخاب روش پرداخت'
}

const PaymentMethodePage = async () => {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) throw new Error('کاربری یافت نشد')

    const user = await getUserById(userId)
    return (
        <>
            <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
        </>
    )
}

export default PaymentMethodePage