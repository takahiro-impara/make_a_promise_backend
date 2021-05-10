import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import path from 'path';

import { deleteItem } from '../businessLogic/items';
import { createLogger } from '../../utils/logger';

const logger = createLogger(path.basename(__filename));

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('delete todo event', event);

  await deleteItem(event);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({}),
  };
};
