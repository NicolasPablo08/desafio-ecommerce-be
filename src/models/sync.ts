import Auth from "src/models/auth";
import { User } from "src/models/model";
import { Transaction } from "src/models/model";

export default async function syncPostgresDataBase() {
  try {
    // await Auth.sync({ force: true });
    // await User.sync({ force: true });
    // await Transaction.sync({ force: true });
    return { message: "Database synced successfully" };
  } catch (e) {
    throw new Error("Error syncing database: " + e);
  }
}
