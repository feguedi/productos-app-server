const { Schema, model } = require('mongoose')
const mongooseUniqueValidator = require('mongoose-unique-validator')

const gruposUsuarios = {
    values: ['usuario-x', 'super', 'admin'],
    message: '{VALUE} no es un grupo de usuario válido'
}

const UsuarioSchema = new Schema({
    nombre: String,
    grupo: {
        type: String,
        required: true,
        default: 'usuario-x',
        enum: gruposUsuarios,
    },
    correoElectronico: {
        type: String,
        index: true,
        required: [true, 'Se necesita el correo electrónico'],
        unique: true,
    },
    contrasenia: {
        type: String,
        required: [true, 'Se necesita la contraseña'],
    },
})

UsuarioSchema.plugin(mongooseUniqueValidator, { message: 'Error con {PATH}. {VALUE} ya está registrado' })

module.exports = model('Usuario', UsuarioSchema)
