import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import SignUpForm from './sign-up-form';
import { redirect } from 'next/navigation'
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'ثبت نام در سایت'
};

const SignUpPage = async (props: {
  searchParams: Promise<{
    callbackUrl?: string 
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
          <CardTitle className='text-center'>ساخت حساب کاربری</CardTitle>
          <CardDescription className='text-center'>
            لطفا اطلاعات خود را وارد کنید
          </CardDescription>
          <CardContent>
            <SignUpForm callbackUrl={callbackUrl || '/'} />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}

export default SignUpPage