import { sequelize } from "lib/connections/sequelize";
import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
} from "sequelize";
import random from "random-string-alphanumeric-generator";

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

	static async findAllByUserId(userId: string) {
		// @ts-ignore
		const cart = await Cart.findAll({ where: { userId } });
		if (cart) {
			return cart;
		}
		return [];
	}

	static async addProductToCart(userId: string, productId: string) {
		const id = random.randomAlphanumeric(10);

		// @ts-ignore
		const productCart = await Cart.findOne({ where: { userId, productId } });
		if (!productCart) {
			const newProductToCart = await Cart.create({
				id,
				userId,
				productId,
				quantity: 1,
				status: "pending",
			});
		} else {
			const updatedQuantity = await Cart.update(
				{ quantity: productCart.quantity + 1 },
				{ where: { userId, productId } }
			);
		}
		return true;
	}
	static async deleteProductFromCart(userId: string, productId: string) {
		// @ts-ignore
		const productCart = await Cart.findOne({ where: { userId, productId } });
		if (productCart.quantity === 1) {
			await Cart.destroy({
				where: { userId, productId },
			});
		} else {
			await Cart.update(
				{ quantity: productCart.quantity - 1 },
				{ where: { userId, productId } }
			);
		}
		return true;
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
	},
	{ sequelize, modelName: "cart" }
);
