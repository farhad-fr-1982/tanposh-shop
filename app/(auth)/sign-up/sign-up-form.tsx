'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUpUser } from '@/lib/actions/user.actions'
import { SignUpDefaultValues } from '@/lib/constants'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormState, useFormStatus } from 'react-dom'

const SignUpForm = ({ callbackUrl }: { callbackUrl: string }) => {
    const router = useRouter()
    const [error, setError] = useState('')

    const [data, action] = useFormState(signUpUser, {
        success: false,
        message: ''
    })

    const SignUpButton = () => {
        const { pending } = useFormStatus()
        
        return (
            <Button disabled={pending} className='w-full' variant='default'>
                {pending ? 'در حال ثبت نام...' : 'ثبت نام'}
            </Button>
        )
    }

    // اگه ثبت نام موفق بود، به صفحه اصلی برو
    if (data.success) {
        router.push(callbackUrl)
        router.refresh()
    }

    return (
        <form action={action}>
            <input type='hidden' name='callbackUrl' value={callbackUrl} />
            <div className='space-y-6'>
                {!data.success && data.message && (
                    <div className='text-center text-destructive text-sm bg-red-50 p-3 rounded-md'>
                        {data.message}
                    </div>
                )}

                <div>
                    <Label htmlFor='name'>نام کامل</Label>
                    <Input 
                        id='name' 
                        name='name' 
                        type='text' 
                        required 
                        autoComplete='name' 
                        defaultValue={SignUpDefaultValues.name} 
                        className='mt-3' 
                    />
                </div>

                <div>
                    <Label htmlFor='email'>ایمیل</Label>
                    <Input 
                        id='email' 
                        name='email' 
                        type='email' 
                        required 
                        autoComplete='email' 
                        defaultValue={SignUpDefaultValues.email} 
                        className='mt-3' 
                    />
                </div>

                <div>
                    <Label htmlFor='password'>رمز عبور</Label>
                    <Input 
                        id='password' 
                        name='password' 
                        type='password' 
                        required 
                        autoComplete='new-password' 
                        defaultValue={SignUpDefaultValues.password} 
                        className='mt-3' 
                    />
                </div>

                <div>
                    <Label htmlFor='confirmPassword'>تکرار رمز عبور</Label>
                    <Input 
                        id='confirmPassword' 
                        name='confirmPassword' 
                        type='password' 
                        required 
                        autoComplete='new-password' 
                        defaultValue={SignUpDefaultValues.confirmPassword} 
                        className='mt-3' 
                    />
                </div>

                <SignUpButton />

                <div className='text-sm text-center text-muted-foreground'>
                    قبلاً ثبت نام کرده‌اید؟{' '}
                    <Link href='/sign-in' className='text-primary hover:underline'>
                        ورود به سایت
                    </Link>
                </div>
            </div>
        </form>
    )
}

export default SignUpForm