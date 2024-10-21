import { config } from 'dotenv';
import http, { IncomingMessage, ServerResponse } from 'http';
import { validate as isValidUUID } from 'uuid';
import Controller from './controllers/controller';
import getRequestData from './utils/utils';

config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(
  async (request: IncomingMessage, response: ServerResponse) => {
    const urlParts = request.url?.split('/');
    const userId = urlParts?.[3];
    const controller = new Controller();

    if (request.url === '/api/users' && request.method === 'GET') {
      const users = await controller.getUsers();
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify(users));
      response.end();
    } else if (request.url?.startsWith('/api/users/') && request.method === 'GET') {
      if (!isValidUUID(userId || '')) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ error: 'Invalid user ID' }));
        return response.end();
      }
      try {
        const user = await controller.getUser(userId as string);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify(user));
      } catch (error) {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ error }));
      } finally {
        response.end();
      }
    } else if (request.url === '/api/users' && request.method === 'POST') {
      try {
        const body = await getRequestData(request);
        const { username, age, hobbies } = JSON.parse(body);

        if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
          response.writeHead(400, { 'Content-Type': 'application/json' });
          response.write(JSON.stringify({ error: 'Invalid request body' }));
          response.end();
          return;
        }
        const newUser = await controller.createUser({ username, age, hobbies });
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify(newUser));
      } catch (error) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ error: 'Failed to create user' }));
      }
      response.end();
    } else if (request.url?.startsWith('/api/users/') && request.method === 'PUT') {
      if (!isValidUUID(userId || '')) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ error: 'Invalid user ID' }));
        return response.end();
      }
      try {
        const body = await getRequestData(request);
        const updatedData = JSON.parse(body);
        const updatedUser = await controller.updateUser(
          userId as string,
          updatedData,
        );
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify(updatedUser));
      } catch (error) {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ error }));
      }
      response.end();
    } else if (
      request.url?.startsWith('/api/users/') &&
      request.method === 'DELETE'
    ) {
      if (!isValidUUID(userId || '')) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ error: 'Invalid user ID' }));
        return response.end();
      }

      try {
        await controller.deleteUser(userId as string);
        response.writeHead(204);
      } catch (error) {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ error }));
      }
      response.end();
    } else {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({ error: 'Route not Found' }));
      response.end();
    }
  },
);

server.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
