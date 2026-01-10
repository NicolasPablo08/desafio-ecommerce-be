import { corsHeaders, handleOptions } from "lib/cors";
import { authMiddleware } from "middlewares";
import { getProductsFromOldsCart } from "controllers/products";

//para el manejo de cors y no tener problemas
// cuando el back es llamado desde el front ubicado en otro servidor
//agregar headers:corsHeaders en la respuestas al front

export async function OPTIONS() {
	return handleOptions();
}
export const GET = authMiddleware(obtainOldsCartHandler);

export async function obtainOldsCartHandler(req: Request, userId: string) {
	try {
		const response = await getProductsFromOldsCart(userId);
		return new Response(JSON.stringify(response), {
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
