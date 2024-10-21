import { IncomingMessage } from 'http';

function getRequestData(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      let body = '';
      request.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });
      request.on('end', () => {
        resolve(body);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export default getRequestData;
