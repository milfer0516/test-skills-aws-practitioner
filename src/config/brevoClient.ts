import * as Brevo from "@getbrevo/brevo";
import configBrevo from "../utils/brevoConfig";

// Instancia la API de correos transaccionales
export function createBrevoClient(): Brevo.TransactionalEmailsApi {
	if (!configBrevo) {
		throw new Error(
			"La BREVO_API_KEY no esta definidad en las variables de entorno"
		);
	}

	const apiInstanceBrevo = new Brevo.TransactionalEmailsApi();
	apiInstanceBrevo.setApiKey(
		Brevo.TransactionalEmailsApiApiKeys.apiKey,
		configBrevo.apiKey
	);
	return apiInstanceBrevo;
}
