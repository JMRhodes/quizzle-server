import type { Context } from "hono";
import type { z } from "zod";

import { eq } from "drizzle-orm";

import type { Environment } from "../bindings";
import type { insertQuestionSchema, selectQuestionSchema, updateQuestionSchema } from "../db/schema/questions";

import { initDbConnect } from "../db/index";
import { questions as questionsTable } from "../db/schema/questions";

export const questionsService = {
  getAllQuestions: async (c: Context<Environment>): Promise<z.infer<typeof selectQuestionSchema>[]> => {
    const db = initDbConnect(c.env.QUIZZLE_DB);
    const results = await db.select().from(questionsTable);
    return results as z.infer<typeof selectQuestionSchema>[];
  },
  getQuestionsByCategory: async (categoryId: number, c: Context<Environment>): Promise<z.infer<typeof selectQuestionSchema>[]> => {
    const db = initDbConnect(c.env.QUIZZLE_DB);
    const results = await db.select().from(questionsTable).where(eq(questionsTable.categoryId, categoryId));
    return results as z.infer<typeof selectQuestionSchema>[];
  },
  createQuestion: async (questionData: z.infer<typeof insertQuestionSchema>, c: Context<Environment>) => {
    const db = initDbConnect(c.env.QUIZZLE_DB);
    const response = await db.insert(questionsTable).values(questionData);
    if (!response.meta.changes) {
      throw new Error("Failed to create question", { cause: response });
    }
    return response;
  },
  updateQuestion: async (id: number, questionData: z.infer<typeof updateQuestionSchema>, c: Context<Environment>) => {
    const db = initDbConnect(c.env.QUIZZLE_DB);
    const response = await db.update(questionsTable).set(questionData).where(eq(questionsTable.id, id));
    if (!response.meta.changes) {
      throw new Error("Failed to update question", { cause: response });
    }
    return response;
  },
  deleteQuestion: async (id: number, c: Context<Environment>) => {
    const db = initDbConnect(c.env.QUIZZLE_DB);
    const response = await db.delete(questionsTable).where(eq(questionsTable.id, id));
    if (!response.meta.changes) {
      throw new Error("Failed to delete question", { cause: response });
    }

    return response;
  },
};
