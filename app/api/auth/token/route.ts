import { getToken } from "controllers/auth";
import * as yup from "yup";
import { corsHeaders, handleOptions } from "lib/cors";

//para el manejo de cors y no tener problemas
// cuando el back es llamado desde el front ubicado en otro servidor
//agregar headers:corsHeaders en la respuestas al front
export async function OPTIONS() {
  return handleOptions();
}

const bodySchema = yup.object().shape({
  email: yup.string().email().required(),
  code: yup.number().required(),
});

export async function POST(req: Request) {
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
    const { email, code } = body;
    const response = await getToken(email, code);
    return new Response(JSON.stringify(response), { status: 200, headers: corsHeaders });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
}
