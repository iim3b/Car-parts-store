import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/** عميل Stripe - يُنشأ عند أول استخدام حتى لا يفشل البناء إن لم يُضبط المفتاح بعد */
export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY غير معرّف في متغيرات البيئة");
    stripeClient = new Stripe(key, { apiVersion: "2024-06-20" });
  }
  return stripeClient;
}
