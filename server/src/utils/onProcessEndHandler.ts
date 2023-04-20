import type { IMongoConnection } from '@todo-app/server/database';
import type { Server } from 'http';

export interface Processes {
  mongoConnection: IMongoConnection;
}

/**
 * Provides a function that will handle the graceful shutdown of the application.
 *
 * @param server Running HTTP Server instance.
 * @param processes Object containing references to all running processes that need closing.
 * @returns Handler that will close all running processes within the server.
 */
export function onProcessEndHandlerProvider(
  server: Server,
  processes: Processes
) {
  /**
   * Handles the graceful shutdown of the application and all of it's resources.
   * @param signal NodeJS signal.
   */
  return function onProcessEndHandler(signal: NodeJS.Signals) {
    const { mongoConnection } = processes;

    console.info(`"${signal}" signal received.`);

    console.info('Attempting to close the HTTP server.');
    server.close((serverError) => {
      if (serverError) {
        console.error(serverError);
      } else {
        console.info('HTTP server closed successfully.');
      }

      console.info('Attempting to close the database connection.');
      mongoConnection.client.close((mongoConnectionError) => {
        if (mongoConnectionError) {
          console.error(mongoConnectionError);
        } else {
          console.info('Database connection closed successfully.');
        }

        process.exit(serverError || mongoConnectionError ? 1 : 0);
      });
    });
  };
}
