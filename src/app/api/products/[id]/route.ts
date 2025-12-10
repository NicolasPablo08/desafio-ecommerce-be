import { getProductById } from "src/controllers/products";
import * as yup from "yup";

const paramsSchema = yup.object().shape({
  id: yup.string().required(),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const param = await params;
  try {
    await paramsSchema.validate(param);
  } catch (e) {
    return new Response(JSON.stringify({ field: "params", message: e.message }), { status: 400 });
  }
  try {
    const { id } = param;
    const response = await getProductById(id);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }), { status: 400 });
  }
}
