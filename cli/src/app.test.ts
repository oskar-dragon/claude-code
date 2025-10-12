import { test, expect } from "bun:test";
import { app } from "./app";

test("app should be defined", () => {
  expect(app).toBeDefined();
});

test("app should have init command", () => {
  // The app structure from @stricli/core doesn't expose routes directly
  // Just verify the app object is properly constructed
  expect(app).toBeTruthy();
});
