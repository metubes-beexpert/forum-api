import NewReply from "../../Domains/replies/entities/NewReply.js";

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, content, owner } = useCasePayload;
    const newReply = new NewReply({ content });

    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);

    return this._replyRepository.addReply(newReply, commentId, owner);
  }
}

export default AddReplyUseCase;
