import User from "models/user";
import Transaction from "models/transaction";
import Cart from "models/cart";

User.hasMany(Transaction, { foreignKey: "userId" });
User.hasMany(Cart, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

export { User, Transaction, Cart };
