import { config } from 'dotenv';
import http, {
  IncomingMessage,
  ServerResponse,
  request,
  IncomingHttpHeaders,
} from 'http';
import { cpus } from 'os';
import { fork } from 'child_process';

config();

const PORT = Number(process.env.PORT) || 4000;
const numCPUs = cpus().length - 1;

const workers: { [key: number]: { port: number; pid: number } } = {};
let currentWorkerIndex = 0;

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

interface CreateUserMessage {
  type: 'CREATE_USER';
  payload: { id: string; user: User };
}

interface GetUserMessage {
  type: 'GET_USER';
  payload: { id: string };
}

interface DeleteUserMessage {
  type: 'DELETE_USER';
  payload: { id: string };
}

interface GetUsersMessage {
  type: 'GET_USERS';
}

type MasterMessage =
  | CreateUserMessage
  | GetUserMessage
  | DeleteUserMessage
  | GetUsersMessage;

const database: { [key: string]: User } = {};

const hasPayload = (
  msg: MasterMessage,
): msg is CreateUserMessage | GetUserMessage | DeleteUserMessage => {
  return 'payload' in msg;
};

const handleMasterMessage = (msg: MasterMessage) => {
  if (hasPayload(msg)) {
    const { type, payload } = msg;
    switch (type) {
      case 'CREATE_USER':
        const { id, user } = payload;
        database[id] = user;
        break;
      case 'GET_USER':
        return database[payload.id];
      case 'DELETE_USER':
        delete database[payload.id];
        break;
    }
  } else if (msg.type === 'GET_USERS') {
    return Object.values(database);
  }
};

for (let i = 0; i < numCPUs; i++) {
  const workerPort = PORT + 1 + i;
  const worker = fork('./dist/server.js', { env: { PORT: workerPort.toString() } });

  worker.on('message', (msg: MasterMessage) => {
    const response = handleMasterMessage(msg);
    worker.send({ type: 'DB_RESPONSE', payload: response });
  });

  if (worker.pid !== undefined) {
    workers[workerPort] = { port: workerPort, pid: worker.pid };
  }
}

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const workerPort = PORT + 1 + (currentWorkerIndex % numCPUs);
  currentWorkerIndex += 1;

  const options = {
    hostname: 'localhost',
    port: workerPort,
    method: req.method,
    path: req.url,
    headers: req.headers as IncomingHttpHeaders,
  };

  const proxyRequest = request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode!, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyRequest, { end: true });

  proxyRequest.on('error', (err) => {
    console.error(`Proxy error: ${err.message}`);
    res.writeHead(500);
    res.end('Server error');
  });
});

server.listen(PORT, () => {
  console.log(`Load balancer is listening on port: ${PORT}`);
});
