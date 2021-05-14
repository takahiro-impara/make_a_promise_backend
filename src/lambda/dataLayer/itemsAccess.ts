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
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly itemsTable = process.env.ITEM_TABLE,
    private readonly userIndex = process.env.USER_ID_INDEX,
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = process.env.SIGNED_S3_BUCKET,
    private readonly urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION!) || 300,
    private readonly baseS3url = 'https://' + bucketName + '.s3-' + process.env.REGION + '.amazonaws.com/',
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
  async getUploadUrl(imageId: string) {
    const signedurl = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: imageId,
      Expires: this.urlExpiration,
    });

    logger.info('signedurl', { signedurl: signedurl });
    return signedurl;
  }
  async putImage(itemId: string, userId: string, imageId: string) {
    await this.docClient
      .update({
        TableName: this.itemsTable || '',
        Key: {
          itemId: itemId,
          userId: userId,
        },
        UpdateExpression: 'set attachmentUrl = :a',
        ExpressionAttributeValues: {
          ':a': this.baseS3url + imageId,
        },
        ReturnValues: 'UPDATED_NEW',
      })
      .promise();
    logger.info('updated item');
    return {};
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance');
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
}
