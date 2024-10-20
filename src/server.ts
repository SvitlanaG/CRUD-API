import { config } from 'dotenv';
import http, { IncomingMessage, ServerResponse } from 'http';
import sampleData from './data/userData';

config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(
  async (request: IncomingMessage, response: ServerResponse) => {
    if (request.url === '/api/users' && request.method === 'GET') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({ message: sampleData }));
      response.end();
    } else {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({ error: 'Not Found' }));
      response.end();
    }
  },
);

server.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
