'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInWithCredentials } from '@/lib/actions/user.actions'
import { SignInDefaultValues } from '@/lib/constants'
import Link from 'next/link'
import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'

const CredentialsSigninForm = ({ callbackUrl }: { callbackUrl: string }) => {
  const [data, action] = useFormState(signInWithCredentials, {
    success: false,
    message: ''
  })

  const SignInButton = () => {
    const { pending } = useFormStatus()
    
    return (
      <Button disabled={pending} className='w-full' variant='default'>
        {pending ? 'صبر کنید...' : 'ورود'}
      </Button>
    )
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

        <SignInButton />

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