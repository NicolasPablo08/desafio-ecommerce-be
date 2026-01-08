import { obtainOrders } from "controllers/transaction";
import { authMiddleware } from "middlewares";
import { corsHeaders, handleOptions } from "lib/cors";

//para el manejo de cors y no tener problemas
// cuando el back es llamado desde el front ubicado en otro servidor
//agregar headers:corsHeaders en la respuestas al front
export async function OPTIONS() {
	return handleOptions();
}

export const GET = authMiddleware(handler);

async function handler(request: Request, userId: string) {
	try {
		const myOrders = await obtainOrders(userId);
		if (!myOrders)
			return new Response(
				JSON.stringify({ message: "Error, fail to obtain orders" }),
				{
					status: 400,
					headers: corsHeaders,
				}
			);
		return new Response(JSON.stringify(myOrders), {
			status: 200,
			headers: corsHeaders,
		});
	} catch (e) {
		return new Response(JSON.stringify({ message: e.message }), {
			status: 400,
			headers: corsHeaders,
		});
	}
}
