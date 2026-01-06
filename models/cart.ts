import { sequelize } from "lib/connections/sequelize";
import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import random from "random-string-alphanumeric-generator";

//interface AuthAttributes y los declares solo son nesesarios para que ts no indique errores de tipos
export default class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
  declare id: string;
  declare userId: string;
  declare productId: string;
  declare quantity: number;
  declare status: string;
  declare orderId: string;

  static async findAllByUserId(userId: string) {
    // @ts-ignore
    return (await Cart.findAll({ where: { userId } })) || [];
  }
  static async findAllByUserAndCart(userId: string, orderId: string) {
    // @ts-ignore
    return (await Cart.findAll({ where: { userId, orderId } })) || [];
  }

  static async addProductToCart(userId: string, productId: string, orderId: string) {
    const id = random.randomAlphanumeric(10);
    try {
      // @ts-ignore
      const productCart = await Cart.findOne({ where: { userId, productId, orderId } });
      if (!productCart) {
        const newProductToCart = await Cart.create({
          id,
          userId,
          productId,
          quantity: 1,
          status: "pending",
          orderId,
        });
      } else {
        const updatedQuantity = await Cart.update(
          { quantity: productCart.quantity + 1 },
          { where: { userId, productId, orderId } }
        );
      }
      return true;
    } catch (e) {
      throw new Error(
        `Error add product to cart from addProductToCart of products controller: ${e.message}`
      );
    }
  }
  static async deleteProductFromCart(userId: string, productId: string, orderId: string) {
    try {
      // @ts-ignore
      const productCart = await Cart.findOne({ where: { userId, productId, cartId } });
      if (productCart.quantity === 1) {
        await Cart.destroy({
          where: { userId, productId, orderId },
        });
      } else {
        await Cart.update(
          { quantity: productCart.quantity - 1 },
          { where: { userId, productId, orderId } }
        );
      }
      return true;
    } catch (e) {
      throw new Error(
        `Error to delete product from cart from addProductToCart of products controller: ${e.message}`
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
  },
  { sequelize, modelName: "cart" }
);
