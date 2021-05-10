import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import path from 'path';
import { createLogger } from '../../utils/logger';
import { Item } from '../../models/items';
import { UpdateItem } from '../../models/updateitem';

const logger = createLogger(path.basename(__filename));
const XAWS = AWSXRay.captureAWS(AWS);

export class ItemAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly itemsTable = process.env.ITEM_TABLE,
    private readonly userIndex = process.env.USER_ID_INDEX,
  ) {}
  async GetItemsFromuserId(userId: string): Promise<Item[]> {
    const params = {
      TableName: this.itemsTable || '',
      IndexName: this.userIndex,
      KeyConditionExpression: 'userId = :u',
      ExpressionAttributeValues: {
        ':u': userId,
      },
    };
    const result = await this.docClient.query(params).promise();
    logger.info('query items ', result);

    const items = result.Items;
    return items as Item[];
  }
  async createItem(newItem: Item) {
    await this.docClient
      .put({
        TableName: this.itemsTable || '',
        Item: newItem,
      })
      .promise();
    return newItem as Item;
  }
  async deleteItem(itemId: string, userId: string) {
    await this.docClient
      .delete({
        TableName: this.itemsTable || '',
        Key: {
          itemId: itemId,
          userId: userId,
        },
        ConditionExpression: 'userId = :u',
        ExpressionAttributeValues: {
          ':u': userId,
        },
      })
      .promise();
    logger.info('delet item');
    return {};
  }
  async updateItem(UpdateItem: UpdateItem) {
    await this.docClient
      .update({
        TableName: this.itemsTable || '',
        Key: {
          itemId: UpdateItem.itemId,
          userId: UpdateItem.userId,
        },
        UpdateExpression: 'set done = :d',
        ExpressionAttributeValues: {
          ':d': UpdateItem.done,
        },
        ReturnValues: 'UPDATED_NEW',
      })
      .promise();
    logger.info('updated item', UpdateItem);
    return {};
  }
}
