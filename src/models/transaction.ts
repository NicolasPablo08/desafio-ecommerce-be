import { sequelize } from "src/lib/connections/sequelize";
import { DataTypes, Model } from "sequelize";
import random from "random-string-alphanumeric-generator";

export default class Transaction extends Model {
  declare id: string;
  declare status: string;
  declare transactionDate: Date;
  declare amount: number;
  declare productName: string;
  declare productDescription: string;
  declare productId: string;
  declare userId: string;

  static async createTransaction({ amount, productName, productDescription, productId, userId }) {
    const id = random.randomAlphanumeric(10);

    // @ts-ignore
    const newTransaction = await Transaction.create({
      id,
      status: "pending",
      transactionDate: new Date(),
      amount,
      productName,
      productDescription,
      productId,
      userId,
    });
    return newTransaction;
  }
  static async findAllTransactions(userId: string) {
    // @ts-ignore
    const transaction = await Transaction.findAll({ where: { userId } });
    if (!transaction) return { messasage: "Transactions not found" };
    return transaction;
  }
  static async findTransactionByOrderIdAndUserId(orderId: string, userId: string) {
    // @ts-ignore
    const transaction = await Transaction.findOne({ where: { id: orderId, userId } });
    if (!transaction) return { messasage: "Transaction not found" };
    return transaction;
  }
  static async findTransactionByOrderId(orderId: string) {
    // @ts-ignore
    const transaction = await Transaction.findOne({ where: { id: orderId } });
    if (!transaction) return { messasage: "Transaction not found" };
    return transaction;
  }
  static async updateStatus(orderId: string) {
    const [affectedRows] = await Transaction.update(
      { status: "approved" },
      { where: { id: orderId } }
    );
    if (affectedRows === 0) return { message: "Address update failed" };

    return true;
  }
}
Transaction.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    status: DataTypes.STRING,
    transactionDate: DataTypes.DATE,
    amount: DataTypes.FLOAT,
    productName: DataTypes.STRING,
    productDescription: DataTypes.STRING,
    productId: DataTypes.STRING,
    userId: DataTypes.STRING,
  },
  { sequelize, modelName: "transaction" }
);
