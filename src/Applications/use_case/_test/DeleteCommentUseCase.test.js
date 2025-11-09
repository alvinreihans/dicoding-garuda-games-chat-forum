const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should throw error if use case payload not contain needed properties', async () => {
    // Arrange
    const useCasePayload = {};

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => {
        Promise.resolve();
      });
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => {
        Promise.resolve();
      });
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => {
        Promise.resolve();
      });
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => {
      Promise.resolve();
    });

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(
      deleteCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });
  it('should throw error if use case payload not string', async () => {
    // Arrange
    // Arrange
    const useCasePayload = {
      id: 123,
      thread: true,
      owner: [],
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => {
        Promise.resolve();
      });
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => {
        Promise.resolve();
      });
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => {
        Promise.resolve();
      });
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => {
      Promise.resolve();
    });

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(
      deleteCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      thread: 'thread-123',
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.id
    );
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload.id,
      useCasePayload.owner
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      useCasePayload.id
    );
  });
});
