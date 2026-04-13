import NewComment from "../../Domains/comments/entities/NewComment.js";

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, content, owner } = useCasePayload;

    // 1. Validasi input content
    const newComment = new NewComment({ content });

    // 2. Pastikan thread-nya ada di database (jika tidak ada, otomatis melempar error 404)
    await this._threadRepository.verifyThreadAvailability(threadId);

    // 3. Simpan komentar
    return this._commentRepository.addComment(newComment, threadId, owner);
  }
}

export default AddCommentUseCase;
