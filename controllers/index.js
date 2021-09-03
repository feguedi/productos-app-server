const Boom = require('@hapi/boom')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const Producto = require('../models/Producto')
const Usuario = require('../models/Usuario')
const Sesion = require('../models/Sesion')
const { crearToken } = require('../plugins/auth')
const { uploadToAWS } = require('../helpers/aws')
const { errorHandler } = require('../helpers/errors')

exports.login = async ({ correoElectronico, contrasenia }) => {
    try {
        const usuarioBD = await Usuario.findOne({ correoElectronico }, 'id nombre grupo correoElectronico contrasenia')
        if (!usuarioBD) {
            throw Boom.badRequest('Datos incorrectos')
        }

        const isPassValid = bcrypt.compareSync(contrasenia, usuarioBD.contrasenia)
        if (!isPassValid) {
            throw Boom.badRequest('Datos incorrectos')
        }

        const hasActiveSession = await Sesion.find({ usuario: usuarioBD.id, expiracion: { '$gte': Date.now() }, activa: true })
        if (hasActiveSession.length > 0) {
            throw Boom.unauthorized('Ya tienes una sesión activa')
        }

        const token = crearToken({ id: usuarioBD.id })
        const momento = new Date()
        const expiracion = momento.getTime() + 259200000
        const sesionNueva = new Sesion({
            usuario: usuarioBD.id,
            token,
            expiracion
        })

        await sesionNueva.save()

        return { id: usuarioBD.id, token }
    } catch (error) {
        throw errorHandler(error)
    }
}

exports.logout = async usuarioID => {
    try {
        const sesion = await Sesion.findOne({ usuario: usuarioID, activa: true }, 'activa')
        if (!sesion) {
            throw Boom.badRequest('No hay sesión')
        }

        sesion.activa = false
        await sesion.save()

        return { ok: true }
    } catch (error) {
        throw errorHandler(error)
    }
}

exports.crearUsuario = async ({ nombre, grupo, correoElectronico, contrasenia }) => {
    try {
        const contraseniaHashed = bcrypt.hashSync(contrasenia, 16)
        const usuarioNuevo = new Usuario({ nombre, grupo, correoElectronico, contrasenia: contraseniaHashed })
        await usuarioNuevo.save()

        const token = crearToken(usuarioNuevo.id)

        if (!nombre && !grupo) {
            const momento = new Date()
            const expiracion = momento.getTime() + 259200000
            const sesionNueva = new Sesion({
                usuario: usuarioBD.id,
                token,
                expiracion
            })

            await sesionNueva.save()

            return {
                token,
                message: 'Usuario creado',
            }
        }

        return {
            message: `Usuario ${nombre} (${grupo}) creado`,
            id: usuarioNuevo.id,
        }
    } catch (error) {
        throw errorHandler(error)
    }
}

exports.obtenerProductos = async () => {
    try {
        const productosBD = await Producto.find().select('id nombre precio imagen disponible')
        const productos = productosBD.map(producto => _.pick(producto, ['id', 'nombre', 'precio', 'imagen', 'disponible']))

        return { total: productos.length, productos }
    } catch (error) {
        throw errorHandler(error)
    }
}

exports.obtenerProducto = async (id) => {
    try {
        const productoBD = await Producto.findById(id, 'nombre precio imagen disponible')
        const producto = _.pick(productoBD, ['id', 'nombre', 'precio', 'imagen', 'disponible'])

        return producto
    } catch (error) {
        throw errorHandler(error)
    }
}

exports.crearProducto = async (nombre, precio, { imagen, disponible }) => {
    try {
        if (!nombre || !precio) {
            throw Boom.badRequest('Se necesita nombre y precio del producto')
        }
        const datosProducto = {}
        datosProducto['nombre'] = nombre
        datosProducto['precio'] = precio
        datosProducto['disponible'] = disponible ? disponible : undefined

        if (imagen) {
            const filenameSplitted = String(imagen.hapi.filename).split('.')
            const extension = filenameSplitted[filenameSplitted.length - 1]
            const filename = 'prod-'.concat(String(nombre).split(' ').map(palabra => palabra.toLowerCase()).join('').slice(0, 10), '.', extension)
            const awsResponse = await uploadToAWS(imagen, filename)
            datosProducto['imagen'] = awsResponse.location
        }

        Object.keys(datosProducto).forEach(key => {
            if (!datosProducto[key]) {
                delete datosProducto[key]
            }
        })

        const productoNuevo = new Producto(datosProducto)
        const bdResponse = await productoNuevo.save()

        console.log('Producto guardado -', bdResponse)

        return { message: 'Se creo el producto' }
    } catch (error) {
        throw errorHandler(error)
    }
}

exports.actualizarProducto = async (id, datos = { nombre, precio, imagen, disponible }) => {
    try {
        const datosKeys = Object.keys(datos).filter(key => datos[key] !== undefined)
        const isEmpty = datosKeys.length === 0
        if (Object.keys(datos).length === 0 || isEmpty) {
            throw Boom.badRequest('Datos mal enviados')
        }

        const producto = await Producto.findById(id, 'nombre')
        if (!producto) {
            throw Boom.badRequest('No se encontró el producto')
        }

        console.log('producto:', producto.nombre)

        if (datos.imagen) {
            const nombre = datos.nombre ? datos.nombre : producto.nombre
            const filenameSplitted = String(datos.imagen.hapi.filename).split('.')
            const extension = filenameSplitted[filenameSplitted.length - 1]
            const filename = 'prod-'.concat(String(nombre).split(' ').map(palabra => palabra.toLowerCase()).join('').slice(0, 10), '.', extension)

            const awsResponse = await uploadToAWS(datos.imagen, filename)
            producto['imagen'] = awsResponse.location
        }

        datosKeys.forEach(key => { if (key !== 'imagen' && datos[key]) producto[key] = datos[key] })

        await producto.save()

        return { message: `${producto.nombre} actualizado (${datosKeys.join(' ')})` }
    } catch (error) {
        throw errorHandler(error)
    }
}

exports.eliminarProducto = async (id) => {
    try {
        await Producto.findByIdAndDelete(id)
        return { message: `Producto eliminado` }
    } catch (error) {
        throw errorHandler(error)
    }
}
