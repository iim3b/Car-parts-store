import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function placeholderImage(text: string) {
  return `https://placehold.co/800x800/f5ead0/151310?text=${encodeURIComponent(text)}`;
}

async function main() {
  console.log("🧹 حذف البيانات القديمة...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.carCompatibility.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 إنشاء المستخدمين...");
  const adminPasswordHash = await bcrypt.hash("Admin@12345", 10);
  const customerPasswordHash = await bcrypt.hash("Customer@12345", 10);

  const admin = await prisma.user.create({
    data: {
      name: "مدير المتجر",
      email: "admin@example.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "عميل تجريبي",
      email: "customer@example.com",
      phone: "0501234567",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
    },
  });

  await prisma.cart.create({ data: { userId: admin.id } });
  await prisma.cart.create({ data: { userId: customer.id } });

  console.log("📂 إنشاء الأقسام...");
  const categoriesData = [
    { name: "قطع المحرك", slug: "engine-parts", description: "فلاتر، بواجي، طقم توقيت وقطع المحرك الأساسية" },
    { name: "نظام الفرامل", slug: "brakes", description: "تيل فرامل، أقراص، خراطيم وزيوت الفرامل" },
    { name: "نظام التعليق", slug: "suspension", description: "مساعدين، كمبروسرات، أذرع تعليق" },
    { name: "الكهرباء والبطاريات", slug: "electrical", description: "بطاريات، دينامو، طرمبات كهرباء" },
    { name: "الإطارات والجنوط", slug: "tires-wheels", description: "إطارات وجنوط لجميع المقاسات" },
    { name: "زيوت وسوائل", slug: "oils-fluids", description: "زيوت محرك، سوائل فرامل وتبريد" },
    { name: "الإضاءة", slug: "lighting", description: "مصابيح أمامية وخلفية وإضاءة داخلية" },
    { name: "إكسسوارات وتلبيس", slug: "accessories", description: "دواسات، أغطية مقاعد ومستلزمات إضافية" },
  ];

  const categories: Record<string, string> = {};
  for (const [i, cat] of categoriesData.entries()) {
    const created = await prisma.category.create({
      data: { ...cat, imageUrl: placeholderImage(cat.name), sortOrder: i },
    });
    categories[cat.slug] = created.id;
  }

  console.log("📦 إنشاء المنتجات...");

  type SeedProduct = {
    name: string;
    slug: string;
    description: string;
    sku: string;
    brand?: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
    category: string;
    featured?: boolean;
    compatibilities?: { make: string; model: string; yearFrom: number; yearTo: number }[];
  };

  const products: SeedProduct[] = [
    {
      name: "فلتر زيت المحرك الأصلي",
      slug: "engine-oil-filter",
      description: "فلتر زيت عالي الكفاءة يحافظ على نظافة المحرك ويطيل عمره. يُنصح بالتغيير كل 5000-10000 كم.",
      sku: "ENG-OF-001",
      brand: "Denso",
      price: 45,
      stock: 120,
      category: "engine-parts",
      featured: true,
      compatibilities: [
        { make: "تويوتا", model: "كامري", yearFrom: 2015, yearTo: 2020 },
        { make: "تويوتا", model: "كورولا", yearFrom: 2014, yearTo: 2019 },
      ],
    },
    {
      name: "طقم بواجي إشعال إيريديوم (4 قطع)",
      slug: "iridium-spark-plugs-set",
      description: "بواجي إشعال إيريديوم توفر إشعالًا أقوى وعمرًا أطول مقارنة بالبواجي التقليدية.",
      sku: "ENG-SP-002",
      brand: "NGK",
      price: 120,
      compareAtPrice: 145,
      stock: 60,
      category: "engine-parts",
      compatibilities: [{ make: "هيونداي", model: "النترا", yearFrom: 2016, yearTo: 2021 }],
    },
    {
      name: "طقم تيل فرامل أمامي",
      slug: "front-brake-pads-set",
      description: "تيل فرامل أمامي منخفض الضجيج مع طبقة حماية ضد الصدأ، يوفر مسافة توقف آمنة.",
      sku: "BRK-PD-001",
      brand: "Brembo",
      price: 180,
      stock: 75,
      category: "brakes",
      featured: true,
      compatibilities: [
        { make: "تويوتا", model: "كامري", yearFrom: 2015, yearTo: 2020 },
        { make: "لكزس", model: "ES", yearFrom: 2016, yearTo: 2021 },
      ],
    },
    {
      name: "طقم أقراص فرامل خلفية",
      slug: "rear-brake-discs-set",
      description: "أقراص فرامل خلفية مقاومة للحرارة العالية، مناسبة للاستخدام اليومي والطرق الوعرة.",
      sku: "BRK-DC-002",
      brand: "ATE",
      price: 320,
      stock: 40,
      category: "brakes",
      compatibilities: [{ make: "نيسان", model: "باترول", yearFrom: 2017, yearTo: 2023 }],
    },
    {
      name: "كمبروسر تعليق هوائي",
      slug: "air-suspension-compressor",
      description: "كمبروسر تعليق هوائي أصلي يضمن ثبات ارتفاع السيارة وراحة القيادة.",
      sku: "SUS-AC-001",
      brand: "Arnott",
      price: 950,
      stock: 15,
      category: "suspension",
      compatibilities: [{ make: "لكزس", model: "LX", yearFrom: 2016, yearTo: 2021 }],
    },
    {
      name: "طقم مساعدين أمامي (يمين ويسار)",
      slug: "front-shock-absorbers-set",
      description: "مساعدين أمامي بتقنية امتصاص الصدمات المزدوجة لثبات أفضل في المنعطفات.",
      sku: "SUS-ST-002",
      brand: "KYB",
      price: 540,
      stock: 30,
      category: "suspension",
      featured: true,
      compatibilities: [
        { make: "تويوتا", model: "كورولا", yearFrom: 2014, yearTo: 2019 },
        { make: "هيونداي", model: "النترا", yearFrom: 2016, yearTo: 2021 },
      ],
    },
    {
      name: "بطارية سيارة 70 أمبير",
      slug: "car-battery-70ah",
      description: "بطارية عالية التحمل مع ضمان سنتين، مناسبة للمناخ الحار.",
      sku: "ELE-BT-001",
      brand: "AC Delco",
      price: 380,
      stock: 50,
      category: "electrical",
      featured: true,
      compatibilities: [
        { make: "تويوتا", model: "كامري", yearFrom: 2015, yearTo: 2020 },
        { make: "كيا", model: "سبورتاج", yearFrom: 2017, yearTo: 2022 },
      ],
    },
    {
      name: "دينامو شحن (مولد كهرباء)",
      slug: "alternator-generator",
      description: "دينامو شحن أصلي معاد تصنيعه بمعايير الجودة الأصلية، يضمن شحن البطارية بكفاءة.",
      sku: "ELE-AL-002",
      brand: "Bosch",
      price: 620,
      stock: 20,
      category: "electrical",
      compatibilities: [{ make: "فورد", model: "F-150", yearFrom: 2015, yearTo: 2020 }],
    },
    {
      name: "إطار مقاس 235/55R18",
      slug: "tire-235-55-r18",
      description: "إطار عالي الجودة يوفر ثباتًا ممتازًا على الطرق الرطبة والجافة مع عمر افتراضي طويل.",
      sku: "TIR-235-001",
      brand: "Michelin",
      price: 480,
      stock: 80,
      category: "tires-wheels",
      featured: true,
      compatibilities: [
        { make: "كيا", model: "سبورتاج", yearFrom: 2017, yearTo: 2022 },
        { make: "نيسان", model: "باترول", yearFrom: 2017, yearTo: 2023 },
      ],
    },
    {
      name: "جنط رياضي 18 بوصة (الحبة)",
      slug: "sport-alloy-wheel-18",
      description: "جنط ألمنيوم خفيف الوزن بتصميم رياضي، يحسّن من ثبات القيادة ويوفر مظهرًا مميزًا.",
      sku: "WHL-18-002",
      brand: "OZ Racing",
      price: 650,
      stock: 24,
      category: "tires-wheels",
      compatibilities: [{ make: "شيفروليه", model: "تاهو", yearFrom: 2015, yearTo: 2020 }],
    },
    {
      name: "زيت محرك تخليقي كامل 5W-30 (4 لتر)",
      slug: "full-synthetic-oil-5w30",
      description: "زيت محرك تخليقي بالكامل يحمي المحرك في درجات الحرارة العالية والمنخفضة، مناسب لمعظم السيارات.",
      sku: "OIL-5W30-001",
      brand: "Mobil 1",
      price: 140,
      stock: 200,
      category: "oils-fluids",
      featured: true,
    },
    {
      name: "سائل فرامل DOT4",
      slug: "brake-fluid-dot4",
      description: "سائل فرامل عالي الجودة يحافظ على أداء نظام الفرامل الهيدروليكي في جميع الظروف.",
      sku: "FLD-DOT4-002",
      brand: "Castrol",
      price: 35,
      stock: 150,
      category: "oils-fluids",
    },
    {
      name: "طقم مصابيح LED أمامية",
      slug: "led-headlight-kit",
      description: "طقم إضاءة LED فائقة السطوع يحسّن الرؤية الليلية بشكل كبير مع استهلاك أقل للطاقة.",
      sku: "LGT-LED-001",
      brand: "Philips",
      price: 260,
      compareAtPrice: 310,
      stock: 45,
      category: "lighting",
      featured: true,
      compatibilities: [
        { make: "تويوتا", model: "كامري", yearFrom: 2015, yearTo: 2020 },
        { make: "هيونداي", model: "النترا", yearFrom: 2016, yearTo: 2021 },
      ],
    },
    {
      name: "مصباح خلفي (الجانب الأيمن)",
      slug: "rear-tail-light-right",
      description: "مصباح خلفي أصلي بديل، متوافق تمامًا مع فتحات التركيب الأصلية دون تعديل.",
      sku: "LGT-TL-002",
      brand: "TYC",
      price: 190,
      stock: 35,
      category: "lighting",
      compatibilities: [{ make: "كيا", model: "سبورتاج", yearFrom: 2017, yearTo: 2022 }],
    },
    {
      name: "دواسات أرضية مطاطية (طقم 4 قطع)",
      slug: "rubber-floor-mats-set",
      description: "دواسات مطاطية مقاومة للماء والأوساخ، سهلة التنظيف ومناسبة لجميع الفصول.",
      sku: "ACC-MAT-001",
      brand: "WeatherTech",
      price: 90,
      stock: 100,
      category: "accessories",
    },
    {
      name: "طقم غطاء مقاعد جلد كامل",
      slug: "full-leather-seat-covers",
      description: "أغطية مقاعد جلد فاخرة تحمي المقاعد الأصلية وتضيف لمسة أناقة لداخلية السيارة.",
      sku: "ACC-SEAT-002",
      brand: "Generic",
      price: 420,
      stock: 25,
      category: "accessories",
      featured: true,
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        sku: p.sku,
        brand: p.brand,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        stock: p.stock,
        imageUrl: placeholderImage(p.name),
        categoryId: categories[p.category],
        isFeatured: Boolean(p.featured),
        compatibilities: p.compatibilities ? { create: p.compatibilities } : undefined,
      },
    });
  }

  console.log("✅ اكتملت التعبئة بنجاح");
  console.log("---");
  console.log("بيانات الدخول التجريبية:");
  console.log("  المشرف   → admin@example.com / Admin@12345");
  console.log("  عميل      → customer@example.com / Customer@12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
