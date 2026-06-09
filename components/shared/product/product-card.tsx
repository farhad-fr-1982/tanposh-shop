import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ProductPrice from './product-price'
import { Product } from '@/types'

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <Card className='w-full max-w-full'>
            <CardHeader className='p-0 items-center'>
                <Link href={`/product/${product.slug}`}>  {/* ✅ اصلاح 1 */}
                    <Image src={product.images[0]} alt={product.name} height={300} width={300} priority={true} />
                </Link>
            </CardHeader>
            <CardContent className='p-4 grid gap-4'>
                <div className='text-xs'>{product.brand}</div>
                <Link href={`/product/${product.slug}`}>  {/* ✅ اصلاح 2 */}
                    <h2 className="text-sm font-medium">{product.name}</h2>
                </Link>
                <div className='flex justify-between gap-4'>  {/* ✅ اصلاح 3: flex-between تبدیل به flex justify-between */}
                    <p>{product.rating} ستاره</p>
                    {product.stock > 0 ? (
                        <ProductPrice value={Number(product.price)} className='text-red-500'/>
                    ) : (
                        <div className='text-destructive'>ناموجود</div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default ProductCard