// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html
const util = require('util')
const Boom = require('@hapi/boom')
const AWS = require('aws-sdk')

AWS.config.update({
    region: process.env.AWS_REGION,
})

const s3 = new AWS.S3({ apiVersion: 'latest' })

const listBuckets = util.promisify(s3.listBuckets).bind(s3)
const getBucketACL = util.promisify(s3.getBucketAcl).bind(s3)
const upload = util.promisify(s3.upload).bind(s3)

const uploadToAWS = async (file, filename) => {
    try {
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filename,
            Body: file,
        }

        const uploaded = await upload(uploadParams)

        return {
            message: `Archivo ${filename} subido correctamente`,
            location: uploaded.Location
        }
    } catch (error) {
        throw new Boom.Boom(`No se pudo subir ${filename}`)
    }
}

const buckets = async () => {
    const data = await listBuckets()
    return data.Buckets
}

const bucketACL = async () => {
    const data = await getBucketACL({ Bucket: process.env.AWS_BUCKET_NAME })
    return data.Grants
}

module.exports = {
    uploadToAWS,
    bucketACL,
    buckets,
}
