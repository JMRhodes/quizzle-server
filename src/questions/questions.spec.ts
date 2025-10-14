import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

import type { Environment, jsonApiListResponse } from "../bindings";

import questions from "./questions.controller";
import { questionsService } from "./questions.service";

// Mock the questions service
vi.mock("./questions.service", () => ({
  questionsService: {
    getAllQuestions: vi.fn(),
  },
}));

// Create test app
const app = new Hono<Environment>().route("/questions", questions);

// Mock environment
const mockEnv: Environment["Bindings"] = {
  JWT_SECRET: "test-secret",
  USERNAME: "test-user",
  PASSWORD: "test-password",
  QUIZZLE_DB: {} as D1Database,
  NODE_ENV: "development",
};

describe("Questions Controller", () => {
  it("should return all questions", async () => {
    const mockQuestions = [
      {
        id: 2,
        categoryId: 4,
        questionText: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Brisbane"] as unknown as JSON,
        correctAnswer: "Canberra",
        explanation: "Canberra is the capital city of Australia.",
        difficulty: 1,
        metadata: {
          tags: ["capitals"],
          source: "geography",
        } as unknown as JSON,
        isActive: true,
        displayOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(questionsService.getAllQuestions).mockResolvedValue(mockQuestions);

    const res = await app.request("/questions", {}, mockEnv);
    const data = await res.json() as jsonApiListResponse;

    expect(res.status).toBe(200);
    expect(data.data).toHaveLength(1);
    expect(data.data[0].type).toBe("questions");
    expect(data.data[0].attributes.correctAnswer).toBe("Canberra");
  });
});
