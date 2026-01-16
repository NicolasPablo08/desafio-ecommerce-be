import * as sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendCodeToEmail(email: string, code: number) {
	const msg = {
		to: email,
		from: {
			email: process.env.SENDGRID_EMAIL,
			name: "e-commerce",
		},
		subject: "Codigo de autenticacion e-commerce",
		html: `<strong>El código de autenticación es: ${code}</strong>`,
	};
	try {
		const [response] = await sgMail.send(msg);
		return response.statusCode === 202;
	} catch (error) {
		console.error("Error en sendgrid", error);
		return false;
	}
}

export async function sendConfirmedPaymentToEmail(
	email: string,
	purchaseId: string
) {
	const msg = {
		to: email,
		from: {
			email: process.env.SENDGRID_EMAIL,
			name: "e-commerce",
		},
		subject: "Compra confirmada",
		html: `<strong>Tu pago fue aprobado, el codigo de transaccion es: ${purchaseId}</strong>`,
	};
	try {
		const [response] = await sgMail.send(msg);
		return response.statusCode === 202;
	} catch (error) {
		console.error("Error en sendgrid", error);
		return false;
	}
}
