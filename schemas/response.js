const Joi = require('joi')

const simpleMensajeResponse = Joi.object({
    message: Joi.string().required(),
}).label('mensajeResponse')

module.exports = {
    simpleMensajeResponse,
}
