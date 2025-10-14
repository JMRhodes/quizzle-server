import type { Context } from "hono";

import { Hono } from "hono";

import type { Environment, jsonApiListResponse } from "../bindings";

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

export default questions;
