const Hapi = require('hapi')
const Invariant = require('invariant')

exports.create = (config, callback) => {
	const server = new Hapi.Server({
		app: {
			config
		},

		debug: config.server.debug 
	})

	const connection = server.connection({
		host: config.server.host,
		port: config.server.port,

		labels: ['delivery']
	})

	// make config of server globally available
	server.bind({
		config
	})

	server.register([

	], (err) => {
		// can't recover from any of this, so blow up
		Invariant(!err, `Failed to load plugin: ${err}`)

		server.start(() => {
			callback(err, server)
		})
	})
}