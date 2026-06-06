'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'  // signOut رو از اینجا بیار
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UserIcon } from 'lucide-react'

const UserButton = () => {
    const { data: session, status } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' })
    }

    if (status === 'loading') {
        return (
            <Button variant='ghost' className='w-8 h-8 rounded-full bg-gray-200 animate-pulse'>
            </Button>
        )
    }

    if (!session) {
        return (
            <Button asChild>
                <Link href='/sign-in'>
                    <UserIcon /> ورود به سایت
                </Link>
            </Button>
        )
    }

    const firstInitial = session?.user?.name?.charAt(0).toUpperCase() ?? 'U'

    return (
        <div className='relative inline-block text-left' ref={menuRef}>
            <Button 
                variant='ghost' 
                className='relative w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300'
                onClick={() => setIsOpen(!isOpen)}
            >
                {firstInitial}
            </Button>
            
            {isOpen && (
                <div className='absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50'>
                    <div className='py-1'>
                        <div className='px-4 py-2 text-sm text-gray-700 border-b text-right'>
                            <div className='font-medium'>{session.user?.name}</div>
                            <div className='text-xs text-gray-500'>{session.user?.email}</div>
                        </div>
                        <button 
                            onClick={handleSignOut}
                            className='w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                        >
                            خروج از حساب
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserButton