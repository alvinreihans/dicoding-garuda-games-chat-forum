const GetThread = require('../../../Domains/threads/entities/GetThread');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };

    const mockGetThread = new GetThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'ini adalah sebuah thread',
      date: '2025-11-14T14:48:00.000Z',
      username: 'dicoding',
    });

    const mockGetComment = [
      new GetComment({
        id: 'comment-123',
        username: 'dicoding',
        date: '2025-11-14T14:48:00.000Z',
        content: 'sebuah komentar',
        is_delete: false,
      }),
      new GetComment({
        id: 'comment-456',
        username: 'dicoding',
        date: '2025-11-14T14:48:00.000Z',
        content: 'sebuah komentar',
        is_delete: true,
      }),
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockGetThread));

    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockGetComment));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    mockGetThread.comments = mockGetComment;

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(getThread).toStrictEqual(mockGetThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(mockGetThread.id);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      mockGetThread.id
    );
    expect(mockGetThread.comments[1].content).toStrictEqual(
      '**komentar telah dihapus**'
    );
  });
});
