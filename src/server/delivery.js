const Invariant = require('invariant')
const Inert = require('inert')



exports.register = (server, options, next) => {
	server.register([
		Inert
	], (err) => {
		Invariant(!err, `Failed to load plugin: ${err}`)

		const { config } = server.settings.app

		server.route({
			method: 'GET',
			path: '/{param*}',
			handler: {
				directory: {
					path: config.delivery.dist,
					redirectToSlash: true
				}
			}
		})

		next()
	})
}

exports.register.attributes = {
	name: 'nko2017-pixelbeach-delivery',
	version: '1.0.0'
}