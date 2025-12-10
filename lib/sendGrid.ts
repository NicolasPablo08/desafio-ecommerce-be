import * as sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export async function sendCodeToEmail(email: string, code: number) {
  console.log({ email, code });

  const msg = {
    to: email,
    from: process.env.SENDGRID_EMAIL,
    subject: "Codigo de autenticacion",
    text: "El codigo de autenticacion es: " + code,
  };
  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function sendConfirmedPaymentToEmail(email: string, purchaseId: string) {
  const msg = {
    to: email,
    from: process.env.SENDGRID_EMAIL,
    subject: "Compra confirmada",
    text: "Tu pago fue aprobado, el codigo de transaccion es: " + purchaseId,
  };
  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
