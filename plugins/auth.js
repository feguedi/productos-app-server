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
        maxAgeSec: 14400 * 432, // 3 días
        timeSkewSec: 15,
        nbf: true,
        aud: false,
        iss: false,
        sub: false,
    },
    async validate (artifacts, request, h) {
        const usuarioBD = await Usuario.findById(artifacts.decoded.payload.id, 'id nombre correoElectronico grupo')
        if (!usuarioBD) {
            return {
                isValid: false,
                credentials: null,
            }
        }

        usuarioBD['scope'] = usuarioBD.grupo
        usuarioBD['token'] = artifacts.token

        return {
            isValid: true,
            credentials: usuarioBD,
        }
    },
}

exports.crearToken = id => {
    try {
        const tokenNuevo = token.generate(
            {
                id,
            },
            {
                key: process.env.SECRET_KEY,
                algorithm: 'HS512',
            },
            {
                iat: Date.now(),
                typ: 'JWT',
                exp: '7d',
            }
        )

        return tokenNuevo
    } catch (error) {
        console.error(error)
        throw new Error('No se pudo crear el token')
    }
}

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
