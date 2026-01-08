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
const bodySchema = yup
	.object()
	.shape({
		name: yup.string(),
		lastName: yup.string(),
		email: yup.string().email(),
		address: yup.string(),
	})
	.noUnknown(true)
	.strict();

export const GET = authMiddleware(obtainUserHandler);
export const PATCH = authMiddleware(updateDataUserHandler);

async function obtainUserHandler(req: Request, userId: string) {
	try {
		const user = await User.findUserById(userId);
		if (!user)
			return new Response(
				JSON.stringify({ message: "Error, user not found" }),
				{
					status: 400,
					headers: corsHeaders,
				}
			);
		return new Response(JSON.stringify(user), {
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

async function updateDataUserHandler(req: Request, userId: string) {
	const body = await req.json();
	try {
		await bodySchema.validate(body);
	} catch (e) {
		return new Response(JSON.stringify({ field: "body", message: e.message }), {
			status: 400,
			headers: corsHeaders,
		});
	}
	try {
		const updatedDataUser = await User.updatePartialUser(userId, body);
		if (!updatedDataUser)
			return new Response(
				JSON.stringify({ message: "Error, user not updated" }),
				{
					status: 400,
					headers: corsHeaders,
				}
			);
		return new Response(JSON.stringify({ message: "User updated" }), {
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
