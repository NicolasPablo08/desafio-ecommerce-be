import syncPostgresDataBase from "models/sync";
import { corsHeaders, handleOptions } from "lib/cors";

//para el manejo de cors y no tener problemas
// cuando el back es llamado desde el front ubicado en otro servidor
//agregar headers:corsHeaders en la respuestas al front
export async function OPTIONS() {
	return handleOptions();
}

export async function GET(req: Request) {
	try {
		const response = await syncPostgresDataBase();
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
