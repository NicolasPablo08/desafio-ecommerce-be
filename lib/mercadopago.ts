// Step 1: Import the parts of the module you want to use
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

// Step 2: Initialize the client object
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_TOKEN as string,
});
// options: { timeout: 5000, idempotencyKey: "abc" },

const BASE_URL = process.env.VERCEL_URL || "apx.school";

// Step 3: Initialize the API object
const pref = new Preference(client);

type Product = {
  name: string;
  description: string;
  objectID: string;
  amount: number;
  quantity: number;
};

type CreatePrefOptions = {
  products: Product[]; // Cambiamos a un array de productos
  transactionId: string;
};
// recibimos data más generica en esta función
// para abstraer al resto del sistema
// de los detalles de mercado pago
// esto nos permitirá hacer cambios dentro de esta librería
// sin tener que modificar el resto del sistema
export async function createSingleProductPreference(options: CreatePrefOptions) {
  // Todas las opciones en
  // https://www.mercadopago.com.ar/developers/es/reference/preferences/_checkout_preferences/post
  console.log(options);

  return pref.create({
    body: {
      items: options.products.map((p) => ({
        id: p.objectID,
        title: p.name,
        description: p.description,
        quantity: p.quantity,
        currency_id: "ARS",
        unit_price: p.amount,
      })),

      // URL de redirección en los distintos casos
      back_urls: {
        success: "https://" + BASE_URL + "/donate/success",
        failure: "https://" + BASE_URL + "/donate/failure",
        pending: "https://" + BASE_URL + "/donate/pending",
      },
      // Esto puede ser el id o algún otro identificador
      // que te ayude a vincular este pago con el producto más adelante
      external_reference: options.transactionId,
    },
  });
}

export async function getPaymentById(id: string) {
  try {
    const payment = new Payment(client);
    return payment.get({ id });
  } catch (e) {
    throw new Error(`Error to crete payment from getPayment of mercadopago/lib: ${e.message}`);
  }
}

export type WebhokPayload = {
  action: string;
  api_version: string;
  data: {
    id: string;
  };
  date_created: string;
  id: number;
  live_mode: boolean;
  type: string;
  user_id: string;
  amount: number;
};
