import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import categories from "./categories.controller";

// Create a test app instance
const app = new Hono().route("/categories", categories);

describe("Categories Controller", () => {
  describe("GET /categories", () => {
    it("should return categories endpoint message", async () => {
      const res = await app.request("/categories");

      expect(res.status).toBe(200);
      expect(await res.text()).toBe("Categories endpoint");
    });

    it("should have correct content type", async () => {
      const res = await app.request("/categories");

      expect(res.headers.get("content-type")).toBe("text/plain;charset=UTF-8");
    });
  });

  describe("GET /categories/:id", () => {
    it("should return category with numeric ID", async () => {
      const res = await app.request("/categories/123");

      expect(res.status).toBe(200);
      expect(await res.text()).toBe("Category ID: 123");
    });

    it("should return category with string ID", async () => {
      const res = await app.request("/categories/electronics");

      expect(res.status).toBe(200);
      expect(await res.text()).toBe("Category ID: electronics");
    });

    it("should handle special characters in ID", async () => {
      const res = await app.request("/categories/test-category_1");

      expect(res.status).toBe(200);
      expect(await res.text()).toBe("Category ID: test-category_1");
    });

    it("should have correct content type", async () => {
      const res = await app.request("/categories/123");

      expect(res.headers.get("content-type")).toBe("text/plain;charset=UTF-8");
    });
  });

  describe("Error cases", () => {
    it("should return 404 for non-existent routes", async () => {
      const res = await app.request("/categories/invalid/route");

      expect(res.status).toBe(404);
    });
  });
});
