import * as yup from "yup";
import { corsHeaders, handleOptions } from "lib/cors";
import { authMiddleware } from "middlewares";
import {
	addProductToCart,
	deleteProductFromCart,
	getProductsFromNewCart,
} from "controllers/products";

//para el manejo de cors y no tener problemas
// cuando el back es llamado desde el front ubicado en otro servidor
//agregar headers:corsHeaders en la respuestas al front

export async function OPTIONS() {
	return handleOptions();
}
export const GET = authMiddleware(obtainProductsToCartHandler);
export const POST = authMiddleware(addProductToCartHandler);
export const DELETE = authMiddleware(deleteProductFromCartHandler);

const bodySchema = yup.object().shape({
	productId: yup.string().required(),
	quantity: yup.number(),
});

export async function addProductToCartHandler(req: Request, userId: string) {
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
		const productId = body.productId as string;
		const quantity = Number(body.quantity) || 1;
		const response = await addProductToCart(userId, productId, quantity);
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

export async function obtainProductsToCartHandler(
	req: Request,
	userId: string
) {
	try {
		const response = await getProductsFromNewCart(userId);
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

export async function deleteProductFromCartHandler(
	req: Request,
	userId: string
) {
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
		const productId = body.productId as string;
		const response = await deleteProductFromCart(userId, productId);
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
