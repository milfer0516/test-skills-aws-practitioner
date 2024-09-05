import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
	origin: function (origin, callback) {
		//console.log(process.argv[2]);

		const whitelist = [process.env.URL_FRONTEND];

		if (process.argv[2] === "--api") {
			whitelist.push(undefined);
		}
		if (whitelist.includes(origin)) {
			callback(null, true);
			return;
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
};
