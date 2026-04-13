import NewThread from "../../Domains/threads/entities/NewThread.js";

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newThread = new NewThread(useCasePayload);
    // Kita mengirim newThread (berisi title & body yang sudah tervalidasi)
    // dan owner (id user yang sedang login) ke dalam repository
    return this._threadRepository.addThread(newThread, useCasePayload.owner);
  }
}

export default AddThreadUseCase;
