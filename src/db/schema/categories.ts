import { sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
// Example Zod schema generation
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Categories table
export const categories = sqliteTable("categories", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  isActive: integer({ mode: "boolean" }).notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: integer({ mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer({ mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
});

export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);
