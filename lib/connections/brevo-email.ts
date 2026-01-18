import * as brevo from "@getbrevo/brevo";

// Configuración de la API Key
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string,
);

export { apiInstance, brevo };
