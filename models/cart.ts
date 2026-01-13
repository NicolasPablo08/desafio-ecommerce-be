import { sequelize } from "lib/connections/sequelize";
import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	Op,
} from "sequelize";
import { nanoid } from "nanoid";
import { get } from "http";

//interface AuthAttributes y los declares solo son nesesarios para que ts no indique errores de tipos
export default class Cart extends Model<
	InferAttributes<Cart>,
	InferCreationAttributes<Cart>
> {
	declare id: string;
	declare userId: string;
	declare productId: string;
	declare quantity: number;
	declare status: string;
	declare orderId: string;
	declare UrlPayment: string | null;

	static async createCartId(userId: string) {
		// @ts-ignore
		const productsNew = await Cart.findOne({
			where: { status: "new", userId },
		});
		if (productsNew) {
			return productsNew.orderId;
		} else {
			return nanoid(5);
		}
	}
	static async addProductToCart(
		userId: string,
		productId: string,
		quantity: number
	) {
		const id = nanoid(10);
		try {
			const orderId = await Cart.createCartId(userId);
			// @ts-ignore
			const productCart = await Cart.findOne({
				where: { userId, productId, status: "new" },
			});
			if (!productCart) {
				const newProductToCart = await Cart.create({
					id,
					userId,
					productId,
					quantity,
					status: "new",
					orderId,
				});
			} else {
				const updatedQuantity = await Cart.update(
					{ quantity: productCart.quantity + quantity },
					{ where: { userId, productId, status: "new", orderId } }
				);
			}
			return { message: "Product added to cart" };
		} catch (e) {
			throw new Error(
				`Error add product to cart from addProductToCart of model Cart: ${e.message}`
			);
		}
	}
	static async deleteProductFromCart(userId: string, productId: string) {
		try {
			// @ts-ignore
			const productCart = await Cart.findOne({
				where: { userId, productId, status: "new" },
			});
			if (!productCart) {
				return { message: "Product not found in cart" };
			}
			if (productCart.quantity === 1) {
				await Cart.destroy({
					where: { userId, productId, status: "new" },
				});
			} else {
				await Cart.update(
					{ quantity: productCart.quantity - 1 },
					{ where: { userId, productId, status: "new" } }
				);
			}
			return { message: "Product deleted from cart" };
		} catch (e) {
			throw new Error(
				`Error to delete product from cart from deleteProductFromCart of model Cart: ${e.message}`
			);
		}
	}
	static async getNewCart(userId: string) {
		try {
			const cart = await Cart.findAll({ where: { userId, status: "new" } });
			return cart;
		} catch (e) {
			throw new Error(
				`Error to obtain products from cart from getNewCart of model Cart: ${e.message}`
			);
		}
	}
	static async getOldsCarts(userId: string) {
		try {
			// @ts-ignore
			const carts = await Cart.findAll({
				where: {
					userId,
					status: {
						[Op.or]: ["pending", "finished"], // Usando Op.or para busqueda de múltiples estados
					},
				},
			});
			return carts;
		} catch (e) {
			throw new Error(
				`Error to obtain products from olds cart from getOldsCarts of model Cart: ${e.message}`
			);
		}
	}
	static async getCartById(orderId: string) {
		try {
			const response = await Cart.findAll({ where: { orderId } });
			return response;
		} catch (e) {
			throw new Error(
				`Error to obtain products from cart from getCartById of model Cart: ${e.message}`
			);
		}
	}
	static async updatedStatus(cartId: string, status: string) {
		try {
			await Cart.update({ status }, { where: { orderId: cartId } });
			return { message: "Status updated" };
		} catch (e) {
			throw new Error(
				`Error to update status from updatedStatus of model Cart: ${e.message}`
			);
		}
	}
}
Cart.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		userId: DataTypes.STRING,
		productId: DataTypes.STRING,
		quantity: DataTypes.INTEGER,
		status: DataTypes.STRING,
		orderId: DataTypes.STRING,
		UrlPayment: DataTypes.STRING,
	},
	{ sequelize, modelName: "cart" }
);
