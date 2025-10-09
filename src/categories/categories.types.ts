import * as z from "zod";

const CategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().min(0).default(0),
});

type Category = z.infer<typeof CategorySchema>;

export { Category, CategorySchema };
