class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    // periksa thread
    await this._threadRepository.verifyAvailableThread(useCasePayload.thread);
    // periksa comment
    await this._commentRepository.verifyAvailableComment(useCasePayload.id);
    await this._commentRepository.verifyCommentOwner(
      useCasePayload.id,
      useCasePayload.owner
    );
    // soft delete komentar
    await this._commentRepository.deleteComment(useCasePayload.id);
  }

  _validatePayload(payload) {
    const { id, thread, owner } = payload;
    if (!id || !thread || !owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof thread !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error(
        'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = DeleteCommentUseCase;
