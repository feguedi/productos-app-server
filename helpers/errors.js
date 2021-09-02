const Boom = require('@hapi/boom')

exports.errorHandler = (error) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(error)
    }

    if (error.isJoi) {
        const { details } = error

        const joiErr = {
            'any.required': {
                message: `El campo '${details[0].context.key}' es requerido`,
                boomStatus: 'badRequest'
            },
            'any.unknown': {
                message: '???',
                boomStatus: 'notAcceptable'
            },
            'array.base': {
                message: `'${details[0].context.key}' no es un arreglo`,
                boomStatus: 'badRequest'
            },
            'date.format': {
                message: `El formato de la fecha debe ser AAAA-MM-DD, DD-MM-AAAA, AAAA/MM/DD o DD/MM/AAAA`,
                boomStatus: 'badRequest'
            },
            'date.greater': {
                message: `${details[0].context.key} debe ser mayor que ${details[0].context.limit === 'now' ? 'la fecha y hora actual' : details[0].context.limit}`,
                boomStatus: 'badRequest'
            },
            'date.ref': {
                message: `Internal Server Error`,
                boomStatus: 'badImplementation'
            },
            'date.base': {
                message: `${details[0].context.key} debe ser una fecha válida`,
                boomStatus: 'badRequest'
            },
            'boolean.base': {
                message: `'${details[0].context.key}' debe ser un valor booleano`,
                boomStatus: 'badRequest'
            },
            'object.base': {
                message: `'${details[0].context.key}' debe ser un objeto`,
                boomStatus: 'notAcceptable'
            },
            'object.schema': {
                message: `'${details[0].context.key}' debe ser de tipo ${details[0].context.type}`,
                boomStatus: 'notAcceptable'
            },
            'string.empty': {
                message: `El campo '${details[0].context.key}' está vacío`,
                boomStatus: 'badRequest'
            },
            'string.alphanum': {
                message: `'${details[0].context.key}' solo debe contener caracteres alfanuméricos`,
                boomStatus: 'badRequest'
            },
            'string.base': {
                message: `'${details[0].context.key}' no es un string`,
                boomStatus: 'badRequest'
            },
            'string.email': {
                message: `'${details[0].context.key}' no tiene un formato de correo electrónico`,
                boomStatus: 'badRequest'
            },
            'string.email': {
                message: `'${details[0].context.key}' no tiene un formato de correo electrónico`,
                boomStatus: 'badRequest'
            },
            'string.length': {
                message: `${details[0].context.key} debe ser de ${details[0].context.limit} caracteres`,
                boomStatus: 'badRequest'
            },
            'string.min': {
                message: `${details[0].context.key} debe ser de al menos ${details[0].context.limit} caracteres`,
                boomStatus: 'badRequest'
            },
            'string.max': {
                message: `${details[0].context.key} no debe pasar de ${details[0].context.limit} caracteres`,
                boomStatus: 'badRequest'
            },
            'string.pattern.base': {
                message: `${details[0].context.key} no está en un formato correcto`,
                boomStatus: 'badRequest'
            },
            'number.base': {
                message: '???',
                boomStatus: 'notAcceptable'
            },
            'number.infinity': {
                message: '???',
                boomStatus: 'notAcceptable'
            },
            'number.integer': {
                message: `'${details[0].context.key}' debe ser un número entero`,
                boomStatus: 'notAcceptable'
            },
            'number.min': {
                message: `'${details[0].context.key}' debe ser un número de ${String(details[0].context.limit).length} dígitos`,
                boomStatus: 'notAcceptable'
            },
            'number.greater': {
                message: `'${details[0].context.key}' es un número grande`,
                boomStatus: 'notAcceptable'
            },
            'number.ref': {
                message: `Internal Server Error`,
                boomStatus: 'badImplementation'
            },
            'object.unknown': {
                message: `${details[0].context.key} no está permitido`,
                boomStatus: 'badRequest'
            },
        }

        const customErr = joiErr[details[0].type]

        throw Boom[customErr.boomStatus](customErr.message) || Boom.badRequest(customErr.message)
    }

    if (error.name === 'ValidationError') {
        const errores = Object.keys(error.errors).map(key => error.errors[key].message)
        throw Boom.badRequest(errores.join(', '))
    }

    if (Boom.isBoom(error)) {
        throw error
    }

    throw new Boom.Boom(error)
}
