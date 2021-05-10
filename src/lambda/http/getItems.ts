import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';

import { GetItemsFromuserId } from '../businessLogic/items';
import path from 'path';
import { createLogger } from '../../utils/logger';

const logger = createLogger(path.basename(__filename));

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event);
  const sub = event.requestContext.authorizer!.principalId;
  logger.info('user sub: ', { sub: sub });

  const Items = await GetItemsFromuserId(sub);
  logger.info('get items', Items);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ items: Items }),
  };
};
