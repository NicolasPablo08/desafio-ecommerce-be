import { generateCode, addMinutesToDate } from "./auth";
import { test, expect } from "vitest";
test("auth generateCode", () => {
  const code = generateCode();
  expect(code).toBeTypeOf("number");
  expect(JSON.stringify(code).length).toEqual(5);
});

test("auth addMinutesToDate", () => {
  const twentyMinnutesfromNow = addMinutesToDate().getTime(); //con getTime lo pasamos de Date a number
  const now = Date.now(); //fecha en number (no Date)
  const expectedDate = now + 20 * 60 * 1000; // 20 minutos en milisegundos
  // toBeCloseTo permite comparar números con un margen de error (no toma en cuenta los ultimos 2 digitos)
  expect(twentyMinnutesfromNow).toBeCloseTo(expectedDate, -2);
});
