import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getProductBySlug } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import ProductPrice from '@/components/shared/product/product-price';
import ProductImages from '@/components/shared/header/product-images';
import AddToCart from '@/components/shared/product/add-to-cart';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getMyCart } from '@/lib/actions/cart.actions';

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);

  console.log("Slug از مرورگر:", slug, "محصول پیدا شده در دیتابیس:", product);
  if (!product) notFound();

  const cart = await getMyCart()

  return (
    <>
      {/* دکمه بازگشت به صفحه اصلی */}
      <div className='p-5 pb-0' dir='rtl'>
        <Button asChild variant='outline' className='mb-4'>
          <Link href='/'>
            <ArrowRight className='w-4 h-4 ml-2' />
            بازگشت به صفحه اصلی
          </Link>
        </Button>
      </div>

      <section className='p-5 pt-0' dir='rtl'>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-6'>

          {/* ستون اول: تصاویر محصول (اشغال ۲ ستون از ۵ ستون) */}
          <div className='col-span-1 md:col-span-2'>
            <Card className='overflow-hidden border-slate-100 shadow-sm'>
              <CardContent className='p-4 flex items-center justify-center min-h-[300px] bg-slate-50/50'>
                <div className='text-sm text-slate-400'>
                  <ProductImages images={product.images} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ستون دوم: مشخصات متنی محصول (اشغال ۲ ستون از ۵ ستون) */}
          <div className='col-span-1 md:col-span-2 flex flex-col gap-3 p-2'>
            <p className='text-xs font-semibold text-slate-400 tracking-wider'>{product.brand}</p>
            <h1 className='text-2xl font-bold text-slate-800 mb-2'>{product.name}</h1>

            <div className='flex items-center gap-3 border-y border-slate-100 py-3 my-2'>
              <span className='text-sm text-slate-500'>قیمت محصول:</span>
              <ProductPrice
                value={Number(product.price)}
                className='text-xl font-bold text-slate-900'
              />
            </div>

            <div className='mt-2'>
              <h3 className='text-sm font-semibold text-slate-700 mb-1'>توضیحات محصول</h3>
              <p className='text-sm text-slate-600 leading-relaxed'>{product.description}</p>
            </div>
          </div>

          {/* ستون سوم: باکس وضعیت خرید و انبار (اشغال ۱ ستون از ۵ ستون) */}
          <div className='col-span-1'>
            <Card className='border-slate-100 shadow-sm sticky top-5'>
              <CardContent className='p-4 space-y-4'>

                {/* وضعیت موجودی */}
                <div className='flex justify-between items-center text-sm'>
                  <div className='font-medium text-slate-600'>وضعیت انبار</div>
                  {product.stock > 0 ? (
                    <Badge variant='outline' className='text-emerald-600 border-emerald-600/30 bg-emerald-50/50 font-medium px-2.5 py-0.5'>
                      موجود در انبار
                    </Badge>
                  ) : (
                    <Badge variant='destructive' className='font-medium px-2.5 py-0.5'>
                      ناموجود
                    </Badge>
                  )}
                </div>

                {/* دکمه افزودن به سبد خرید */}
                {product.stock > 0 && (
                  <div className='pt-2'>
                    <AddToCart 
                    cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        qty: 1,
                        image: product.images![0]
                      }}
                    />
                  </div>
                )}

              </CardContent>
            </Card>
          </div>

        </div>
      </section>
    </>
  );
};

export default ProductDetailsPage;