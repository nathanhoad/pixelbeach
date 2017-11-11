const Invariant = require('invariant')

const Server = require('./server')
const Config = require('./config')

Server.create(Config, (err, server) => {
	Invariant(!err, `Failed to create server: ${err}`)

	console.log(`Server listening at http://${server.info.host}:${server.info.port}`)
})