import { getProductById } from "controllers/products";
import * as yup from "yup";
import { corsHeaders, handleOptions } from "lib/cors";

//para el manejo de cors y no tener problemas
// cuando el back es llamado desde el front ubicado en otro servidor
//agregar headers:corsHeaders en la respuestas al front
export async function OPTIONS() {
  return handleOptions();
}
const paramsSchema = yup.object().shape({
  id: yup.string().required(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  try {
    await paramsSchema.validate(resolvedParams);
  } catch (e) {
    return new Response(JSON.stringify({ field: "params", message: e.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
  try {
    const { id } = resolvedParams;

    const response = await getProductById(id);
    return new Response(JSON.stringify(response), { status: 200, headers: corsHeaders });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
}
