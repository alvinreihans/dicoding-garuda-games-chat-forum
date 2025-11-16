const GetComment = require('../GetComment');

describe('a GetComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      // date: '2025-11-14T14:48:00.000Z',
      // content: 'sebuah komentar',
      // is_delete: 'false',
    };

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError(
      'GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2025-11-14T14:48:00.000Z',
      content: 'sebuah komentar',
      is_delete: 'false',
    };

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError(
      'GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create getDeletedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2025-11-14T14:48:00.000Z',
      content: 'sebuah komentar',
      is_delete: true,
    };

    // Action
    const getDeletedComment = new GetComment(payload);

    // Assert
    expect(getDeletedComment.id).toEqual(payload.id);
    expect(getDeletedComment.username).toEqual(payload.username);
    expect(getDeletedComment.date).toEqual(payload.date);
    expect(getDeletedComment.content).toEqual('**komentar telah dihapus**');
  });

  it('should create getComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2025-11-14T14:48:00.000Z',
      content: 'sebuah komentar',
      is_delete: false,
    };

    // Action
    const getComment = new GetComment(payload);

    // Assert
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(payload.date);
    expect(getComment.content).toEqual(payload.content);
  });
});
