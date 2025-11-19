class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
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
}

module.exports = DeleteCommentUseCase;
