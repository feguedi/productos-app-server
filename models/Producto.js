const { Schema, model } = require('mongoose')

const ProductoSchema = new Schema({
    disponible: {
        type: Boolean,
        required: true,
        default: true,
    },
    nombre: {
        type: String,
        required: [true, 'Se necesita el nombre del producto'],
    },
    imagen: String,
    precio: {
        type: Number,
        min: 0,
        required: [true, 'Se necesita el precio del producto'],
    },
})

module.exports = model('Producto', ProductoSchema)
