import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  // قراءة ملف البيانات
  const rawData = fs.readFileSync('./products-data.json', 'utf8');
  const data = JSON.parse(rawData);

  console.log('🔄 جاري إضافة الأقسام...');
  for (const cat of data.categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('🔄 جاري إضافة المنتجات وربطها بالأقسام...');
  for (const prod of data.products) {
    // البحث عن القسم عبر الـ slug لربط الـ ID تلقائياً
    const category = await prisma.category.findUnique({
      where: { slug: prod.categorySlug },
    });

    if (category) {
      const { categorySlug, ...productData } = prod;
      await prisma.product.upsert({
        where: { slug: productData.slug },
        update: productData,
        create: {
          ...productData,
          categoryId: category.id,
        },
      });
    } else {
      console.log(`⚠️ تحذير: القسم ${prod.categorySlug} غير موجود للمنتج ${prod.name}`);
    }
  }

  console.log('✅ تمت إضافة ورفع جميع المنتجات والأقسام بنجاح تام!');
}

main()
  .catch((e) => {
    console.error('❌ حدث خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });