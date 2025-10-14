import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

import type { Environment, jsonApiListResponse } from "../bindings";

import categories from "./categories.controller";
import { categoriesService } from "./categories.service";

// Mock the categories service
vi.mock("./categories.service", () => ({
  categoriesService: {
    getAllCategories: vi.fn(),
  },
}));

// Create test app
const app = new Hono<Environment>().route("/categories", categories);

// Mock environment
const mockEnv: Environment["Bindings"] = {
  JWT_SECRET: "test-secret",
  USERNAME: "test-user",
  PASSWORD: "test-password",
  QUIZZLE_DB: {} as D1Database,
  NODE_ENV: "development",
};

describe("Categories Controller", () => {
  it("should return all categories", async () => {
    const mockCategories = [
      {
        id: 1,
        name: "Geography",
        slug: "geography",
        description: "Geography questions",
        isActive: true,
        displayOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(categoriesService.getAllCategories).mockResolvedValue(mockCategories);

    const res = await app.request("/categories", {}, mockEnv);
    const data = await res.json() as jsonApiListResponse;

    expect(res.status).toBe(200);
    expect(data.data).toHaveLength(1);
    expect(data.data[0].type).toBe("categories");
    expect(data.data[0].attributes.name).toBe("Geography");
  });
});
