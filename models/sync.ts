import Auth from "models/auth";
import { User, Cart } from "models/model";

export default async function syncPostgresDataBase() {
	try {
		console.log("Iniciando la sincronización de la base de datos...");

		await Auth.sync({ force: true });
		console.log("Tabla Auth sincronizada.");

		await User.sync({ force: true });
		console.log("Tabla User sincronizada.");

		await Cart.sync({ force: true });
		console.log("Tabla Cart sincronizada.");

		return { message: "Database synced successfully" };
	} catch (e) {
		console.error("Error syncing database:", e);
		throw new Error("Error syncing database: " + e);
	}
}
