import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import {createLogger}  from '../../utils/logger'

const logger = createLogger("UpdateTodos")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Request to update todos", event)
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    // FANYA: Update a TODO item with the provided id using values in the "updatedTodo" object

    const result = await updateTodo(todoId, userId, updatedTodo);
    if (result) {
      logger.info("updated todo successfully" , result.$response)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: "Updated"
      }
    }
    else {
      logger.info("failed to update any todo" , result.$response)
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: "Something went wrong"
      }
    }

  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
