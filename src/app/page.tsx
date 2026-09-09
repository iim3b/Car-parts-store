import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let categories = [];
  let products = [];

  try {
    const rawCategories = await prisma.category.findMany();
    categories = Array.from(
      new Map(rawCategories.map((cat: any) => [cat.name, cat])).values()
    );
    
    products = await prisma.product.findMany();
  } catch (error) {
    console.error("Error fetching data from database:", error);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-zinc-300 p-6 sm:p-10 selection:bg-amber-500 selection:text-black" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* قسم الهيدر الفاخر بتصميم زجاجي مع لمسة معدنية */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900/90 via-zinc-950/80 to-black border border-zinc-800/80 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 text-center space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold">Genuine Automotive Parts</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              متجر قطع غيار السيارات
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              هندسة دقة الأداء واعتمادية القطع الفاخرة لتجربة قيادة استثنائية
            </p>
          </div>
        </header>

        {/* الأقسام الرئيسية */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <h2 className="text-lg font-bold tracking-wide text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-amber-500 rounded-full"></span>
              الأقسام الرئيسية
            </h2>
            <span className="text-xs text-zinc-500">({categories.length}) أقسم</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat: any) => (
              <div 
                key={cat.id} 
                className="group relative bg-zinc-900/40 hover:bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800/80 hover:border-amber-500/40 transition-all duration-300 shadow-lg hover:-translate-y-0.5"
              >
                <h3 className="font-semibold text-sm text-white group-hover:text-amber-400 transition-colors">{cat.name}</h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">{cat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* المنتجات المتاحة */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <h2 className="text-lg font-bold tracking-wide text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-amber-500 rounded-full"></span>
              القطع المتاحة
            </h2>
            <span className="text-xs text-zinc-500">({products.length}) منتج</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {products.map((prod: any) => (
              <div 
                key={prod.id} 
                className="group bg-zinc-900/50 hover:bg-zinc-900/90 border border-zinc-800/80 p-5 rounded-2xl shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-zinc-700"
              >
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-white group-hover:text-amber-400 transition-colors tracking-wide">{prod.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{prod.description}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-zinc-800/60 pt-4">
                  <span className="text-amber-400 font-bold text-base tracking-tight">{prod.price} ر.س</span>
                  <span className="bg-zinc-800/80 text-zinc-300 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-zinc-700/50">
                    المخزون: {prod.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}