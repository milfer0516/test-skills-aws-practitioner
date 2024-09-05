import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
	username: string;
	password: string;
	email: string;
	confirmed: boolean;
}

const userSchema: Schema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true,
	},
	confirmed: {
		type: Boolean,
		default: false,
	},
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
