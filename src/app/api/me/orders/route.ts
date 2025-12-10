import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { obtainOrders } from "src/controllers/transaction";
import { authMiddleware } from "src/middlewares";

export const GET = authMiddleware(handler);

async function handler(request: Request, userId: string) {
  try {
    const myOrders = await obtainOrders(userId);
    if (!myOrders)
      return new Response(JSON.stringify({ message: "Error, fail to obtain orders" }), {
        status: 400,
      });
    return new Response(JSON.stringify(myOrders), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }), { status: 400 });
  }
}
