import mongoose, { Schema, Document, Types } from "mongoose";

//Crear interface para el Token
export interface IToken extends Document {
	token: string;
	userId: Types.ObjectId;
	createAt: Date;
}

//Crear esquema para el Token

const tokenSchema: Schema = new Schema({
	token: {
		type: String,
		required: true,
	},
	userId: {
		type: Types.ObjectId,
		required: true,
		ref: "User",
	},
	createAt: {
		type: Date,
		default: Date.now,
		expires: "10m",
	},
});

//Exportar el modelo Token

const Token = mongoose.model<IToken>("Token", tokenSchema);

export default Token;
