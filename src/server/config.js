const port  = process.env.PORT || 5000
const envName = process.env.NODE_ENV
const env = {
	development: !envName || envName === 'development',
	production: envName === 'production'
}

module.exports = {
	env: env,

	server: {
		host: '0.0.0.0',
		port: port,

		debug: { request: ['error'] }
	}
}