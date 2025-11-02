const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // pengecekan payload
    const thread = new AddThread(useCasePayload);

    // tambahkan ke repository
    return this._threadRepository.addThread(thread);
  }
}

module.exports = AddThreadUseCase;
