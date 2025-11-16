const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      // Arrange
      const addThreadPayload = new AddThread({
        title: 'sebuah thread',
        body: 'ini adalah sebuah thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(addThreadPayload);

      // Assert
      const foundThreads = await ThreadsTableTestHelper.findThreadsById(
        'thread-123'
      );
      expect(foundThreads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const addThreadPayload = new AddThread({
        title: 'sebuah thread',
        body: 'ini adalah sebuah thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Actions
      const addedThread = await threadRepositoryPostgres.addThread(
        addThreadPayload
      );

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'sebuah thread',
          owner: 'user-123',
        })
      );
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should not throw error when thread is available', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread('thread-123')
      ).resolves.not.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when thread is not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread('thread-123')
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should return threads correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      //Assert
      expect(thread.id).toEqual('thread-123');
      expect(thread.username).toEqual('dicoding');
    });
  });
});
