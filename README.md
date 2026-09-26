# Neon Number — Yamzz Payment Integrated

Virtual OTP marketplace with blue-dark neon UI, VirtuSIM backend, user balance, QRIS top-up, and integration with the uploaded **Yamzz Payment Gateway 3.0**.

## Environment variables

```env
VIRTUSIM_API_KEY=...
PRICE_MARKUP=500

PAYMENT_API_BASE=https://YOUR-YAMZZ-PAYMENT-DOMAIN
PAYMENT_API_KEY=YOUR_MERCHANT_API_KEY
PAYMENT_WEBHOOK_SECRET=YOUR_MERCHANT_WEBHOOK_SECRET

POSTGRES_URL=...
POSTGRES_PRISMA_URL=...
POSTGRES_URL_NON_POOLING=...
SESSION_SECRET=...
```

## Connect to Yamzz Payment Gateway

1. Deploy the uploaded Yamzz Payment Gateway first.
2. Register a merchant account there.
3. Use its merchant API key as `PAYMENT_API_KEY`.
4. In the gateway dashboard, set the webhook URL to:
   `https://YOUR-NUMBER-SITE.vercel.app/api/payment/webhook`
5. Copy the gateway merchant webhook secret into `PAYMENT_WEBHOOK_SECRET`.
6. Set `PAYMENT_API_BASE` to the deployed Yamzz Payment Gateway URL.
7. Deploy this project.
8. Create the number site's database using Vercel Postgres and set the POSTGRES variables.
9. Set `VIRTUSIM_API_KEY`.

## Payment flow

Customer logs in → Top Up → this project calls `/api/payment-create` on Yamzz Payment → QRIS payment page → gateway marks transaction paid → gateway calls `/api/payment/webhook` → balance is credited once (idempotent) → customer can buy a VirtuSIM number.

The VirtuSIM API key stays server-side.
