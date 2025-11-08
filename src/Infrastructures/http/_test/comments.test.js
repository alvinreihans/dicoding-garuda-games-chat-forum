// Database connection
const pool = require('../../database/postgres/pool');

// Test helpers
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

// Dependency injection container
const container = require('../../container');

// HTTP server factory
const createServer = require('../createServer');

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
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.registerAndLogin({
        server,
        userPayload,
      });

      const addedThread = await ServerTestHelper.addThread({
        server,
        threadPayload: {
          title: threadPayload.title,
          body: threadPayload.body,
        },
        accessToken,
      });

      const requestPayload = {
        content: 'sebuah komentar',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 404 when commented thread is not valid', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.registerAndLogin({
        server,
        userPayload,
      });

      const requestPayload = {
        content: 'sebuah komentar',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-123/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });
  });

  it('should response 400 when request payload not contain needed property', async () => {
    // Arrange
    const server = await createServer(container);

    const { accessToken } = await ServerTestHelper.registerAndLogin({
      server,
      userPayload,
    });

    const addedThread = await ServerTestHelper.addThread({
      server,
      threadPayload: {
        title: threadPayload.title,
        body: threadPayload.body,
      },
      accessToken,
    });

    const requestPayload = {
      content: '',
    };

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments`,
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('properti comment tidak lengkap');
  });

  it('should response 400 when request payload not meet data type specification', async () => {
    // Arrange
    const server = await createServer(container);

    const { accessToken } = await ServerTestHelper.registerAndLogin({
      server,
      userPayload,
    });

    const addedThread = await ServerTestHelper.addThread({
      server,
      threadPayload: {
        title: threadPayload.title,
        body: threadPayload.body,
      },
      accessToken,
    });

    const requestPayload = {
      content: 123,
    };

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments`,
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
      'tipe data pada properti comment tidak sesuai'
    );
  });

  it('should response 401 when request request does not have authentication', async () => {
    // Arrange
    const server = await createServer(container);

    const { accessToken } = await ServerTestHelper.registerAndLogin({
      server,
      userPayload,
    });

    const addedThread = await ServerTestHelper.addThread({
      server,
      threadPayload: {
        title: threadPayload.title,
        body: threadPayload.body,
      },
      accessToken,
    });

    const requestPayload = {
      content: 123,
    };

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments`,
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(401);
    expect(responseJson.error).toEqual('Unauthorized');
    expect(responseJson.message).toEqual('Missing authentication');
  });
});
