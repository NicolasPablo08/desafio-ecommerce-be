import User from "src/models/user";
import Transaction from "src/models/transaction";

User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "userId" });

export { User, Transaction };
