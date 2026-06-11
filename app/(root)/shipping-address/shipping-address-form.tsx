'use client'

import React from 'react'
import { ShippingAddress } from '@/types'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { shippingAddressSchema } from '@/lib/validators'
import { z } from 'zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { updateUserAddress } from '@/lib/actions/user.actions'
import { shippingaddressDefaultValues } from '@/lib/constants'

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof shippingAddressSchema>>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || shippingaddressDefaultValues
    })

    const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values) => {
        startTransition(async () => {
            const res = await updateUserAddress(values);

            if (!res.success) {
                toast.error(res.message)
                return
            }

            toast.success('آدرس حمل و نقل ذخیره شد')
            router.push('/payment-method')
        })
    }

    return (
        <div className='max-w-2xl mx-auto space-y-6 p-5'>
            <h1 className='h2-bold mt-4'>آدرس حمل و نقل</h1>
            <p className='text-sm text-muted-foreground'>لطفاً آدرس مورد نظر برای ارسال را وارد کنید</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <div className='flex flex-col md:flex-row gap-5'>
                        <div className='flex-1'>
                            <FormField
                                control={form.control}
                                name='fullName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>نام کامل</FormLabel>
                                        <FormControl>
                                            <Input placeholder='نام کامل خود را وارد کنید' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex-1'>
                            <FormField
                                control={form.control}
                                name='streetAddress'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>آدرس</FormLabel>
                                        <FormControl>
                                            <Input placeholder='آدرس خود را وارد کنید' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col md:flex-row gap-5'>
                        <div className='flex-1'>
                            <FormField
                                control={form.control}
                                name='city'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>شهر</FormLabel>
                                        <FormControl>
                                            <Input placeholder='شهر خود را وارد کنید' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex-1'>
                            <FormField
                                control={form.control}
                                name='postalCode'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>کد پستی</FormLabel>
                                        <FormControl>
                                            <Input placeholder='کد پستی را وارد کنید' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name='country'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>کشور</FormLabel>
                                <FormControl>
                                    <Input placeholder='کشور خود را وارد کنید' {...field} />
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
    )
}

export default ShippingAddressForm