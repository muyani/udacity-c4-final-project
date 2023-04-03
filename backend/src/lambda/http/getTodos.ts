import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getTodosForUser as getTodosForUser } from '../../helpers/todos'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'



const logger = createLogger("GetTodos");
// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    logger.info("request to get todos ", event)
    // console.log('Caller event', event)
    const userId = getUserId(event)
    const result = await getTodosForUser(userId)
    const items = {'items':result.Items}

    if (result) {
      logger.info("feched some todos " + JSON.stringify(result.Items))
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(items)
      }
    }
    else{
      logger.info("Looks like we have empty todos" + result.$response)
      return {
        statusCode: 404,
        headers:{
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body:'No new todos'
      }
    }

  })


handler.use(
  cors({
    credentials: true
  })
)
