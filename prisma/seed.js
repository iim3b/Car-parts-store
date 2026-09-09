const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 بدء إدخال البيانات...');

  const category = await prisma.category.create({
    data: {
      name: 'نظام الفرامل',
      slug: 'brakes-' + Date.now(),
      description: 'قطع غيار أصلية',
    },
  });

  await prisma.product.create({
    data: {
      name: 'فحمات فرامل',
      slug: 'brake-pads-' + Date.now(),
      sku: 'SKU-' + Date.now(), // إضافة الحقل الإلزامي هنا لمنع الخطأ
      description: 'فحمات أصلية عالية الجودة',
      price: 200.0,
      stock: 10,
      categoryId: category.id,
      imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500',
    },
  });

  console.log('✅ تم إدخال البيانات بنجاح تام!');
}

main()
  .catch((e) => {
    console.error('❌ خطأ تفصيلي:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });