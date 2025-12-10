import { getProducts } from "controllers/products";

//este endpoint no esta en el ejercicio pero es util para buscar todos los productos de la db
export async function GET(req: Request) {
  try {
    const response = await getProducts();
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }), { status: 400 });
  }
}
