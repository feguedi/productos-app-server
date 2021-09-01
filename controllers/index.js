const Boom = require('@hapi/boom')
const _ = require('underscore')
const Producto = require('../models/Producto')
const { uploadToAWS } = require('../helpers/aws')

exports.obtenerProductos = async () => {
    try {
        const productos = await Producto.find().select('nombre precio imagen disponible')

        return { total: productos.length, productos }
    } catch (error) {
        console.error('obtenerProductos error:', error)
        throw new Boom.Boom(error)
    }
}

exports.obtenerProducto = async (id) => {
    try {
        const producto = await Producto.findById(id, 'nombre precio imagen disponible')

        return producto
    } catch (error) {
        console.error('obtenerProducto error:', error)
        throw new Boom.Boom(error)
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
        console.error('crearProducto error:', error)
        throw new Boom.Boom(error)
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

        datosKeys.forEach(async key => {
            if (key === 'imagen') {
                const nombre = datos.nombre ? datos.nombre : producto.nombre
                const filenameSplitted = String(datos.imagen.hapi.filename).split('.')
                const extension = filenameSplitted[filenameSplitted.length - 1]
                const filename = 'prod-'.concat(String(nombre).split(' ').map(palabra => palabra.toLowerCase()).join('').slice(0, 10), '.', extension)

                const awsResponse = await uploadToAWS(imagen, filename)
                producto['imagen'] = awsResponse.location
            } else {
                const dato = datos[key]
                if (dato) {
                    producto[key] = dato
                }
            }
        })

        await producto.save()

        return { message: `${producto.nombre} actualizado (${datosKeys.join(' ')})` }
    } catch (error) {
        console.error('actualizarProducto error:', error)
        throw new Boom.Boom(error)
    }
}

exports.eliminarProducto = async (id) => {
    try {
        await Producto.findByIdAndDelete(id)
        return { message: `Producto eliminado` }
    } catch (error) {
        console.error('eliminarProducto error:', error)
        throw new Boom.Boom(error)
    }
}
