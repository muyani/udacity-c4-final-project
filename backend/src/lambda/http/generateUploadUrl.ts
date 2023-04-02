import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import {createLogger} from '../../utils/logger'
import { createAttachmentPresignedUrl } from '../../helpers/todos'
import { getUserId } from '../utils'

const logger = createLogger("s3Storage")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


    const todoId = event.pathParameters.todoId
    logger.info("Generating upload url for todo " + todoId)
    const userId = getUserId(event)
    // FANYA: Return a presigned URL to upload a file for a TODO item with the provided id
    const presignedUrl = createAttachmentPresignedUrl(userId, todoId)

    logger.info("generated upload URL for Todo "+ todoId +"i.e " +presignedUrl)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(presignedUrl)
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
