const Path = require("path");

module.exports = {
	paths: {
		src: Path.join(__dirname, "src"),
		dist: Path.join(__dirname, "dist"),

		game: {
			assets: Path.join(__dirname, "src", "game", "assets")
		}
	}
};
