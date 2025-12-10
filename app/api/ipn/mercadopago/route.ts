import { getPaymentById, WebhokPayload } from "lib/mercadopago";
import { confirmPurchase } from "controllers/transaction";

export async function POST(request: Request, { params }) {
  try {
    const body: WebhokPayload = await request.json();
    console.log("Webhook received", body);

    if (body.type === "payment") {
      const mpPayment = await getPaymentById(body.data.id);
      console.log("mpPayment data:", mpPayment);
      console.log("Payment status:", mpPayment.status);

      if (mpPayment.status === "approved") {
        console.log(`Payment ${mpPayment.id} approved`);
        const purchaseId = mpPayment.external_reference;
        console.log("purchaseId", purchaseId);

        await confirmPurchase(purchaseId);
      }
    }

    //   Se le responde a MP siempre (si o si) para que no vuelva a llamar a este endpoint
    //   con el mismo pago, aunque puede suceder
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }), { status: 400 });
  }
}
