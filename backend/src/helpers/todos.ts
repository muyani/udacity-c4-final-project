import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const TODOS_TABLE = process.env.TODOS_TABLE;
const TODOS_CREATED_AT_INDEX = process.env.TODOS_CREATED_AT_INDEX
const s3_bucket = process.env.ATTACHMENT_S3_BUCKET
const signed_expiry = process.env.SIGNED_URL_EXPIRATION
const todoaccess = new TodosAccess;
const attach = new AttachmentUtils;

// TODO: Implement businessLogic
export const createTodo = async (userId: string, item: CreateTodoRequest) => {
    const todoId = uuid.v4()
    const newTodoItem: TodoItem = {
        todoId: todoId,
        createdAt: new Date().toLocaleString(),
        userId: userId,
        done: false,
        ...item,
        attachmentUrl: createAttachmentPresignedUrl(userId, todoId)
    }
    const result = await todoaccess.putItem(TODOS_TABLE, newTodoItem);
    if (result) {
        return newTodoItem
    }
    else {
        return false
    }

    ;
}

export const updateTodo = async (todoId: string, userId: string, updatetodoItem: UpdateTodoRequest) => {
    const result = await todoaccess.updateItem(TODOS_TABLE, todoId, userId, updatetodoItem);
    return result
}

export const deleteTodo = async (userId: string, todoId: string) => {
    const result = await todoaccess.deleteItem(TODOS_TABLE, userId, todoId);
    return result;
}

export const getTodosForUser = async (userId: string) => {
    const result = await todoaccess.getItemsForUser(TODOS_TABLE, TODOS_CREATED_AT_INDEX, userId);
    return result
}


export const createAttachmentPresignedUrl = (userId: string, todoId: string) => {
    const key = { userId: userId, todoId: todoId }
    const uploadUrl = attach.getUploadUrl(key, s3_bucket, signed_expiry);
    return uploadUrl;
}

