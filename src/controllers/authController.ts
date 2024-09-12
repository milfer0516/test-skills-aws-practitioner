import type { Request, Response } from "express";
import User from "../models/UserModel";
import { comparePassword, encryptPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/generateToken";
import { AuthEmail } from "../emails/AuthEmails";
import { IEmailData } from "../utils/emailInterface";
import { compareSync } from "bcrypt";

export class AuthController {
	// Implement methods for authentication and authorization
	// Example: login, register, verifyToken, etc.
	static createAccount = async (req: Request, res: Response) => {
		try {
			const { username, password, email } = req.body;
			const user = new User({ username, email });

			//Verificar si el usuario ya existe
			const userExists = await User.findOne({ email });
			if (userExists) {
				return res
					.status(409)
					.json({ error: "El usuario ya se encuentra registrado." });
			}
			// Hashear el password antes de guardar el usuario
			user.password = await encryptPassword(password);

			// Generamos el token en el modelo
			const token = new Token();
			token.token = generateToken();
			token.userId = user.id;

			const emailData: IEmailData = {
				email: user.email,
				username: user.username,
				token: token.token,
			};

			// Enviar correo de confirmación al usuario para confirmar la cuenta
			await AuthEmail.sendConfirmationEmail(emailData);

			/* await user.save();
			await token.save(); => de esta se puede hacer pero su performance
			no seria bueno*/
			await Promise.allSettled([await user.save(), await token.save()]);
			res
				.status(201)
				.send("Cuenta creada con éxito! Revisa tu email para confirmarla");
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Error al crear la cuenta" });
		}
	};
	static async confirmAccount(req: Request, res: Response) {
		try {
			// Se extrae el token del body
			const { token } = req.body;

			// Se consulta en DB si el token existe
			const tokenExists = await Token.findOne({ token });
			//console.log(tokenExists);
			if (!tokenExists) {
				const error = new Error("Token no válido");
				return res.status(404).json({ error: error.message });
			}

			// Se consulta en DB si el usuario correspondiente al token existe
			const user = await User.findById(tokenExists.userId);
			//console.log(user);
			// Si existe el usuario el estado de confirmed pasa a true
			user.confirmed = true;

			await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
			res.status(201).json({
				message: "Cuenta confirmada correctamente!!" 
			});
			/* if (!user) {
				const error = new Error("Token no válido");
				return res.status(401).json({ error: error.message });
			} */
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Error al crear la cuenta" });
		}
	}

	static async login(req: Request, res: Response) {
		try {
			// Se extraen los datos de login del body
			const { email, password } = req.body;

			// Se verifica si el usuario existe
			const user = await User.findOne({ email });
			if (!user) {
				const error = new Error("Usuario no se encuentra registrado¡");
				return res.status(404).json({ error: error.message });
			}

			if (!user.confirmed) {
				// Si el usuario no esta confirmado generamos un token nuevo
				const token = new Token();
				token.userId = user.id;
				token.token = generateToken();
				await token.save();

				// Se extraem los datos a enviar en el e-mail con el token
				const emailData: IEmailData = {
					email: user.email,
					username: user.username,
					token: token.token,
				};

				// Se enviar un e-mail de confirmación al usuario para confirmar la
				//cuenta
				await AuthEmail.sendConfirmationEmail(emailData);

				const error = new Error(
					"Cuenta no confirmado, hemos enviado un e-mail de confirmación"
				);
				return res.status(404).json({ error: error.message });
			}

			// Se revisa el password o contraseña cifrados
			const isPasswordCorrect = await comparePassword(password, user.password);
			//console.log(isPasswordCorrect);
			if (!isPasswordCorrect) {
				const error = new Error("Contraseña incorrecta");
				return res.status(401).json({ error: error.message });
			}
			res.send(`Usuario ${user.username} autenticado correctamente`);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Error al crear la cuenta" });
		}
	}
}
