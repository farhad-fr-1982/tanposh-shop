import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'
import { ShoppingCart, UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ModeToggle from './mode-toggle'
import Menu from './menu'

const Header = () => {
    return (
        <header className='w-full border-b'>
            <div className="wrapper flex-between">
                <div className="flext-start">
                    <Link href="/" className="flex-start">
                        <Image
                            src="/images/logo.svg"
                            alt={`${APP_NAME} logo`}
                            width={48}
                            height={48}
                            priority={true}
                        />
                        <span className='hidden font-bold text-2xl ml-3'>
                            {APP_NAME}
                        </span>
                    </Link>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                    <Menu/>
                </div>
            </div>
        </header>
    )
}

export default Header