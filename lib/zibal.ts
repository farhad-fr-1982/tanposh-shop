// lib/zibal.ts
const base = 'https://gateway.zibal.ir/v1';

const getMerchantId = () => {
  const merchant = process.env.ZIBAL_MERCHANT_ID;
  console.log('🔍 Merchant ID from env:', merchant); // 👈 این خط را اضافه کنید
  if (!merchant) throw new Error('ZIBAL_MERCHANT_ID is not defined');
  return merchant;
};

const getCallbackUrl = () => {
  const url = process.env.ZIBAL_CALLBACK_URL;
  if (!url) throw new Error('ZIBAL_CALLBACK_URL is not defined');
  return url;
};

export const zibal = {
  // ایجاد درخواست پرداخت (معادل createOrder PayPal)
  createOrder: async function createOrder(amount: number, description: string, customCallbackUrl?: string) {
    const merchantId = getMerchantId();
    const callbackUrl = customCallbackUrl || getCallbackUrl();

    const response = await fetch(`${base}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant: merchantId,
        amount: amount,
        callbackUrl: callbackUrl,
        description: description,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`خطا در ارتباط با درگاه Zibal: ${errorMessage}`);
    }

    const data = await response.json();

    if (data.result === 100) {
      return {
        id: data.trackId,
        trackId: data.trackId,
        status: 'CREATED',
        approvalUrl: `https://gateway.zibal.ir/start/${data.trackId}`,
      };
    } else {
      throw new Error(`خطا در درخواست پرداخت Zibal: ${data.result}`);
    }
  },

  // دریافت اطلاعات تراکنش (معادل getOrder PayPal)
  getOrder: async function getOrder(trackId: string) {
    const merchantId = getMerchantId();

    const response = await fetch(`${base}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant: merchantId,
        trackId: trackId,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`خطا در دریافت اطلاعات تراکنش Zibal: ${errorMessage}`);
    }

    const data = await response.json();

    return {
      trackId: trackId,
      status: data.result === 100 ? 'COMPLETED' : 'PENDING',
      result: data.result,
      amount: data.amount,
      cardNumber: data.cardNumber,
    };
  },

  // تایید و نهایی کردن پرداخت (معادل captureOrder PayPal)
  captureOrder: async function captureOrder(trackId: string) {
    const merchantId = getMerchantId();

    const response = await fetch(`${base}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant: merchantId,
        trackId: trackId,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`خطا در تایید پرداخت Zibal: ${errorMessage}`);
    }

    const data = await response.json();

    if (data.result === 100) {
      return {
        success: true,
        trackId: trackId,
        amount: data.amount,
        cardNumber: data.cardNumber,
      };
    }

    return {
      success: false,
      result: data.result,
      message: data.message || 'پرداخت ناموفق',
    };
  },
};

// توابع جداگانه برای استفاده ساده‌تر
export const createZibalOrder = zibal.createOrder;
export const getZibalOrder = zibal.getOrder;
export const captureZibalOrder = zibal.captureOrder;