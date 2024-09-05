import { createBrevoClient } from "../config/brevoClient";

export class AuthEmail {
	static async sendConfirmationEmail(
		email: string,
		token: string,
		username: string
	): Promise<void> {
		const emailData = {
			sender: { email: "milfer16@gmail.com" },
			subject: "Skills-Practitioner - Confirma tu cuenta",
			to: [{ email }],
			htmlContent: `
                <html>
                <body>
                    <h1>Hola! ${username}</h1>
                    <p>Gracias por registrarte en Skills-Practitioner. Este es tu token de confirmación: ${token}</p>
                    <p>Si no has solicitado esta cuenta, no es necesario responder a este mensaje.</p>
                </body>
                </html>
            `,
		};
		try {
			const brevoClient = createBrevoClient();
			const response = await brevoClient.sendTransacEmail(emailData);
			console.log(
				"Email de confirmación enviado exitosamente:",
				response.body.messageIds
			);
		} catch (error) {
			if (error.response) {
				// Error de respuesta HTTP
				console.error("Error en la respuesta HTTP:", error.response.body);
			} else {
				// Otro tipo de error
				console.error(
					"Error al enviar el email de confirmación:",
					error.message
				);
			}
			throw error;
		}
	}
}
