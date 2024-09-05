import dotenv from "dotenv";

dotenv.config();

interface BrevoConfig {
	apiKey: string;
}

const configBrevo: BrevoConfig = {
	apiKey: process.env.BREVO_API_KEY || "",
};

export default configBrevo;
