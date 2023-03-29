import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // FANYA: Implement creating a new TODO item
    const userId = getUserId(event);
    const result = await createTodo(userId, newTodo);
    if (result) {
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          newTodo
        })
      }
    }
    return {
      statusCode: 404,
      headers: {
        
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        
      },
      body : "something went wrong"
    }

  }
)

handler.use(
  cors({
    credentials: true
  })
)
