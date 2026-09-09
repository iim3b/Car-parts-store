import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const engineCategory = await prisma.category.upsert({
    where: { slug: 'filters-and-maintenance' },
    update: {},
    create: {
      name: 'فلاتر وصيانة دورية',
      slug: 'filters-and-maintenance',
      description: 'جميع الفلاتر وقطع الصيانة السريعة للسيارات',
      sortOrder: 1,
    },
  });

  const brakeCategory = await prisma.category.upsert({
    where: { slug: 'brake-system' },
    update: {},
    create: {
      name: 'نظام الفرامل',
      slug: 'brake-system',
      description: 'فحمات وهوبات وجميع مستلزمات السلامة والفرامل',
      sortOrder: 2,
    },
  });

  const ignitionCategory = await prisma.category.upsert({
    where: { slug: 'ignition-system' },
    update: {},
    create: {
      name: 'نظام الاشتعال والكهرباء',
      slug: 'ignition-system',
      description: 'بواجي وكويلات وقطع الكهرباء للمحرك',
      sortOrder: 3,
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'فلتر زيت أصلي',
        slug: 'original-oil-filter',
        description: 'فلتر زيت أصلي يوفر حماية عالية للمحرك ويضمن تدفق الزيت بكفاءة ممتازة.',
        price: 45,
        stock: 25,
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500',
        categoryId: engineCategory.id,
      },
      {
        name: 'طقم فحمات فرامل أمامية',
        slug: 'front-brake-pads',
        description: 'فحمات فرامل سيراميك عالية الأداء توفر قوة إيقاف ممتازة بدون أصوات صفير.',
        price: 180,
        stock: 15,
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1600706432520-2c35f7956cf1?w=500',
        categoryId: brakeCategory.id,
      },
      {
        name: 'طقم بواجي ليزر إيريديوم',
        slug: 'iridium-spark-plugs',
        description: 'طقم بواجي 4 حبات لعمر أطول واستجابة أفضل للمحرك وتقليل استهلاك الوقود.',
        price: 120,
        stock: 30,
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500',
        categoryId: ignitionCategory.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ تم إضافة البيانات التجريبية بنجاح!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });