import { Router } from "express";
import { body } from "express-validator";
// Importar controladores
import { AuthController } from "../controllers/authController";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

// POST Ruta de registro de usuarios
router.post(
	"/create-account",
	[
		body("username").notEmpty().withMessage("El nombre no debe ir vacio"),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Longitud del password debe tener minimo 6 caracteres"),
		body("password_confirmation").custom((value, { req }) => {
			/* console.log(req.body.password);
			console.log(value); */
			if (value !== req.body.password) {
				throw new Error("Las contraseñas no son iguales");
			}
			return true;
		}),
		body("email").isEmail().withMessage("E-mail o Correo no válido"),
	],
	handleInputErrors,
	AuthController.createAccount
);

// POST Ruta para confirmar cuenta
router.post('/confirm-account', 
	[
        body('token')
			.notEmpty().withMessage('Token de confirmación no puede estar vacío'),
	],
    handleInputErrors,
	AuthController.confirmAccount
)

// POST Ruta para loguear o Iniciode Sesion
router.post(
	"/login",
	[
		body("email").isEmail().withMessage("E-mail o Correo no válido"),
		body("password")
			.notEmpty().withMessage("Password no puede ir vacio"),
	],
	handleInputErrors,
	AuthController.login
);
// Exportar
export default router;
