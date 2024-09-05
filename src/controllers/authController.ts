import type { Request, Response } from "express";

import User from "../models/UserModel";
import { encryptPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/generateToken";
import { AuthEmail } from "../emails/AuthEmails";

export class AuthController {
	// Implement methods for authentication and authorization
	// Example: login, register, verifyToken, etc.
	static async createAccount(req: Request, res: Response) {
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
			await AuthEmail.sendConfirmationEmail(
				user.email,
				token.token,
				user.username
			);
			/* await user.save();
			await token.save(); => de esta se puede hacer pero su performance
			no seria bueno*/
			await Promise.allSettled([await user.save(), await token.save()]);
			res.status(201).json({
				message: "Cuenta creada con éxito! Revisa tu email para confirmarla",
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Error al crear la cuenta" });
		}
	}
}
