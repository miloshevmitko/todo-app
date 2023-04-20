export interface Config {
  requestIdHeaderKey: string;
}

export const config: Config = {
  requestIdHeaderKey: 'X-Request-Id',
};