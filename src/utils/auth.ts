import bcrypt from "bcrypt";

//Crear funcion para encriptar el password
export const encryptPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};
