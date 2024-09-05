import { createBrevoClient } from "../config/brevoClient";

// Crear Interface 

export interface IEmail {
    email: string;
    username: string;
	token: string
}

export class AuthEmail {
	static async sendConfirmationEmail(
		user: IEmail
	): Promise<void> {
		const emailData = {
			sender: { email: "milfer16@gmail.com" },
			subject: "Skills-Practitioner - Confirma tu cuenta",
			to: [{ email: user.email }],
			htmlContent: `
                <html>
					<body>
						<h3>Hola! ${user.username}, te has registrado para poner en práctica tus habilidades para el examen Cloud Practitioner</h3>
						<p>Gracias por registrarte en Skills-Practitioner, ya casí todo esta listo, 
						solo debes confirmar tu cuenta</p>
						<p>Visita el siguiente enlace: <a href="/">Confirmar cuenta</a>
						Ingresa este código <b>${user.token}</b> </p>
						<p>Este token expíra en 10 minutos</p>
						<p>Si no has solicitado esta cuenta, no es necesario responder a este mensaje.</p>
					</body>
                </html>
            `,
		};
		try {
			const brevoClient = createBrevoClient();
			const response = await brevoClient.sendTransacEmail(emailData);
			/* console.log(
				"Email de confirmación enviado exitosamente:",
				response.body.messageIds
			); */
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
