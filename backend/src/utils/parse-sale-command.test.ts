// @ts-expect-error: bun:test is provided by the Bun test runtime.
import { describe, expect, test } from "bun:test";
import { parseSaleCommand } from "./parse-sale-command";

describe("parseSaleCommand", () => {
  test("parses a price with a thousands separator", () => {
    expect(parseSaleCommand("Lampara 30.000")).toEqual({
      title: "Lampara",
      salePrice: 30000,
    });
  });

  test("keeps numbers that belong to the title", () => {
    expect(parseSaleCommand("Figura Goku 30cm 30000")).toEqual({
      title: "Figura Goku 30cm",
      salePrice: 30000,
    });
  });

  test("collapses extra whitespace", () => {
    expect(parseSaleCommand("  lampara   15.500  ")).toEqual({
      title: "lampara",
      salePrice: 15500,
    });
  });

  test("accepts a dollar sign before the price", () => {
    expect(parseSaleCommand("Lampara $30.000")).toEqual({
      title: "Lampara",
      salePrice: 30000,
    });
  });

  test("returns null when there is no price", () => {
    expect(parseSaleCommand("Lampara")).toBeNull();
  });

  test("returns null when the last token is not a number", () => {
    expect(parseSaleCommand("Lampara gratis")).toBeNull();
  });

  test("returns null when there is no title", () => {
    expect(parseSaleCommand("30000")).toBeNull();
  });

  test("returns null when the price is only a symbol", () => {
    expect(parseSaleCommand("Lampara $")).toBeNull();
  });
});
