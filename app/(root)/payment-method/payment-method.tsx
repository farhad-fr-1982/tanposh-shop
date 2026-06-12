'use client'

import React, { useState } from 'react'
import { useTransition } from 'react'
import { paymentMethodSchema } from '@/lib/validators'
import CheckoutSteps from '@/components/shared/checkout-steps'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { updateUserPaymentMethod } from '@/lib/actions/user.actions'
import { toast } from 'sonner'

const PaymentMethodForm = ({ preferredPaymentMethod }: { preferredPaymentMethod: string | null }) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [selectedMethod, setSelectedMethod] = useState(preferredPaymentMethod || DEFAULT_PAYMENT_METHOD)

    const form = useForm<z.infer<typeof paymentMethodSchema>>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD
        }
    })

    const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
        startTransition(async () => {
            const res = await updateUserPaymentMethod(values)
            
            if (!res.success) {
                toast.error(res.message)
                return
            }
            
            toast.success('روش پرداخت ذخیره شد')
            router.push('/place-order')
        })
    }

    return (
        <>
            <CheckoutSteps current={2} />
            <div className='max-w-md mx-auto space-y-6 p-5'>
                <h1 className='h2-bold mt-4'>روش پرداخت</h1>
                <p className='text-sm text-muted-foreground'>لطفاً روش پرداخت خود را انتخاب کنید</p>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='type'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>روش پرداخت</FormLabel>
                                    <FormControl>
                                        <div className='space-y-3'>
                                            {PAYMENT_METHODS.map((method) => (
                                                <div 
                                                    key={method} 
                                                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                                                        field.value === method 
                                                            ? 'border-primary bg-primary/5' 
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                    onClick={() => field.onChange(method)}
                                                >
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                        field.value === method 
                                                            ? 'border-primary' 
                                                            : 'border-gray-400'
                                                    }`}>
                                                        {field.value === method && (
                                                            <div className='w-2 h-2 rounded-full bg-primary' />
                                                        )}
                                                    </div>
                                                    <label className='text-sm cursor-pointer flex-1'>
                                                        {method === 'Zibal' ? 'پرداخت آنلاین (زیبال)' : 
                                                         method === 'CashOnDelivery' ? 'پرداخت در محل' : method}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Button type='submit' disabled={isPending} className='w-full'>
                            {isPending ? 'در حال ذخیره...' : 'ادامه'}
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default PaymentMethodForm