import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(100),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  phone: z.string().min(8).max(20).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const carCompatibilitySchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  yearFrom: z.number().int().min(1970).max(2100),
  yearTo: z.number().int().min(1970).max(2100),
});

export const productSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).optional(),
  description: z.string().min(1),
  sku: z.string().min(1).max(60),
  brand: z.string().max(100).optional().nullable(),
  price: z.number().positive("السعر يجب أن يكون أكبر من صفر"),
  compareAtPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0),
  imageUrl: z.string().url("رابط الصورة غير صالح"),
  categoryId: z.string().min(1, "الرجاء اختيار قسم"),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  images: z.array(z.string().url()).optional(),
  compatibilities: z.array(carCompatibilitySchema).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
});

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(50).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(50),
});

export const checkoutSchema = z.object({
  shippingName: z.string().min(2, "الاسم مطلوب"),
  shippingPhone: z.string().min(8, "رقم الجوال مطلوب"),
  shippingCity: z.string().min(2, "المدينة مطلوبة"),
  shippingAddress: z.string().min(5, "العنوان التفصيلي مطلوب"),
  notes: z.string().max(500).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export const productQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce.number().int().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
});
