import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import path from 'path';

import { createItem } from '../businessLogic/items';
import { createLogger } from '../../utils/logger';

const logger = createLogger(path.basename(__filename));

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('create todo event', event);

  const newItem = await createItem(event);
  logger.info('new item', newItem);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      item: newItem,
    }),
  };
};
