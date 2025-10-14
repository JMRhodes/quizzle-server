import type { Context } from "hono";

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import type { Environment, jsonApiListResponse } from "../bindings";

import { insertQuestionSchema, updateQuestionSchema } from "../db/schema/questions";
import { questionsService } from "./questions.service";

const questions = new Hono<Environment>();

questions.get("/", async (c: Context<Environment>) => {
  const results = await questionsService.getAllQuestions(c);

  return c.json({
    data: results.map(question => ({
      type: "questions",
      id: question.id,
      attributes: { ...question, id: undefined },
    })),
  } as jsonApiListResponse);
});

questions.post("/", zValidator("json", insertQuestionSchema), async (c) => {
  const response = await questionsService.createQuestion(c.req.valid("json"), c);

  return c.json({ message: "Question created", response });
});

questions.put("/:id", zValidator("json", updateQuestionSchema), async (c) => {
  const { id } = c.req.param();
  const results = await questionsService.updateQuestion(Number.parseInt(id), c.req.valid("json"), c);

  return c.json({ message: `Updated question with id ${id}`, results });
});

questions.delete("/:id", async (c) => {
  const { id } = c.req.param();
  const response = await questionsService.deleteQuestion(Number.parseInt(id), c);

  return c.json({ message: `Question ${id} deleted`, response });
});

export default questions;
