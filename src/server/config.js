const GlobalConfig = require("../../config");

const port = process.env.PORT || 5000;

module.exports = {
	env: GlobalConfig.env,

	server: {
		host: "0.0.0.0",
		port: port,

		debug: { request: ["error"] }
	},

	delivery: {
		dist: GlobalConfig.paths.dist
	}
};
