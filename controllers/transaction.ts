"use server";
import { Transaction, User } from "models/model";
import { getProductsFromNewCart } from "controllers/products";
import { createSingleProductPreference } from "lib/mercadopago";
import { sendConfirmedPaymentToEmail } from "lib/sendGrid";
import Cart from "models/cart";
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

		// const transaction = await Transaction.createTransaction({
		//   amount: searchProduct.amount,
		//   productName: searchProduct.name,
		//   productDescription: searchProduct.description, //no puedo guardar mas de 255 caracteres en la db
		//   productId: searchProduct.objectID,
		//   userId,
		// });

		// if (!transaction)
		//   throw new Error("Error creating order from createOrder of transaction controller");
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

export async function obtainOrders(userId: string) {
	try {
		const allMyOrders = await Transaction.findAllTransactions(userId);
		return allMyOrders;
	} catch (e) {
		throw new Error(
			`Error obtaining orders from obtainOrders of transaction controller:${e.message}`
		);
	}
}

export async function getOrderById(orderId: string, userId: string) {
	try {
		const order = await Transaction.findTransactionByOrderIdAndUserId(
			orderId,
			userId
		);
		return order;
	} catch (e) {
		throw new Error(
			`Error obtaining order from getOrderById of transaction controller: ${e.message}`
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
		const cart = await Cart.getCartById(orderId);
		if (!cart)
			throw new Error(
				"Error: could not search transaction from confirmPurchase of transaction controller"
			);
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
		//Agregar aqui un metodo para avisarle al vendedor que se produjo la venta
		//puede ser un email o un registro en Airtable.
		// console.log(`Purchase ${purchaseId} confirmed`);
		// actualizar el quantity de los productos en algolia y airtable
		return true;
	} catch (e) {
		console.error("Error confirming transaction:", e);
		throw new Error(`Could not confirm transaction: ${e.message}`);
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
