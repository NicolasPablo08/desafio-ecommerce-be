import { createOrder } from "controllers/transaction";
import { authMiddleware } from "middlewares";
import * as yup from "yup";
import { corsHeaders, handleOptions } from "lib/cors";

//para el manejo de cors y no tener problemas
// cuando el back es llamado desde el front ubicado en otro servidor
//agregar headers:corsHeaders en la respuestas al front
export async function OPTIONS() {
	return handleOptions();
}
const querySchema = yup.object().shape({
	//espera un objeto
	cartId: yup.string().required(),
});

export const POST = authMiddleware(generateNewOrderByUser);

async function generateNewOrderByUser(req: Request, userId: string) {
	const { searchParams } = new URL(req.url);
	const cartId = searchParams.get("cartId");

	try {
		await querySchema.validate({ cartId });
	} catch (e) {
		return new Response(
			JSON.stringify({ field: "query", message: e.message }),
			{
				status: 400,
				headers: corsHeaders,
			}
		);
	}
	try {
		const response = await createOrder(cartId, userId);
		return new Response(JSON.stringify(response.init_point), {
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
