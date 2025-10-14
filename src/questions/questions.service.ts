import type { Context } from "hono";
import type { z } from "zod";

import type { Environment } from "../bindings";
import type { selectQuestionSchema } from "../db/schema/questions";

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
};
