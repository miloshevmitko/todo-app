import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { serverConfig, mongoDbConfig } from './configs';
import { mongoConnection } from './database';
import { onProcessEndHandlerProvider } from './utils/onProcessEndHandler';

async function init() {
  mongoConnection.connectToDb(mongoDbConfig.dbName).then(() => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    import('./router').then((module) => {
      return app.use(`/api/${serverConfig.namespace}`, module.router);
    });
    
    const server = app.listen(serverConfig.port, () => {
      console.info(`Server is running on port ${serverConfig.port}.`);
    });
    
    const onProcessEndHandler = onProcessEndHandlerProvider(server, { mongoConnection });
    
    process.on('SIGTERM', onProcessEndHandler);
    process.on('SIGINT', onProcessEndHandler);

  }).catch((error) => console.error(error));
}

init().catch((error) => console.error(error));