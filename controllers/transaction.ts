"use server";
import { User } from "models/model";
import { getProductsFromNewCart } from "controllers/products";
import { createSingleProductPreference } from "lib/mercadopago";
import { sendConfirmedPaymentToEmail } from "lib/sendGrid";
import { airtableBase } from "lib/connections/airtable";
import { client } from "lib/connections/algolia";
import Cart from "models/cart";

const indexName = "products"; // nombre del indice en algolia

// funcion para actualizar el quantity de los productos en algolia y airtable
async function updateStockInAlgoliaAndAirtable(
	productName: string,
	productId: string,
	quantity: number
) {
	try {
		const productAlgolia = await client.getObject({
			indexName,
			objectID: productId,
		});
		if (!productAlgolia)
			throw new Error(
				"Error: product not found from updateStockInAlgoliaAndAirtable of transaction controller"
			);
		const updatedAlgolia = await client.partialUpdateObject({
			indexName,
			objectID: productId,
			attributesToUpdate: {
				stock: {
					_operation: "Decrement",
					value: quantity,
				},
			},
		});
		const records = await airtableBase("products")
			.select({
				filterByFormula: `{name} = "${productName}"`,
			})
			.firstPage();
		const updatedAirtable = await airtableBase("Products").update([
			{
				id: records[0].id,
				fields: {
					Stock: Number(productAlgolia.stock) - quantity,
				},
			},
		]);
	} catch (e) {
		throw new Error(
			`Error to update stock in algolia and airtable from updateStockInAlgoliaAndAirtable of transaction controller: ${e.message}`
		);
	}
}

export async function createOrder(cartId: string, userId: string) {
	try {
		const searchCart = await Cart.getCartById(cartId);
		if (!searchCart)
			throw new Error(
				"Error: cart not found from createOrder of transaction controller"
			);
		const products = await getProductsFromNewCart(userId);
		if (!products)
			throw new Error(
				"Error: products not found from createOrder of transaction controller"
			);
		const newPref = await createSingleProductPreference({
			products,
			transactionId: cartId,
		});
		return newPref;
	} catch (e) {
		throw new Error(
			`Error creating order from createOrder of transaction controller: ${e.message}`
		);
	}
}

//confirmamos la transaction y la pasamos a approbed
export async function confirmPurchase(orderId: string, status: string) {
	// confirmamos la compra en la DB cambiando el status
	try {
		const confirmTransaction = await Cart.updatedStatus(orderId, status);
		if (!confirmTransaction)
			throw new Error(
				"Error: could not confirm transaction from confirmPurchase of transaction controller"
			);

		//obtenemos los productos de la compra para luego actualizar las db algolia y airtable
		const cart = await Cart.getCartById(orderId);
		if (!cart)
			throw new Error(
				"Error: could not search transaction from confirmPurchase of transaction controller"
			);

		//obtenemos el usuario para enviarle un email
		const user = await User.findUserById(cart[0].userId);
		if (!user)
			throw new Error(
				"Error: could not search user from confirmPurchase of transaction controller"
			);
		//enviamos el email al usuario confirmando el pago
		const sendEmailWithConfirmedPayment = sendConfirmedPaymentToEmail(
			user.email,
			orderId
		);
		if (!sendEmailWithConfirmedPayment)
			throw new Error(
				"Error: could not sendEmailWithConfirmedPayment from confirmPurchase of transaction controller"
			);
		//avisarle al vendedor que se produjo la venta en una nuevatabla de airtable
		const createNewSale = await airtableBase("sales").create(
			cart.map((p) => ({
				fields: {
					nombre: user.name,
					apellido: user.lastName,
					direccion: user.address,
					productId: p.productId,
					cantidad: p.quantity,
					orderId: p.orderId,
					status: "new",
				},
			}))
		);
		// actualizar el quantity de los productos en algolia y airtable
		const updatedStock = await Promise.all(
			cart.map((p) => {
				return updateStockInAlgoliaAndAirtable(
					p.productName,
					p.productId,
					p.quantity
				);
			})
		);
		return true;
	} catch (e) {
		console.error("Error confirming transaction:", e);
		throw new Error(`Could not confirm transaction: ${e.message}`);
	}
}

//obtener cart por id
export async function getOrderById(orderId: string) {
	try {
		const order = await Cart.getCartById(orderId);
		return order;
	} catch (e) {
		throw new Error(
			`Error obtaining order from getOrderById of transaction controller: ${e.message}`
		);
	}
}
//////////////////////////////////////////////////////////////////////////////
// export async function getConfirmedPayments(): Promise<Purchase[]> {
//   try {
//     const transactions = await transactionsCollection.where("status", "==", "confirmed").get();
//     const purchases = transactions.docs.map((t) => ({
//       id: t.id,
//       from: t.data().name,
//       amount: parseInt(t.data().amount),
//       message: t.data().description,
//       date: t.data().timestamps,
//       status: t.data().status,
//     }));

//     return purchases;
//   } catch (error) {
//     console.error("Error fetching confirmed transactions:", error);
//     throw new Error("Could not fetch confirmed transactions");
//   }
// }

// export async function createPurchase(
//   // guardamos esta nueva purchase en la db y devolvemos el id
//   newPurchInput: Pick<Purchase, "from" | "amount" | "message">
// ): Promise<string> {
//   const purchase = {
//     ...newPurchInput,
//     date: new Date(),
//     status: "pending",
//   };
//   try {
//     const createdTransaction = await transactionsCollection.add({
//       name: purchase.from,
//       status: purchase.status,
//       description: purchase.message,
//       amount: purchase.amount,
//       timestamps: purchase.date,
//     });
//     return createdTransaction.id; // devolvemos el id o ticket de la transacción creada
//   } catch (error) {
//     console.error("Error creating transaction:", error);
//     throw new Error("Could not create transaction");
//   }
// }
