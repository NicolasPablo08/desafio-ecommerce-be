import { decodeToken, generateToken } from "./jwt";
import { test, expect } from "vitest";

let token;
test("jwt generateToken", () => {
  const userId = "1234abc";
  token = generateToken(userId);
  expect(token).toBeDefined(); // asegurar que el token esté definido
});

test("jwt decodeToken", () => {
  const decodedToken = decodeToken(token);
  expect(decodedToken).toBeDefined();
  expect(decodedToken.userId).toEqual("1234abc"); // Verifica que el userId decodificado sea el correcto
});
