const Hapi = require('@hapi/hapi')
const Boom = require('@hapi/boom')
const {
    crearUsuario,
    login,
    logout,
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
} = require('../controllers')
const {
    crearUsuarioRequest,
    loginRequest,
} = require('../schemas/request')
const {
    simpleMensajeResponse,
} = require('../schemas/response')
const { failAction } = require('../helpers/validations')

/**
 * @type Hapi.ServerRoute[]
 */
const routes = [
    {
        method: 'POST',
        path: '/api/login',
        options: {
            validate: {
                failAction,
                payload: loginRequest,
            },
        },
        async handler (request, h) {
            try {
                console.log('POST /api/login')
                const { correoElectronico, contrasenia } = request.payload
                const { token, id } = await login({ correoElectronico, contrasenia })

                request.cookieAuth.set({ id })

                return { message: 'Bienvenido', token }
            } catch (error) {
                throw new Boom.Boom(error)
            }
        }
    },
    {
        method: 'POST',
        path: '/api/usuario',
        options: {
            validate: {
                failAction,
                payload: crearUsuarioRequest,
            },
        },
        async handler (request, h) {
            try {
                console.log('POST /api/usuario')
                const { nombre, grupo, correoElectronico, contrasenia } = request.payload
                const usuarioNuevo = await crearUsuario({ nombre, grupo, correoElectronico, contrasenia })

                if (usuarioNuevo.token) {
                    request.cookieAuth.set({ id: usuarioNuevo.id })
                } else {
                    delete usuarioNuevo.token
                }

                return usuarioNuevo
            } catch (error) {
                throw new Boom.Boom(error)
            }
        }
    },
    {
        method: 'POST',
        path: '/api/logout',
        async handler (request, h) {
            try {
                console.log('POST /api/logout')
                const { id } = request.auth.credentials
                const salir = await logout(id)

                if (!salir.ok) {
                    throw Boom.badRequest('No se pudo eliminar la sesión')
                }
                request.cookieAuth.clear(['sid'])

                return { message: 'Vuelva prontos' }
            } catch (error) {
                throw new Boom.Boom(error)
            }
        }
    },
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
