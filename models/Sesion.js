const { model, Schema } = require('mongoose')

const SesionSchema = new Schema({
    token: String,
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    expiracion: {
        type: Date,
        required: true,
        expires: '3d',
    },
    activa: {
        type: Boolean,
        required: true,
        default: true,
    },
}, {
    timestamps: true,
})

module.exports = model('Sesion', SesionSchema)
