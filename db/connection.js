const { connect } = require('mongoose')

const uri = process.env.BD_CNN

async function startConnection () {
    try {
        await connect(uri, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
        console.log('Base de datos corriendo')
    } catch (error) {
        console.error('Error en la conexión de la base de datos.', error)
    }
}

startConnection()
