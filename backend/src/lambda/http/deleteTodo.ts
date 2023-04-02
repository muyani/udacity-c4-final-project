import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTodo } from '../../helpers/todos'
import { getUserId } from '../utils'
import {createLogger} from '../../utils/logger'


const logger = createLogger('DeleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    logger.info("deleting todo with this ID" + todoId)
    const userId = getUserId(event)
    // FANYA: Remove a TODO item by id

    const result = deleteTodo(userId, todoId)
    if (result) {
      logger.info("Deleted Todo successfully" + todoId)
      return {
        statusCode: 200,
        body: 'Deleted successfully'
      }
    }
    else {
      logger.info("Failed to delete a todo with ID" + todoId + ":result")
      return {
        
        statusCode: 400,
        body: 'something went wrong during deletion'
      }
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
