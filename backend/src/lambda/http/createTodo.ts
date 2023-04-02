import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'


const logger = createLogger('CreaateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    logger.info("creating new Todo item", newTodo)
    // FANYA: Implement creating a new TODO item
    const userId = getUserId(event);
    const result = await createTodo(userId, newTodo);
    if (result) {
      logger.info("created new Todo item successfully", result)
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          'item': result
        })
      }
    }
    else {
      logger.info("Failed to create new Todo", result) 
      return {
        statusCode: 400,
        headers: {

          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true

        },
        body: "something went wrong"
      }

    }

  }
)

handler.use(
  cors({
    credentials: true
  })
)
