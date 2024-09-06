import bcrypt from "bcrypt";

//Crear funcion para encriptar o cifrar el password
export const encryptPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

// Funcion vara verifcar el password cifrado o encriptado
export const comparePassword = async (
	enterPassword: string,
	hashedPassword: string
) => {
	return await bcrypt.compare(enterPassword, hashedPassword);
};
