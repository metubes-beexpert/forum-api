class ToggleLikeCommentUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;

    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);

    const isLiked = await this._likeRepository.checkLikeExistence(
      commentId,
      owner
    );

    if (isLiked) {
      await this._likeRepository.deleteLike(commentId, owner);
    } else {
      await this._likeRepository.addLike(commentId, owner);
    }
  }
}

export default ToggleLikeCommentUseCase;
