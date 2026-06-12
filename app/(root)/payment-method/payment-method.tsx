'use client'

import React from 'react'
import { useTransition } from 'react'
import { shippingAddressSchema } from '@/lib/validators'
import { paymentMethodSchema } from '@/lib/validators'
import CheckoutSteps from '@/components/shared/checkout-steps'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DEFAULT_PAYMENT_METHOD } from '@/lib/constants'
import z from 'zod'

const PaymentMethodForm = ({ preferredPaymentMethod }: { preferredPaymentMethod: string | null }) => {
    const router = useRouter()

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof paymentMethodSchema>>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD
        }
    })
    return (
        <>
            {/* <CheckoutSteps current={2} /> */}
        </>
    )
}

export default PaymentMethodForm
