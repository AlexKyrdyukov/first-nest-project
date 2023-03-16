import { createClient } from 'redis';
import logger from '../utils/logger';

export const redisClient = createClient({ url: 'redis://localhost:6379' });

export default async () => {
  try {
    await redisClient.connect();

    logger.log('Redis is connected');
  } catch (err) {
    logger.error(err);
  }
};
