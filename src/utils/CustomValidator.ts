import User from "../models/UserModel";

export const validEmail = (value) => {
	const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	return regexCorreo.test(value);
};

export const validUsuario = async (email) => {
	const userFound = await User.findOne({ email });

	if (userFound) {
		throw new Error("El usuario ya se encuentra registrado");
	}

	return true;
};
