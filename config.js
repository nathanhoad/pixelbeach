const Path = require("path");

const envName = process.env.NODE_ENV;
const env = {
	development: !envName || envName === "development",
	production: envName === "production"
};

module.exports = {
	env: env,

	paths: {
		src: Path.join(__dirname, "src"),
		dist: Path.join(__dirname, "dist"),

		game: {
			assets: Path.join(__dirname, "src", "game", "assets")
		}
	}
};
