# مستودع القطع — متجر إلكتروني لقطع غيار السيارات

تطبيق ويب كامل (Full Stack) جاهز للإطلاق كنسخة أولى (MVP) قابلة للتوسّع، مبني بـ **Next.js 14 + TypeScript + PostgreSQL + Prisma + Tailwind CSS**، مع دفع إلكتروني عبر **Stripe**.

---

## ✨ أبرز الميزات

- تصفّح المنتجات حسب **القسم**، **السعر**، و**توافق السيارة** (الشركة المصنّعة + الموديل + سنة الصنع) — الميزة الجوهرية لأي متجر قطع غيار.
- أداة تفاعلية في الصفحة الرئيسية لاختيار السيارة وعرض القطع المتوافقة معها فقط.
- سلة مشتريات وحساب مستخدم وسجل طلبات.
- دفع إلكتروني آمن عبر Stripe Checkout + Webhook لتأكيد الدفع تلقائيًا وخصم المخزون.
- لوحة تحكم للمشرف: إحصائيات، إدارة المنتجات (مع صور متعددة وتوافقات سيارات)، إدارة الأقسام، وإدارة الطلبات وحالاتها.
- تصميم عربي (RTL) بالكامل، بخط Cairo، وألوان هادئة وواضحة.
- اختبارات آلية (Vitest) للدوال الحساسة (الأسعار، التحقق من المدخلات، المصادقة).

---

## 🧱 التقنيات المستخدمة

| الطبقة | التقنية |
|---|---|
| الواجهة الأمامية والخلفية | Next.js 14 (App Router) + TypeScript |
| قاعدة البيانات | PostgreSQL |
| ORM | Prisma |
| التصميم | Tailwind CSS |
| المصادقة | جلسات JWT عبر كوكيز httpOnly (jose + bcryptjs) — بدون مكتبة خارجية |
| الدفع الإلكتروني | Stripe Checkout + Webhooks |
| إدارة الحالة (السلة) | Zustand |
| التحقق من المدخلات | Zod |
| الاختبارات | Vitest |

---

## 📁 هيكل المشروع

```
car-parts-store/
├── prisma/
│   ├── schema.prisma        # تصميم قاعدة البيانات الكامل
│   └── seed.ts               # بيانات تجريبية (أقسام، منتجات، مستخدمين)
├── src/
│   ├── app/
│   │   ├── (المتجر)          # الرئيسية، المنتجات، الأقسام، السلة، الدفع
│   │   ├── account/           # حساب المستخدم وطلباته
│   │   ├── admin/             # لوحة تحكم المشرف
│   │   └── api/                # كل نقاط API (انظر الجدول أدناه)
│   ├── components/            # مكوّنات الواجهة القابلة لإعادة الاستخدام
│   ├── lib/                    # المصادقة، Prisma، Stripe، التحقق، الأدوات
│   ├── middleware.ts           # حماية مسارات /admin و /account
│   └── types/                  # أنواع TypeScript مشتركة
└── tests/                       # اختبارات Vitest
```

---

## 🔌 نقاط API الرئيسية

| المسار | الطريقة | الوصف | الصلاحية |
|---|---|---|---|
| `/api/auth/register` | POST | إنشاء حساب جديد | عام |
| `/api/auth/login` | POST | تسجيل الدخول | عام |
| `/api/auth/logout` | POST | تسجيل الخروج | مسجّل دخول |
| `/api/auth/me` | GET | بيانات المستخدم الحالي | عام |
| `/api/categories` | GET / POST | عرض الأقسام / إنشاء قسم | عام / مشرف |
| `/api/categories/[id]` | GET / PUT / DELETE | تفاصيل/تعديل/حذف قسم | عام / مشرف |
| `/api/products` | GET / POST | بحث وفلترة المنتجات / إنشاء منتج | عام / مشرف |
| `/api/products/[id]` | GET / PUT / DELETE | تفاصيل/تعديل/حذف منتج | عام / مشرف |
| `/api/car-compatibility/options` | GET | قائمة الشركات والموديلات المتاحة | عام |
| `/api/cart` | GET / POST | عرض السلة / إضافة منتج | مسجّل دخول |
| `/api/cart/[itemId]` | PUT / DELETE | تعديل الكمية / حذف من السلة | مسجّل دخول |
| `/api/checkout` | POST | إنشاء الطلب وجلسة دفع Stripe | مسجّل دخول |
| `/api/webhooks/stripe` | POST | تأكيد الدفع تلقائيًا من Stripe | Stripe فقط |
| `/api/orders` | GET | طلبات المستخدم الحالي | مسجّل دخول |
| `/api/orders/[id]` | GET | تفاصيل طلب واحد | صاحب الطلب / مشرف |
| `/api/admin/orders` | GET | كل الطلبات | مشرف |
| `/api/admin/orders/[id]` | PUT | تحديث حالة الطلب | مشرف |
| `/api/admin/stats` | GET | إحصائيات لوحة التحكم | مشرف |

كل الاستجابات بصيغة موحّدة: `{ success: true, data }` أو `{ success: false, error }`.

---

## 🚀 التشغيل محليًا

