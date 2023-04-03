import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger("FileStorage")
// FANYA: Implement the fileStogare logic
// generate a signed url
const s3 = new XAWS.S3({
    signatureVersion: 'v4' // Use Sigv4 algorithm
})

export class AttachmentUtils {
    getUploadUrl(id, bucket_name: string, expires: string) {
        logger.info("generating upload URL", id + bucket_name);
        try {
            return s3.getSignedUrl('putObject', { // The URL will allow to perform the PUT operation
                Bucket: bucket_name, // Name of an S3 bucket
                Key: id, // id of an object this URL allows access to
                Expires: expires  // A URL is only valid for 5 minutes
            })
        }
        catch (e) {
            logger.error("Generating File storage url failed with errror", { error: e.message })
        }

    }
}