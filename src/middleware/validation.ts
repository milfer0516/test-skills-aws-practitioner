import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
// Generar funcion que maneje las validaciones

export const handleInputErrors = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Obtener los resultados de validación
	const errors = validationResult(req);

	// Si hay errores, responder con status 400 y los errores
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Si no hay errores, pasar al siguiente middleware
	next();
};
