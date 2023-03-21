import dataSource from '../db/dataSource';

import logger from '../utils/logger';

const connectToDb = async () => {
  try {
    const connection = await dataSource.initialize();

    logger.log('DB connected');

    process.on('SIGINT', async () => {
      if (!connection.isInitialized) {
        return;
      }
      await connection.destroy();
      logger.info(
        'DB connection is disconnected due to application termination',
      );
      process.exit(0);
    });

    return connection;
  } catch (err) {
    logger.error(`DB connection error, ${err.message}`);
    process.exit(1);
  }
};

export default connectToDb;
