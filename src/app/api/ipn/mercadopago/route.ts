import { getPaymentById, WebhokPayload } from "src/lib/mercadopago";
import { confirmPurchase } from "src/controllers/transaction";

export async function POST(request: Request, { params }) {
  try {
    const body: WebhokPayload = await request.json();
    console.log("Webhook received", body);

    if (body.type === "payment") {
      const mpPayment = await getPaymentById(body.data.id);
      if (mpPayment.status === "approved") {
        console.log(`Payment ${mpPayment.id} approved`);
        const purchaseId = mpPayment.external_reference;
        console.log("purchaseId", purchaseId);

        await confirmPurchase(purchaseId);
      }
    }

    //   Se le responde a MP siempre (si o si) para que no vuelva a llamar a este endpoint
    //   con el mismo pago, aunque puede suceder
    return Response.json({ received: true });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }), { status: 400 });
  }
}
