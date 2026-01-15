import User from "models/user";
import Cart from "models/cart";

User.hasMany(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

export { User, Cart };
