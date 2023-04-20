import type { IMongoConnection } from '@todo-app/server/database';
import type { Server } from 'http';
import { onProcessEndHandlerProvider } from "./onProcessEndHandler";
import { AnyError } from 'mongodb';

describe('Testing utility functions', () => {
  let spyProcessExit: jest.SpyInstance<never, [code?: number | undefined], any>;

  beforeEach(() => {
    spyProcessExit = jest
      .spyOn(process, 'exit')
      .mockImplementation(() => { return undefined as never });
    
    spyProcessExit.mockClear();
  });

  it('should gracefuly shutdown the application', () => {
    const mockServer = {
      close: function (cb: (err?: Error) => void) { cb(); },
    } as unknown as Server;
    const mockProcesses = {
      mongoConnection: {
        client: {
          close: function (cb: (err?: AnyError) => void) { cb(); },
        }
      } as IMongoConnection
    };

    const spyServerClose = jest.spyOn(mockServer, 'close');
    const spyMongoClientClose = jest.spyOn(mockProcesses.mongoConnection.client, 'close');
    

    const onProcessEndHandler = onProcessEndHandlerProvider(mockServer, mockProcesses);
    onProcessEndHandler('SIGINT');

    expect(spyServerClose).toHaveBeenCalledTimes(1);
    expect(spyMongoClientClose).toHaveBeenCalledTimes(1);
    expect(spyProcessExit).toHaveBeenCalledTimes(1);
    expect(spyProcessExit).toHaveBeenCalledWith(0);
  });

  it('should fail to gracefuly shutdown the application', () => {
    const mockServer = {
      close: function (cb: (err?: Error) => void) { cb(); },
    } as unknown as Server;
    const mockProcesses = {
      mongoConnection: {
        client: {
          close: function (cb: (err?: AnyError) => void) { cb(new Error('test')); },
        }
      } as IMongoConnection
    };

    const spyServerClose = jest.spyOn(mockServer, 'close');
    const spyMongoClientClose = jest.spyOn(mockProcesses.mongoConnection.client, 'close');
    const spyProcessExit = jest
      .spyOn(process, 'exit')
      .mockImplementation(() => { return undefined as never });

    const onProcessEndHandler = onProcessEndHandlerProvider(mockServer, mockProcesses);
    onProcessEndHandler('SIGINT');

    expect(spyServerClose).toHaveBeenCalledTimes(1);
    expect(spyMongoClientClose).toHaveBeenCalledTimes(1);
    expect(spyProcessExit).toHaveBeenCalledTimes(1);
    expect(spyProcessExit).toHaveBeenCalledWith(1);
  });
});