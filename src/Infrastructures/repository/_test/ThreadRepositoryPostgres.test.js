const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

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
});
