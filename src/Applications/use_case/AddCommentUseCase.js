const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    // periksa thread
    await this._threadRepository.verifyAvailableThread(useCasePayload.thread);

    // pengecekan payload
    const comment = new AddComment(useCasePayload);

    // tambahkan ke repository
    return this._commentRepository.addComment(comment);
  }
}

module.exports = AddCommentUseCase;
