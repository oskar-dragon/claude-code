import { test, expect } from "bun:test";
import { app } from "./app";

test("app should have name 'ccf'", () => {
  expect(app.name).toBe("ccf");
});

test("app should have version '0.1.0'", () => {
  expect(app.versionInfo?.currentVersion).toBe("0.1.0");
});

test("app should have init command in routes", () => {
  expect(app.root.routes).toHaveProperty("init");
});
