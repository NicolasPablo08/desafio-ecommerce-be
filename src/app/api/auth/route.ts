import { findOrCreateAuth } from "src/controllers/auth";
import * as yup from "yup";

const bodySchema = yup.object().shape({
  email: yup.string().email().required(),
});

export async function POST(req: Request) {
  const body = await req.json();
  try {
    await bodySchema.validate(body);
  } catch (e) {
    return new Response(JSON.stringify({ field: "body", message: e.message }), { status: 400 });
  }
  try {
    const response = await findOrCreateAuth(body.email);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }), { status: 400 });
  }
}