### 1. المتطلبات
- Node.js ≥ 18
- قاعدة بيانات PostgreSQL (محليًا عبر Docker، أو خدمة سحابية مجانية مثل [Neon](https://neon.tech) أو [Supabase](https://supabase.com))
- حساب [Stripe](https://stripe.com) (وضع الاختبار/Test mode كافٍ للتجربة)

### 2. التثبيت
```bash
npm install
```

### 3. متغيرات البيئة
انسخ ملف `.env.example` إلى `.env` واملأ القيم:
```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://user:password@localhost:5432/car_parts_store?schema=public"
JWT_SECRET="أنشئ قيمة عشوائية طويلة، مثال: openssl rand -base64 32"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

> لا تحتاج فعليًا إلى `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` في هذه النسخة لأن الدفع يتم عبر Stripe Checkout المُستضاف من Stripe مباشرة (لا حاجة لـ Stripe.js في الواجهة)، لكنها متروكة جاهزة لأي توسعة مستقبلية (مثل Payment Element المدمج).

### 4. تجهيز قاعدة البيانات
```bash
npx prisma generate     # توليد Prisma Client
npx prisma migrate dev --name init   # إنشاء الجداول
npm run db:seed          # تعبئة بيانات تجريبية (أقسام + 16 منتج + مستخدمين)
```

**حسابات تجريبية بعد التعبئة:**
| الدور | البريد الإلكتروني | كلمة المرور |
|---|---|---|
| مشرف | `admin@example.com` | `Admin@12345` |
| عميل | `customer@example.com` | `Customer@12345` |

### 5. تشغيل السيرفر
```bash
npm run dev
```
افتح `http://localhost:3000`، ولوحة التحكم عبر `http://localhost:3000/admin` (بعد الدخول بحساب المشرف).

### 6. اختبار الدفع محليًا (Stripe Webhook)
Stripe يحتاج إلى الوصول لعنوان الـ Webhook، ومحليًا يتم ذلك عبر [Stripe CLI](https://stripe.com/docs/stripe-cli):
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
انسخ الـ `whsec_...` الذي يظهر وضَعه في `STRIPE_WEBHOOK_SECRET`. لإتمام عملية شراء تجريبية استخدم رقم البطاقة `4242 4242 4242 4242` وأي تاريخ مستقبلي وأي CVC.

---

## 🧪 الاختبارات
```bash
npm test          # تشغيل كل الاختبارات مرة واحدة
npm run test:watch
```
تغطّي الاختبارات: تنسيق الأسعار، حساب رسوم الشحن، توليد أرقام الطلبات، مخططات التحقق من المدخلات (Zod)، وتشفير/تحقق كلمات المرور وجلسات JWT.

---

## ☁️ النشر (اقتراح)
1. **قاعدة البيانات**: أنشئ قاعدة PostgreSQL مُدارة (Neon / Supabase / Railway) وضع رابطها في `DATABASE_URL`.
2. **الاستضافة**: ادفع المشروع لمستودع GitHub ثم اربطه بـ [Vercel](https://vercel.com) — يكتشف Next.js تلقائيًا.
3. أضف كل متغيرات `.env` في إعدادات المشروع على Vercel.
4. بعد أول نشر، شغّل الترحيل والتعبئة على قاعدة الإنتاج:
   ```bash
   npx prisma migrate deploy
   npm run db:seed   # اختياري، أو أضف بياناتك الحقيقية عبر لوحة التحكم
   ```
5. في لوحة Stripe، أضف Webhook حقيقي يشير إلى `https://your-domain.com/api/webhooks/stripe` وحدّث `STRIPE_WEBHOOK_SECRET` بالقيمة الجديدة.

---

## 🗺️ أفكار للتوسّع لاحقًا
- رفع صور المنتجات مباشرة (بدل روابط خارجية) عبر S3 أو Cloudinary.
- الدفع عند الاستلام (COD) كخيار إضافي بجانب الدفع الإلكتروني.
- تعدد اللغات (عربي/إنجليزي) عبر `next-intl`.
- تقييمات ومراجعات العملاء للمنتجات.
- إشعارات بريد إلكتروني/رسائل نصية عند تغيّر حالة الطلب.
- في حال استهداف السوق السعودي حصرًا: بوابات دفع محلية مثل Moyasar أو Tap أو HyperPay قد تكون أنسب من Stripe (تحقق من توفر Stripe لحسابك التجاري في بلدك).
- دعم عناوين شحن متعددة محفوظة لكل عميل (حاليًا العنوان يُدخل عند كل عملية شراء).

---

## ⚠️ ملاحظات مهمة قبل الإنتاج الفعلي
- غيّر `JWT_SECRET` إلى قيمة عشوائية قوية وقم بحفظها بسرية تامة.
- فعّل HTTPS (يتم تلقائيًا على Vercel) — الكوكي يصبح `secure` تلقائيًا في وضع الإنتاج.
- راجع حدود Stripe الخاصة بمنطقتك وعملة `SAR` قبل الاعتماد الكامل عليها في الإنتاج.
- أضف نسخًا احتياطية دورية لقاعدة البيانات.
