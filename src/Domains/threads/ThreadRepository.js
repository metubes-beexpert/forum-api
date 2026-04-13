class ThreadRepository {
  async addThread(newThread, owner) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  // --- TAMBAHKAN FUNGSI INI ---
  async getThreadById(threadId) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  // Tambahkan di bawah getThreadById
  async verifyThreadAvailability(threadId) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

export default ThreadRepository;
