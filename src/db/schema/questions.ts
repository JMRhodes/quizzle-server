import { sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

import { categories } from "./categories";

export const questions = sqliteTable("questions", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  questionText: text("question_text").notNull(),
  options: text("options", { mode: "json" }).notNull(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  difficulty: integer("difficulty").notNull().default(1),
  metadata: text("metadata", { mode: "json" }),
  isActive: integer({ mode: "boolean" }).notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: integer({ mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer({ mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
});

export const insertQuestionSchema = createInsertSchema(questions);
export const selectQuestionSchema = createSelectSchema(questions);
export const updateQuestionSchema = createUpdateSchema(questions);
