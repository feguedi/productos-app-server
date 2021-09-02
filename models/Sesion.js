const { model, Schema } = require('mongoose')

const SesionSchema = new Schema({
    token: {
        type: String,
        require: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    expiracion: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
})

module.exports = model('Sesion', SesionSchema)
