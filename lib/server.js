require('../config')
require('../db/connection')
const Hapi = require('@hapi/hapi')
const Qs = require('qs')
const {
    jwtStrategy,
    cookieStrategy,
} = require('../plugins/auth')
const {
    checkApplicationJsonHeader,
} = require('../helpers/ext_point')

const Server = async () => {
    const server = Hapi.server({
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || 8088,
        query: {
            parser: query => Qs.parse(query)
        },
    })

    await server.register([
        require('@hapi/inert'),
        require('@hapi/cookie'),
        require('@hapi/jwt'),
    ], { once: true })

    server.auth.strategy('session', 'cookie', cookieStrategy)
    server.auth.strategy('token', 'jwt', jwtStrategy)

    server.ext('onPreResponse', checkApplicationJsonHeader)

    server.route(require('../routes'))

    return server
}

exports.start = async () => {
    try {
        const server = await Server()

        await server.start()
        console.log('Servidor corriendo en ', server.info.uri)

        return server
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
