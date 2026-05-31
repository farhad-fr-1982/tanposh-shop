'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoonIcon, SunIcon, SunMoon } from 'lucide-react'
import { useTheme } from 'next-themes'
import React, { useState, useEffect } from 'react'

const ModeToggle = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        // برای پروژه‌های تماماً فارسی شادسی‌ان جدید، حتماً dir="rtl" بذارید
        <DropdownMenu dir="rtl">
            <DropdownMenuTrigger>
                <div className='flex items-center justify-center p-2 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer'>
                    {theme === 'system' ? (<SunMoon />) : theme === 'dark' ? (<MoonIcon />) : (<SunIcon />)}
                </div>
            </DropdownMenuTrigger>
            
            {/* با کلاس z-[99999] لایه منو رو بالا آوردیم، align="start" در حالت RTL یعنی چسبیدن به راست */}
            <DropdownMenuContent align="start" className="w-44 z-[99999] bg-popover text-popover-foreground border shadow-md">
                <DropdownMenuLabel className="w-full text-right font-bold">
                    تغییر پوسته
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* با کلاس flex-row-reverse نوشته رو می‌فرستیم سمت راست بدون اینکه تیک شادسی‌ان خراب بشه */}
                <DropdownMenuCheckboxItem 
                    checked={theme === 'system'} 
                    onClick={() => setTheme('system')} 
                    className="cursor-pointer flex flex-row-reverse justify-end gap-2 w-full"
                >
                    بر اساس سیستم
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuCheckboxItem 
                    checked={theme === 'dark'} 
                    onClick={() => setTheme('dark')} 
                    className="cursor-pointer flex flex-row-reverse justify-end gap-2 w-full"
                >
                   تیره
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuCheckboxItem 
                    checked={theme === 'light'} 
                    onClick={() => setTheme('light')} 
                    className="cursor-pointer flex flex-row-reverse justify-end gap-2 w-full"
                >
                   روشن
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ModeToggle