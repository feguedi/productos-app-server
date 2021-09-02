const Boom = require('@hapi/boom')

function failAction (request, h, error) {
    if (process.env.NODE_ENV !== 'production') {
        if (error.isJoi) {
            console.error('==================')
            console.error(JSON.stringify(error, null, 2))
            console.error('==================')
        }
        throw new Boom.Boom(error)
    }
}

module.exports = {
    failAction,
}
