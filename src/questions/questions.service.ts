import type { Context } from "hono";
import type { z } from "zod";

import { eq } from "drizzle-orm";

import type { Environment } from "../bindings";
import type { insertQuestionSchema, selectQuestionSchema, updateQuestionSchema } from "../db/schema/questions";

import { initDbConnect } from "../db/index";
import { questions as questionsTable } from "../db/schema/questions";

export const questionsService = {
  getAllQuestions: async (c: Context<Environment>): Promise<z.infer<typeof selectQuestionSchema>[]> => {
    try {
      const db = initDbConnect(c.env.QUIZZLE_DB);
      const result = await db.select().from(questionsTable);
      return result as z.infer<typeof selectQuestionSchema>[];
    }
    catch (error) {
      throw new Error("Failed to fetch questions", { cause: error });
    }
  },
  createQuestion: async (questionData: z.infer<typeof insertQuestionSchema>, c: Context<Environment>) => {
    try {
      const db = initDbConnect(c.env.QUIZZLE_DB);
      const response = await db.insert(questionsTable).values(questionData);
      return response;
    }
    catch (error) {
      throw new Error("Failed to create question", { cause: error });
    }
  },
  updateQuestion: async (id: number, questionData: z.infer<typeof updateQuestionSchema>, c: Context<Environment>) => {
    try {
      const db = initDbConnect(c.env.QUIZZLE_DB);
      const response = await db.update(questionsTable).set(questionData).where(eq(questionsTable.id, id));
      return response;
    }
    catch (error) {
      throw new Error("Failed to update question", { cause: error });
    }
  },
  deleteQuestion: async (id: number, c: Context<Environment>) => {
    try {
      const db = initDbConnect(c.env.QUIZZLE_DB);
      const response = await db.delete(questionsTable).where(eq(questionsTable.id, id));
      return response;
    }
    catch (error) {
      throw new Error("Failed to delete question", { cause: error });
    }
  },
};
