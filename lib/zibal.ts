// lib/zibal.ts
const base = 'https://gateway.zibal.ir/v1';

export const zibal = {};

// درخواست پرداخت به زیبال (بدون نیاز به توکن)
async function requestPayment(amount: number, description: string) {
    const { ZIBAL_MERCHANT_ID, ZIBAL_CALLBACK_URL } = process.env;

    const response = await fetch(`${base}/request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            merchant: ZIBAL_MERCHANT_ID,
            amount: amount,
            callbackUrl: ZIBAL_CALLBACK_URL,
            description: description,
        }),
    });

    if (response.ok) {
        const jsonData = await response.json();
        if (jsonData.result === 100) {
            return { success: true, trackId: jsonData.trackId };
        } else {
            throw new Error(`خطا در درخواست پرداخت: ${jsonData.result}`);
        }
    } else {
        const errorMessage = await response.text();
        throw new Error(`خطا در ارتباط با درگاه: ${errorMessage}`);
    }
}

// تایید پرداخت
async function verifyPayment(trackId: string) {
    const { ZIBAL_MERCHANT_ID } = process.env;

    const response = await fetch(`${base}/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            merchant: ZIBAL_MERCHANT_ID,
            trackId: trackId,
        }),
    });

    if (response.ok) {
        const jsonData = await response.json();
        if (jsonData.result === 100) {
            return { success: true, message: 'پرداخت موفق', amount: jsonData.amount };
        } else {
            return { success: false, message: `پرداخت ناموفق: ${jsonData.result}` };
        }
    } else {
        const errorMessage = await response.text();
        throw new Error(`خطا در تایید پرداخت: ${errorMessage}`);
    }
}

export { requestPayment, verifyPayment };