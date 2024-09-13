import { CorsOptions } from "cors";
import dotenv from "dotenv";

dotenv.config();

export const corsOptions: CorsOptions = {
	origin: function (origin, callback) {
		//console.log(process.argv[2]);

		const whitelist = [process.env.URL_FRONTEND_PRODUCCION];

		if (process.argv[2] === "--api") whitelist.push(undefined);

		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
			return;
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
};
