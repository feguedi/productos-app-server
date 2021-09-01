const path = require('path')
const fs = require('fs')

const envTestURI = path.join(__dirname, '..', '.env.test')
const envLocalURI = path.join(__dirname, '..', '.env')

try {
    if (process.env.NODE_ENV !== 'production') {
        const envTestExists = fs.existsSync(envTestURI)
        const envLocalExists = fs.existsSync(envLocalURI)

        const envTest = envTestExists && fs.readFileSync(envTestURI).toString()
        const envLocal = envLocalExists && fs.readFileSync(envLocalURI).toString()

        if (process.env.NODE_ENV === 'test') {
            const envs = `${envLocal}\n${envTest}`
            const parsed = require('dotenv').parse(envs, { debug: true })

            Object.keys(parsed).forEach(key => {
                if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
                    process.env[key] = parsed[key]
                }
            })
        } else {
            require('dotenv').config({ path: envLocalURI })
        }
    } else {
        require('dotenv').config()
    }
} catch (error) {
    console.error('Error:')
    console.error(error)
}
