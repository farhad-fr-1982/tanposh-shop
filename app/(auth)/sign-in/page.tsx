import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import CredentialsSigninForm from './credentials-signin-form';
import { redirect } from 'next/navigation'
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'ورود به سایت'
};

const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl?: string  // ✅ اضافه کردن ? برای اختیاری
  }>
}) => {
  const { callbackUrl } = await props.searchParams
  const session = await auth()

  if (session && session.user) {
    return redirect(callbackUrl || '/')
  }

  return (
    <div className='w-full max-w-xl mx-auto'>
      <Card>
        <CardHeader className='space-y-4'>
          <Link href='/' className='flex-center'>
            <Image src='/images/logo.svg' width={100} height={100} alt={`${APP_NAME} logo`} priority={true} />
          </Link>
          <CardTitle className='text-center'>ورود به سایت</CardTitle>
          <CardDescription className='text-center'>
            ورود به حساب کاربری
          </CardDescription>
          <CardContent>
            <CredentialsSigninForm callbackUrl={callbackUrl || '/'} />  {/* ✅ مقدار پیش‌فرض */}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}

export default SignInPage