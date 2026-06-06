'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from 'next-auth/react'
import { SignInDefaultValues } from '@/lib/constants'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const CredentialsSigninForm = ({ callbackUrl }: { callbackUrl: string }) => {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        })

        if (result?.error) {
            setError('ایمیل یا رمز عبور اشتباه است')
            setLoading(false)
        } else {
            // ✅ بررسی کن callbackUrl وجود داره یا نه
            const redirectUrl = callbackUrl || '/'
            router.push(redirectUrl)
            router.refresh()
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type='hidden' name='callbackUrl' value={callbackUrl || '/'} />
            <div className='space-y-6'>
                {error && (
                    <div className='text-center text-destructive text-sm bg-red-50 p-3 rounded-md'>
                        {error}
                    </div>
                )}

                <div>
                    <Label htmlFor='email'>ایمیل</Label>
                    <Input 
                        id='email' 
                        name='email' 
                        type='email' 
                        required 
                        autoComplete='email' 
                        defaultValue={SignInDefaultValues.email} 
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
                        autoComplete='current-password' 
                        defaultValue={SignInDefaultValues.password} 
                        className='mt-3' 
                    />
                </div>

                <Button disabled={loading} className='w-full' variant='default'>
                    {loading ? 'صبر کنید...' : 'ورود'}
                </Button>

                <div className='text-sm text-center text-muted-foreground'>
                    حساب کاربری ندارید؟{' '}
                    <Link href='/sign-up' className='text-primary hover:underline'>
                        ثبت‌نام
                    </Link>
                </div>
            </div>
        </form>
    )
}

export default CredentialsSigninForm