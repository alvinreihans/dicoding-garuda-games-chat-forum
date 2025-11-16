class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    // periksa thread exist
    await this._threadRepository.verifyAvailableThread(useCasePayload.id);

    // Ambil data thread
    const thread = await this._threadRepository.getThreadById(
      useCasePayload.id
    );

    // Ambil semua comment berdasarkan threadId
    const getComments = await this._commentRepository.getCommentsByThreadId(
      useCasePayload.id
    );

    // Tambahkan comments ke dalam thread
    thread.comments = getComments;

    return thread;
  }
}

module.exports = GetThreadUseCase;
