import Auth from "models/auth";
import { User, Transaction, Cart } from "models/model";

export default async function syncPostgresDataBase() {
	try {
		// await Auth.sync({ force: true });
		// await User.sync({ force: true });
		// await Transaction.sync({ force: true });
		// await Cart.sync({ force: true });

		return { message: "Database synced successfully" };
	} catch (e) {
		throw new Error("Error syncing database: " + e);
	}
}
