import { APP_NAME } from '@/lib/constants'
import React from 'react'

const Footer = () => {
  const currentYearShamsi = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date())

  return (
    <footer className='border-t'>
      <div className="p-5 flex-center" dir="rtl">
        {currentYearShamsi} {APP_NAME}. تمام حقوق این سایت محفوظ است.
      </div>
    </footer>
  )
}

export default Footer