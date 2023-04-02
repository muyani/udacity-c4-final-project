import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient()

// TODO: Implement the dataLayer logic

export class TodosAccess {

    //putItem to dynamo DB.
    async putItem(tableName: string, item: TodoItem) {
        const result = await docClient.put({
            TableName: tableName,
            Item: item
        }).promise()
        return result;
    }

    // query items by userid
    async getItemsForUser(tableName, indexName = '', userId:string) {
        const result = await docClient.query({
            TableName: tableName,
            IndexName: indexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        return result;
    }

    //delete items
    async deleteItem(tableName: string, userId: string, todoId: string) {
        const key = { userId: userId, todoId: todoId }
        const result = await docClient.delete({
            TableName: tableName,
            Key: key
        }).promise()
        return result;
    }

    //update item by Id
    async updateItem(tableName: string, todoId: string, userId: string, item: TodoUpdate) {
        const key = { userId: userId, todoId: todoId }
        const result = await docClient.update({
            TableName: tableName,
            Key: key,
            UpdateExpression: 'set named=:name,dueDate=:dueDate,done=:done',
            ExpressionAttributeValues: {
                ':name': item.name,
                ':dueDate': item.dueDate,
                ':done': item.done
            }

        }).promise()
        return result
    }
}