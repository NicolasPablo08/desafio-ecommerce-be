import { authMiddleware } from "middlewares";
import { User } from "models/model";
import * as yup from "yup";
import { corsHeaders, handleOptions } from "lib/cors";

//para el manejo de cors y no tener problemas
// cuando el back es llamado desde el front ubicado en otro servidor
//agregar headers:corsHeaders en la respuestas al front
export async function OPTIONS() {
	return handleOptions();
}

const bodySchema = yup.object().shape({
	address: yup.string().required(),
});

export const PATCH = authMiddleware(handler);

async function handler(request: Request, userId: string) {
	const body = await request.json();
	try {
		await bodySchema.validate(body);
	} catch (e) {
		return new Response(JSON.stringify({ field: "body", message: e.message }), {
			status: 400,
			headers: corsHeaders,
		});
	}
	try {
		const { address } = body;
		const updated = await User.updateAddress(address, userId);
		if (!updated) {
			return Response.json(
				{ message: "Error, user not updated address" },
				{ status: 400, headers: corsHeaders }
			);
		}
		return Response.json(
			{ message: "User updated address" },
			{ status: 200, headers: corsHeaders }
		);
	} catch (e) {
		return Response.json(
			{ message: e.message },
			{ status: 400, headers: corsHeaders }
		);
	}
}
