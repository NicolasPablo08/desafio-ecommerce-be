import User from "models/user";
import Transaction from "models/transaction";

User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "userId" });

export { User, Transaction };
