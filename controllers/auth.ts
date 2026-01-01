import Auth from "models/auth";
import { User } from "models/model";
import { addMinutes, isAfter } from "date-fns";
import { sendCodeToEmail } from "lib/sendGrid";
import { generateToken } from "lib/jwt";

export function generateCode() {
	return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
}

export function addMinutesToDate() {
	return addMinutes(new Date(), 20);
}

export async function findOrCreateAuth(email: string) {
	try {
		const clearEmail = email.trim().toLowerCase();
		// 1) Buscar Auth
		const auth = await Auth.findAuthByEmail(email);

		// 2) Si no existe, crear user + auth
		if (!auth) {
			const newUser = await User.createUser(clearEmail);
			if (!newUser)
				throw new Error(
					"Error creating user from findOrCreateAuth of auth controller"
				);
			const userId = await newUser.id;

			const newAuth = await Auth.createAuth(clearEmail, userId);
		}
		// 3) Generar código
		const code = generateCode();
		const codeExpires = addMinutesToDate();

		// 4) Guardar antes de enviar email
		const updated = await Auth.updateAuth(code, codeExpires, clearEmail);
		if (!updated) throw new Error("Error updating auth with new code");

		// 5) Enviar el código
		const sendCode = await sendCodeToEmail(clearEmail, code);
		if (!sendCode)
			throw new Error(
				"Error sending email from findOrCreateAuth of auth controller"
			);

		return { message: "Un código ha sido enviado a tu email." };
	} catch (e) {
		throw new Error(
			`Error in findOrCreateAuth from controller Auth: ${e.message}`
		);
	}
}

export async function getToken(email: string, code: number) {
	try {
		const clearEmail = email.trim().toLowerCase();

		// 1) Buscar auth
		const auth = await Auth.findAuthByEmail(clearEmail);

		if (!auth)
			throw new Error("Error: Auth not found from getToken of auth controller");
		// 2) Validar código

		if (code !== auth.code)
			throw new Error("Error: invalid code from getToken of auth controller");
		const now = new Date();
		const expiredDate = auth.codeExpires;
		//da true si ya expiró por lo tanto false siginifica que no expiró
		console.log("ahora", now, "expire", expiredDate);

		const isCodeVigent = isAfter(expiredDate, now);
		console.log("isCodeVigent", isCodeVigent);
		if (!isCodeVigent) throw new Error("Code expired");

		// 3) Generar token
		console.log("userId for token", auth.userId);
		const token = generateToken(auth.userId);

		if (!token)
			throw new Error(
				"Error generating token from getToken of auth controller"
			);
		//4) damos de baja el código para que no pueda ser reutilizado
		const obsoletCode = null;
		const obsoletCodeEpires = null;
		await Auth.updateAuth(obsoletCode, obsoletCodeEpires, clearEmail);
		return { token };
	} catch (e) {
		throw new Error(`Error in getToken from controller Auth: ${e.message}`);
	}
}
