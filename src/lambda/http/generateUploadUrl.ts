import 'source-map-support/register';
import * as uuid from 'uuid';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import path from 'path';
import { createLogger } from '../../utils/logger';
import { getUploadUrl } from '../businessLogic/items';
import { putImage } from '../businessLogic/items';

const logger = createLogger(path.basename(__filename));
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('upload url event', event);
  const imageId = uuid.v4();
  const url = await getUploadUrl(imageId);
  logger.info('url ', { uploadUrl: url });

  await putImage(event, imageId);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      uploadUrl: url,
    }),
  };
};
