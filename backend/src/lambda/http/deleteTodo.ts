import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTodo } from '../../helpers/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    // FANYA: Remove a TODO item by id

    const result = deleteTodo(userId, todoId)
    if (result) {
      return {
        statusCode: 200,
        body: 'Deleted successfully'
      }
    }
    else {
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
