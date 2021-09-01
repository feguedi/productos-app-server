const Hapi = require('@hapi/hapi')
const Boom = require('@hapi/boom')
const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
} = require('../controllers')

/**
 * @type Hapi.ServerRoute[]
 */
const routes = [
    {
        method: 'GET',
        path: '/api/productos',
        async handler (request, h) {
            try {
                console.log('GET /api/productos')
                const productos = await obtenerProductos()

                return productos
            } catch (error) {
                throw new Boom.Boom(error)
            }
        }
    },
    {
        method: 'GET',
        path: '/api/producto/{id}',
        async handler (request, h) {
            try {
                console.log('GET /api/producto/', request.params.id)
                const id = request.params.id
                const producto = await obtenerProducto(id)

                return producto
            } catch (error) {
                throw new Boom.Boom(error)
            }
        }
    },
    {
        method: 'POST',
        path: '/api/producto',
        options: {
            payload: {
                maxBytes: 10485760,
                output: 'stream',
                parse: true,
                multipart: true,
            },
        },
        async handler(request, h) {
            try {
                console.log('POST /api/producto')

                const { imagen, nombre, precio, disponible } = request.payload
                const productoCreado = await crearProducto(nombre, precio, { imagen, disponible })

                return productoCreado
            } catch (error) {
                throw new Boom.Boom(error)
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/producto/{id}',
        options: {
            payload: {
                maxBytes: 10485760,
                output: 'stream',
                parse: true,
                multipart: true,
            },
        },
        async handler(request, h) {
            try {
                console.log('PUT /api/producto/', request.params.id)
                console.log('headers:', JSON.stringify(request.headers, null, 2))
                const { nombre, precio, imagen, disponible } = request.payload

                const id = request.params.id
                const productoActualizado = await actualizarProducto(id, { nombre, precio, imagen, disponible })

                return productoActualizado
            } catch (error) {
                throw new Boom.Boom(error)
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/producto/{id}',
        async handler (request, h) {
            try {
                console.log('DELETE /api/producto/', request.params.id)
                const id = request.params.id
                const productoEliminado = await eliminarProducto(id)

                return productoEliminado
            } catch (error) {
                throw new Boom.Boom(error)
            }
        }
    },
    {
        method: '*',
        path: '/{any*}',
        handler (request, h) {
            console.log(`404 ${request.method} ${request.path}`)
            return 'Ruta no encontrada'
        }
    }
]

module.exports = routes
