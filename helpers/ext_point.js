const Hapi = require('@hapi/hapi')

/**
 * Checar si la petición tiene cabecera application/json o es multipart/form-data
 * @param {Hapi.Request} request Petición
 * @param {Hapi.ResponseToolkit} h Objeto Hapi
 */
const checkApplicationJsonHeader = (request, h) => {
    const authorization = request.headers['authorization' || 'Authorization']
    const xOrg = request.headers['x-org']
    const contentType = request.headers['content-type' || 'Content-Type']
    const validHeaders = ['application/json', 'application/x-www-form-urlencoded', 'text/plain']
    console.log('authorization:', authorization)
    console.log('x-org:', xOrg)
    console.log('content-type:', contentType)

    return h.continue
}

module.exports = {
    checkApplicationJsonHeader,
}
