import { v4 as uuidv4 } from 'uuid';
import users from '../data/userData';

type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

class Controller {
  async getUsers(): Promise<User[]> {
    return new Promise((resolve, _) => resolve(users));
  }

  async getUser(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const user = users.find((user: { id: string }) => user.id === id);
      if (user) {
        resolve(user);
      } else {
        reject(`User with id ${id} not found!`);
      }
    });
  }

  async createUser(newUser: Omit<User, 'id'>): Promise<User> {
    return new Promise((resolve, _) => {
      const user: User = {
        id: uuidv4(),
        ...newUser,
      };
      users.push(user);
      resolve(user);
    });
  }

  async updateUser(
    id: string,
    updatedData: Partial<Omit<User, 'id'>>,
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      const index = users.findIndex((user: { id: string }) => user.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updatedData };
        resolve(users[index]);
      } else {
        reject(`User with id ${id} not found!`);
      }
    });
  }

  async deleteUser(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const index = users.findIndex((user: { id: string }) => user.id === id);
      if (index !== -1) {
        users.splice(index, 1);
        resolve();
      } else {
        reject(`User with id ${id} not found!`);
      }
    });
  }
}

export default Controller;
