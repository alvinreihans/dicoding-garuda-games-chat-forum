// Database connection
const pool = require('../../database/postgres/pool');

// Test helpers
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

// Dependency injection container
const container = require('../../container');

// HTTP server factory
const createServer = require('../createServer');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/threads endpoint', () => {
  const userPayload = {
    username: 'dicoding',
    password: 'secret',
    fullname: 'Dicoding Indonesia',
  };

  const threadPayload = {
    title: 'sebuah thread',
    body: 'ini adalah sebuah thread',
  };

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.registerAndLogin({
        server,
        userPayload,
      });

      const requestPayload = {
        title: 'sebuah thread',
        body: 'ini adalah sebuah thread',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();

      const { addedThread } = responseJson.data;
      expect(addedThread.title).toEqual(requestPayload.title);
      expect(addedThread.id).toBeDefined();
      expect(addedThread.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.registerAndLogin({
        server,
        userPayload,
      });

      const requestPayload = {
        title: 'sebuah thread',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread karena properti yang dibutuhkan tidak lengkap'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.registerAndLogin({
        server,
        userPayload,
      });

      const requestPayload = {
        title: 123,
        body: [],
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread karena tipe data tidak sesuai'
      );
    });

    it('should response 401 when request request does not have authentication', async () => {
      // Arrange
      const server = await createServer(container);

      const requestPayload = {
        title: 'sebuah thread',
        body: 'ini adalah sebuah thread',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });
  describe('when GET /threads/{threadsId}', () => {
    it('should response 200 and return thread with comment', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper.registerAndLogin({
        server,
        userPayload,
      });

      const addedThread = await ServerTestHelper.addThread({
        server,
        threadPayload,
        accessToken,
      });

      const userThread = await UsersTableTestHelper.findUsersById(userId);

      const addedComment1 = await ServerTestHelper.addComment({
        server,
        commentPayload: { content: 'Komentar yang akan dihapus' },
        threadId: addedThread.id,
        accessToken,
      });

      const userComment = await UsersTableTestHelper.findUsersById(userId);

      await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment1.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const addedComment2 = await ServerTestHelper.addComment({
        server,
        commentPayload: { content: 'Komentar yang TIDAK dihapus' },
        threadId: addedThread.id,
        accessToken,
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();

      const thread = responseJson.data.thread;
      expect(thread.id).toEqual(addedThread.id);
      expect(thread.title).toEqual(threadPayload.title);
      expect(thread.body).toEqual(threadPayload.body);
      expect(thread.username).toEqual(userThread[0].username);

      expect(thread.comments).toHaveLength(2);

      const deletedComment = thread.comments.find(
        (comment) => comment.id === addedComment1.id
      );
      expect(deletedComment.content).toEqual('**komentar telah dihapus**');
      expect(deletedComment.username).toEqual(userComment[0].username);

      const normalComment = thread.comments.find(
        (comment) => comment.id === addedComment2.id
      );
      expect(normalComment.content).toEqual('Komentar yang TIDAK dihapus');
      expect(normalComment.username).toEqual(userComment[0].username);
    });

    it('should response 404 when thread is not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-yang-tidak-ada',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
