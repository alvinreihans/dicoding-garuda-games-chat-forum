const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment', async () => {
      // Arrange
      const addCommentPayload = new AddComment({
        content: 'sebuah komentar',
        thread: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(addCommentPayload);

      // Assert
      const addedComment = await CommentsTableTestHelper.findCommentsById(
        'comment-123'
      );
      expect(addedComment).toHaveLength(1);
    });

    it('should return added comments correctly', async () => {
      // Arrange
      const addCommentPayload = new AddComment({
        content: 'sebuah komentar',
        thread: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Actions
      const addedComment = await commentRepositoryPostgres.addComment(
        addCommentPayload
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'sebuah komentar',
          owner: 'user-123',
        })
      );
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should not throw error when comment exists in the database', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment('comment-123')
      ).resolves.not.toThrow(NotFoundError);
    });
    it('should throw NotFoundError when comment does not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment('comment-123')
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should not throw error when the authenticated user IS the comment owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')
      ).resolves.not.toThrow(AuthorizationError);
    });
    it('should throw AuthorizationError when the authenticated user is NOT the comment owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-x')
      ).rejects.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should soft delete comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const deletedComment =
        commentRepositoryPostgres.deleteComment('comment-123');
      const comments = await CommentsTableTestHelper.findCommentsById(
        'comment-123'
      );

      // Assert
      await expect(deletedComment).resolves.not.toThrowError();

      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should get all related comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
        owner: 'user-123',
        isDelete: false,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        thread: 'thread-123',
        owner: 'user-123',
        isDelete: true,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-123'
      );

      // Assert
      await expect(comments).toHaveLength(2);
      await expect(comments[1].content).toEqual('**komentar telah dihapus**');
    });
  });
});
