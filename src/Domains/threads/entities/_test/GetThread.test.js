const GetThread = require('../GetThread');

describe('a GetThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'belajar dicoding mahir',
      body: 'saya belajar dicoding mahir',
      // date: '2025-11-14T14:48:00.000Z',
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError(
      'GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: [],
      title: {},
      body: 123,
      date: 12.3,
      username: true,
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError(
      'GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create getThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'belajar dicoding mahir',
      body: 'saya belajar dicoding mahir',
      date: '2025-11-14T14:48:00.000Z',
      username: 'dicoding',
    };

    // Action
    const getThread = new GetThread(payload);

    // Assert
    expect(getThread.id).toEqual(payload.id);
    expect(getThread.title).toEqual(payload.title);
    expect(getThread.body).toEqual(payload.body);
    expect(getThread.date).toEqual(payload.date);
    expect(getThread.username).toEqual(payload.username);
  });
});
