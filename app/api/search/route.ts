import { getProductsBySearch } from "controllers/products";
import { getLimitAndOffsetFromReq } from "lib/format-req";
import * as yup from "yup";
import { corsHeaders, handleOptions } from "lib/cors";

//para el manejo de cors y no tener problemas
// cuando el back es llamado desde el front ubicado en otro servidor
//agregar headers:corsHeaders en la respuestas al front
export async function OPTIONS() {
  return handleOptions();
}

const paramsSchema = yup.object().shape({
  q: yup.string().required(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = Object.fromEntries(searchParams.entries());

  try {
    await paramsSchema.validate(query);
  } catch (e) {
    return new Response(JSON.stringify({ field: "params", message: e.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
  try {
    const search = query.q;
    const maxLimit = 4;
    const maxOffset = 10;
    const { limit, offset } = getLimitAndOffsetFromReq(req, maxLimit, maxOffset);
    if (!limit || !offset)
      return new Response(JSON.stringify({ message: "Error: invalid limit or offset" }), {
        status: 400,
        headers: corsHeaders,
      });
    const response = await getProductsBySearch(search, limit, offset);
    return new Response(JSON.stringify(response), { status: 200, headers: corsHeaders });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
}
