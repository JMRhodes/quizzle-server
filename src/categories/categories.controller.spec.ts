import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Environment } from "../bindings.js";

import categories from "./categories.controller";
import { categoriesService } from "./categories.service";

// Mock the categories service
vi.mock("./categories.service", () => ({
  categoriesService: {
    getAllCategories: vi.fn(),
    getCategoryById: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
  },
}));

// Create a test app instance
const app = new Hono<Environment>().route("/categories", categories);

// Mock environment for testing
const mockEnv: Environment["Bindings"] = {
  JWT_SECRET: "test-secret",
  USERNAME: "test-user",
  PASSWORD: "test-password",
  QUIZZLE_DB: {} as D1Database,
  NODE_ENV: "development",
};

describe("Categories Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /categories", () => {
    it("should return all categories", async () => {
      const mockCategories = [
        {
          id: 1,
          name: "Science",
          slug: "science",
          description: "Science related questions",
          isActive: true,
          displayOrder: 0,
          createdAt: "new Date()",
          updatedAt: "new Date()",
        },
        {
          id: 2,
          name: "History",
          slug: "history",
          description: "Historical questions",
          isActive: true,
          displayOrder: 1,
          createdAt: "new Date()",
          updatedAt: "new Date()",
        },
      ];

      vi.mocked(categoriesService.getAllCategories).mockResolvedValue(mockCategories);

      const res = await app.request("/categories", {}, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual(mockCategories);
      expect(categoriesService.getAllCategories).toHaveBeenCalledOnce();
    });
  });

  describe("GET /categories/:id", () => {
    it("should return a specific category when found", async () => {
      const mockCategory = {
        id: 1,
        name: "Science",
        slug: "science",
        description: "Science related questions",
        isActive: true,
        displayOrder: 0,
        createdAt: "new Date()",
        updatedAt: "new Date()",
      };

      vi.mocked(categoriesService.getCategoryById).mockResolvedValue(mockCategory);

      const res = await app.request("/categories/1", {}, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({
        message: "Category found",
        category: mockCategory,
      });
      expect(categoriesService.getCategoryById).toHaveBeenCalledWith(1, expect.any(Object));
    });

    it("should return 404 when category not found", async () => {
      vi.mocked(categoriesService.getCategoryById).mockResolvedValue(null);

      const res = await app.request("/categories/999", {}, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data).toEqual({ message: "Category not found" });
    });

    it("should handle invalid ID parameter", async () => {
      const _res = await app.request("/categories/invalid-id", {}, mockEnv);

      expect(categoriesService.getCategoryById).toHaveBeenCalledWith(Number.NaN, expect.any(Object));
    });
  });

  describe("POST /categories", () => {
    it("should create a new category with valid data", async () => {
      const newCategory = {
        name: "Mathematics",
        slug: "mathematics",
        description: "Math related questions",
        isActive: true,
        displayOrder: 2,
      };

      const mockResponse = {
        success: true,
        meta: {
          changes: 1,
          last_row_id: 3,
          duration: 0.1,
          size_after: 1000,
          rows_read: 0,
          rows_written: 1,
          changed_db: true,
        },
        results: [],
      } as any;
      vi.mocked(categoriesService.createCategory).mockResolvedValue(mockResponse);

      const res = await app.request("/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      }, mockEnv);

      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({
        message: "Category created",
        response: mockResponse,
      });
      expect(categoriesService.createCategory).toHaveBeenCalledWith(
        expect.objectContaining(newCategory),
        expect.any(Object),
      );
    });

    it("should validate required fields", async () => {
      const invalidCategory = {
        description: "Missing name and slug",
      };

      const res = await app.request("/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidCategory),
      }, mockEnv);

      expect(res.status).toBe(400);
      expect(categoriesService.createCategory).not.toHaveBeenCalled();
    });

    it("should handle empty request body", async () => {
      const res = await app.request("/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }, mockEnv);

      expect(res.status).toBe(400);
    });
  });
});
