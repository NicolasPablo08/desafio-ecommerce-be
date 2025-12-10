import { getProductsBySearch } from "src/controllers/products";
import { getLimitAndOffsetFromReq } from "src/lib/format-req";
import * as yup from "yup";

const paramsSchema = yup.object().shape({
  q: yup.string().required(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = Object.fromEntries(searchParams.entries());

  try {
    await paramsSchema.validate(query);
  } catch (e) {
    return new Response(JSON.stringify({ field: "params", message: e.message }), { status: 400 });
  }
  try {
    const search = query.q;
    const maxLimit = 4;
    const maxOffset = 10;
    const { limit, offset } = getLimitAndOffsetFromReq(req, maxLimit, maxOffset);
    if (!limit || !offset)
      return new Response(JSON.stringify({ message: "Error: invalid limit or offset" }), {
        status: 400,
      });
    const response = await getProductsBySearch(search, limit, offset);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }), { status: 400 });
  }
}
