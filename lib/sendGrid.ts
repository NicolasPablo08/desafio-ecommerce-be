import { apiInstance, brevo } from "lib/connections/brevo-email";

const SENDER_EMAIL = process.env.BREVO_EMAIL;
const SENDER_NAME = "e-commerce";

export async function sendCodeToEmail(email: string, code: number) {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "Código de autenticación e-commerce";
  sendSmtpEmail.htmlContent = `
    <html>
      <body style="font-family: sans-serif;">
        <h2>Tu código de acceso</h2>
        <p>El código de autenticación es: <strong>${code}</strong></p>
      </body>
    </html>`;
  sendSmtpEmail.sender = { email: SENDER_EMAIL, name: SENDER_NAME };
  sendSmtpEmail.to = [{ email }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return !!data.body.messageId;
  } catch (error) {
    console.error("Error enviando código con Brevo:", error);
    return false;
  }
}

export async function sendConfirmedPaymentToEmail(email: string, purchaseId: string) {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "Compra confirmada";
  sendSmtpEmail.htmlContent = `
    <html>
      <body style="font-family: sans-serif;">
        <h2>¡Gracias por tu compra!</h2>
        <p>Tu pago fue aprobado.</p>
        <p>El código de transacción es: <strong>${purchaseId}</strong></p>
      </body>
    </html>`;
  sendSmtpEmail.sender = { email: SENDER_EMAIL, name: SENDER_NAME };
  sendSmtpEmail.to = [{ email }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return !!data.body.messageId;
  } catch (error) {
    console.error("Error enviando confirmación con Brevo:", error);
    return false;
  }
}

// import * as sgMail from "@sendgrid/mail";
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// export async function sendCodeToEmail(email: string, code: number) {
// 	const msg = {
// 		to: email,
// 		from: {
// 			email: process.env.SENDGRID_EMAIL,
// 			name: "e-commerce",
// 		},
// 		subject: "Codigo de autenticacion e-commerce",
// 		html: `<strong>El código de autenticación es: ${code}</strong>`,
// 	};
// 	try {
// 		const [response] = await sgMail.send(msg);
// 		return response.statusCode === 202;
// 	} catch (error) {
// 		console.error("Error en sendgrid", error);
// 		return false;
// 	}
// }

// export async function sendConfirmedPaymentToEmail(
// 	email: string,
// 	purchaseId: string
// ) {
// 	const msg = {
// 		to: email,
// 		from: {
// 			email: process.env.SENDGRID_EMAIL,
// 			name: "e-commerce",
// 		},
// 		subject: "Compra confirmada",
// 		html: `<strong>Tu pago fue aprobado, el codigo de transaccion es: ${purchaseId}</strong>`,
// 	};
// 	try {
// 		const [response] = await sgMail.send(msg);
// 		return response.statusCode === 202;
// 	} catch (error) {
// 		console.error("Error en sendgrid", error);
// 		return false;
// 	}
// }
