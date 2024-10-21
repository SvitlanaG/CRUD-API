import Controller from './controller';
import users from '../data/userData';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

describe('Controller', () => {
  let controller: Controller;

  beforeEach(() => {
    controller = new Controller();
    users.length = 0;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty array when getting all users', async () => {
    // Act
    const result = await controller.getUsers();

    // Assert
    expect(result).toEqual([]);
  });

  it('should create a new user and return the created record', async () => {
    // Arrange
    const newUser = { username: 'Test User', age: 25, hobbies: ['gaming'] };

    // Act
    const result = await controller.createUser(newUser);

    // Assert
    expect(result).toEqual({ id: 'mocked-uuid', ...newUser });
    expect(users).toContainEqual(result);
  });

  it('should get the created user by ID', async () => {
    // Arrange
    const newUser = { username: 'Test User', age: 25, hobbies: ['gaming'] };
    const createdUser = await controller.createUser(newUser);

    // Act
    const result = await controller.getUser(createdUser.id);

    // Assert
    expect(result).toEqual(createdUser);
  });

  it('should update the created user and return the updated object', async () => {
    // Arrange
    const newUser = { username: 'Jane Doe', age: 25, hobbies: ['gaming'] };
    const createdUser = await controller.createUser(newUser);
    const updatedData = { age: 26, hobbies: ['reading'] };

    // Act
    const result = await controller.updateUser(createdUser.id, updatedData);

    // Assert
    expect(result).toEqual({ ...createdUser, ...updatedData });
  });

  it('should delete the created user and confirm deletion', async () => {
    // Arrange
    const newUser = { username: 'Test User', age: 25, hobbies: ['gaming'] };
    const createdUser = await controller.createUser(newUser);

    // Act
    await controller.deleteUser(createdUser.id);

    // Assert
    expect(users).not.toContainEqual(createdUser);
  });

  it('should throw an error when trying to get a deleted user by ID', async () => {
    // Arrange
    const newUser = { username: 'Jane Doe', age: 25, hobbies: ['gaming'] };
    const createdUser = await controller.createUser(newUser);
    await controller.deleteUser(createdUser.id);

    // Act & Assert
    await expect(controller.getUser(createdUser.id)).rejects.toBe(
      `User with id ${createdUser.id} not found!`,
    );
  });
});
