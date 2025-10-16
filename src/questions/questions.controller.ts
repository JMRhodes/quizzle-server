import type { Context } from "hono";

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import type { Environment, jsonApiErrorResponse, jsonApiListResponse } from "../bindings";

import withD1 from "../db";
import { insertQuestionSchema, updateQuestionSchema } from "../db/schema/questions";
import { questionsService } from "./questions.service";

const questions = new Hono<Environment>();
const categoryIdSchema = z.object({
  categoryId: z.string(),
});

questions.get("/", withD1, async (c: Context<Environment>) => {
  const results = await questionsService.getAllQuestions(c);

  return c.json({
    data: results.map(question => ({
      type: "questions",
      id: question.id,
      attributes: { ...question, id: undefined },
    })),
  } as jsonApiListResponse);
});

questions.get("/category/:categoryId", withD1, zValidator("param", categoryIdSchema), async (c) => {
  const results = await questionsService.getQuestionsByCategory(Number.parseInt(c.req.param("categoryId")), c);

  return c.json({
    data: results.map(question => ({
      type: "questions",
      id: question.id,
      attributes: { ...question, id: undefined },
    })),
  } as jsonApiListResponse);
});

questions.post("/", withD1, zValidator("json", insertQuestionSchema), async (c) => {
  try {
    const response = await questionsService.createQuestion(c.req.valid("json"), c);

    return c.json({ message: "Question created", response });
  }
  catch (error) {
    return c.json({
      id: "error_creating_record",
      status: 500,
      errors: [{
        detail: error instanceof Error ? error.message : "Unknown Error",
      }],
    } as jsonApiErrorResponse, 500);
  }
});

questions.put("/:id", withD1, zValidator("json", updateQuestionSchema), async (c) => {
  const { id } = c.req.param();
  try {
    const results = await questionsService.updateQuestion(Number.parseInt(id), c.req.valid("json"), c);

    return c.json({ message: `Updated question with id ${id}`, results });
  }
  catch (error) {
    return c.json({
      id: "error_updating_record",
      status: 500,
      errors: [{
        detail: error instanceof Error ? error.message : "Unknown Error",
      }],
    } as jsonApiErrorResponse, 500);
  }
});

questions.delete("/:id", withD1, async (c) => {
  const { id } = c.req.param();
  try {
    const response = await questionsService.deleteQuestion(Number.parseInt(id), c);

    return c.json({ message: `Question ${id} deleted`, response });
  }
  catch (error) {
    return c.json({
      id: "error_deleting_record",
      status: 500,
      errors: [{
        detail: error instanceof Error ? error.message : "Unknown Error",
      }],
    } as jsonApiErrorResponse, 500);
  }
});

export default questions;
