const Joi = require('joi')

const crearUsuarioRequest = Joi.object({
    correoElectronico: Joi.string().email().required(),
    contrasenia: Joi.string().length(6).required(),
    nombre: Joi.string(),
    grupo: Joi.string(),
}).label('crearUsuarioRequest')

const loginRequest = Joi.object({
    correoElectronico: Joi.string().required(),
    contrasenia: Joi.string().required(),
}).label('login')

module.exports = {
    crearUsuarioRequest,
    loginRequest,
}
