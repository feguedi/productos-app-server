const { token } = require('@hapi/jwt')
const _ = require('underscore')
const Usuario = require('../models/Usuario')

exports.jwtStrategy = {
    keys: {
        key: process.env.SECRET_KEY,
        algorithms: 'ES512',
    },
    verify: {
        exp: true,
        maxAgeSec: 14400,
        timeSkewSec: 15,
        aud: ['urn:audience:test'],
        iss: 'urn:issuer:test',
        sub: false,
    },
    async validate (artifacts, request, h) {
        const usuarioBD = await Usuario.findById(artifacts.decoded.payload.id)
        if (!usuarioBD) {
            return {
                isValid: false,
                credentials: null,
            }
        }

        usuarioBD['scope'] = usuarioBD.grupo

        return {
            isValid: true,
            credentials: usuarioBD,
        }
    },
}

exports.crearToken = ({ id, nombre, grupo }) => token.generate(
    {
        id,
        user: nombre,
        group: grupo,
    },
    {
        key: process.env.SECRET_KEY,
        algorithm: 'ES512',
    },
    {
        typ: 'JWT',
        ttlSec: 14400 * 432, // 3 días
        now: Date.now(),
    }
)

exports.cookieStrategy = {
    cookie: {
        name: 'sid',
        password: process.env.COOKIE_KEY,
        isSecure: process.env.NODE_ENV === 'production',
        ttl: 259200000,
    },
    async validateFunc (request, session) {
        const usuarioBD = await Usuario.findById(session.id, 'id nombre correoElectronico grupo')
        if (!usuarioBD) {
            return { valid: false }
        }

        const usuario = _.pick(usuarioBD, ['id', 'nombre', 'correoElectronico'])
        usuario['scope'] = usuarioBD.grupo

        return { valid: true, credentials: usuario }
    }
}
