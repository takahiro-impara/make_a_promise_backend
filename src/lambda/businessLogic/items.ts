import * as uuid from 'uuid';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { ItemAccess } from '../dataLayer/itemsAccess';
import { CreateItemRequest } from '../request/CreateItemRequest';
import { UpdateTodoRequest } from '../request/UpdateItemRequest';
import { Item } from '../../models/items';

const itemAccess = new ItemAccess();

export async function GetItemsFromuserId(userId: string) {
  return itemAccess.GetItemsFromuserId(userId);
}

export async function createItem(event: APIGatewayProxyEvent) {
  const newTodo: CreateItemRequest = JSON.parse(event.body!);

  if (!newTodo.name) {
    throw new Error('invalid Item');
  }
  const itemId = uuid.v4();
  const userId = event.requestContext.authorizer!.principalId;
  const createAt = new Date().toISOString();
  const done = false;

  const newItem: Item = {
    itemId,
    userId,
    createAt,
    done,
    ...newTodo,
  };

  return itemAccess.createItem(newItem);
}

export async function deleteItem(event: APIGatewayProxyEvent) {
  const itemId = event.pathParameters!.itemId || '';
  const userId = event.requestContext.authorizer!.principalId;
  return itemAccess.deleteItem(itemId, userId);
}
export async function updateItem(event: APIGatewayProxyEvent) {
  const updateTodo: UpdateTodoRequest = JSON.parse(event.body!);

  const itemId = event.pathParameters!.itemId || '';
  const userId = event.requestContext.authorizer!.principalId;
  const updateItem = {
    itemId,
    userId,
    ...updateTodo,
  };
  return itemAccess.updateItem(updateItem);
}

export async function getUploadUrl(imageId: string) {
  return itemAccess.getUploadUrl(imageId);
}

export async function putImage(event: APIGatewayProxyEvent, imageId: string) {
  const itemId = event.pathParameters!.itemId || '';
  const userId = event.requestContext.authorizer!.principalId;
  return itemAccess.putImage(itemId, userId, imageId);
}
