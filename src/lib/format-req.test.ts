import { getLimitAndOffsetFromReq } from "./format-req";
import { test, expect } from "vitest";

test("format-req getLimitAndOffsetFromReq", () => {
  const req = { url: "http://ejemplo-de-url.com/?offset=1&limit=4" } as unknown as Request;
  const maxLimit = 5;
  const maxOffset = 3;
  const { limit, offset } = getLimitAndOffsetFromReq(req, maxLimit, maxOffset);
  expect(limit).toBe(4);
  expect(offset).toBe(1);
});
