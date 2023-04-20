import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { globalConfig, serverConfig, mongoDbConfig } from './configs';
import { mongoConnection } from './database';
import { requestId } from './middleware';
import { onProcessEndHandlerProvider } from './utils/onProcessEndHandler';

async function init() {
  mongoConnection.connectToDb(mongoDbConfig.dbName).then(() => {
    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use(requestId);

    const morganFormat = `:res[${globalConfig.requestIdHeaderKey}] - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]`;
    app.use(morgan(morganFormat));

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