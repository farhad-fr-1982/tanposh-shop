// tests/zibal.test.ts
import { zibal } from '../lib/zibal';

describe('Zibal Payment', () => {
  // تست ایجاد درخواست پرداخت (معادل تست PayPal)
  test('creates a zibal order', async () => {
    const amount = 10000; // 10,000 تومان
    const description = 'پرداخت تست';

    const orderResponse = await zibal.createOrder(amount, description);
    
    console.log(orderResponse);
    
    // بررسی مقادیر برگشتی
    expect(orderResponse).toHaveProperty('id');
    expect(orderResponse).toHaveProperty('trackId');
    expect(orderResponse).toHaveProperty('approvalUrl');
    expect(orderResponse.status).toBe('CREATED');
    expect(orderResponse.trackId.length).toBeGreaterThan(0);
  });

  // تست تایید پرداخت
  test('captures a zibal order', async () => {
    // توجه: این تست فقط با یک trackId واقعی کار می‌کند
    const trackId = '123456789'; // از تست قبلی دریافت کنید
    
    const captureResponse = await zibal.captureOrder(trackId);
    
    console.log(captureResponse);
    expect(captureResponse).toHaveProperty('success');
  });
});