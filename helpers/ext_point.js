const Hapi = require('@hapi/hapi')

/**
 * Checar si la petición tiene cabecera application/json o es multipart/form-data
 * @param {Hapi.Request} request Petición
 * @param {Hapi.ResponseToolkit} h Objeto Hapi
 */
const checkApplicationJsonHeader = (request, h) => {
    const contentType = request.headers['content-type' || 'Content-Type']
    const validHeaders = ['application/json', 'application/x-www-form-urlencoded', 'text/plain']
    const isValid = validHeaders.includes(contentType) || contentType.includes('multipart/form-data')
    console.log('content-type:', contentType)
    console.log('isValid:', isValid)

    // --------------------------992661430282015016806536
    // --------------------------247961007201944825835820

    return contentType
}

module.exports = {
    checkApplicationJsonHeader,
}
