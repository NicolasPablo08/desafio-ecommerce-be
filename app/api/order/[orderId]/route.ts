import { getOrderById } from "controllers/transaction";
import { authMiddleware } from "middlewares";
import * as yup from "yup";
import { corsHeaders, handleOptions } from "lib/cors";

//para el manejo de cors y no tener problemas
// cuando el back es llamado desde el front ubicado en otro servidor
//agregar headers:corsHeaders en la respuestas al front
export async function OPTIONS() {
  return handleOptions();
}

//ver si es necesario el middleware para obtener una orden de un usuario
//o no es necesaario el middleware y podemos obtener cualquier orden que este en la db
// export async function GET(req: Request, { params }: { params: { orderId: string } }) {
//   try {
//     const param = await params;
//     const { orderId } = param;
//     if (!orderId) {
//       return new Response(JSON.stringify({ message: "Error, orderId query is required" }), {
//         status: 400,
//       });
//     }
//     const response = await getOrderById(orderId); //hay que modificar getOrderById para que busque solo con el orderId y sin el userId
//     return new Response(JSON.stringify(response), { status: 200 });
//   } catch (e) {
//     return new Response(JSON.stringify({ message: e.message }), { status: 400 });
//   }
// }

const querySchema = yup.object().shape({
  //espera un objeto
  orderId: yup.string().required(),
});

export const GET = authMiddleware(handler);

async function handler(req: Request, userId: string) {
  // Extraer params de la URL
  const url = new URL(req.url);
  const pathname = url.pathname; // "api/order/1a2B3C4d5"
  const parts = pathname.split("/"); // ["", "api", "order", "1a2B3C4d5"]
  const orderId = parts[3]; // "1a2B3C4d5"
  try {
    await querySchema.validate({ orderId });
  } catch (e) {
    return new Response(JSON.stringify({ field: "query", message: e.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
  try {
    const response = await getOrderById(orderId, userId);
    return new Response(JSON.stringify(response), { status: 200, headers: corsHeaders });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
}
