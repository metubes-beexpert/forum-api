import DetailThread from "../../Domains/threads/entities/DetailThread.js";
import DetailComment from "../../Domains/comments/entities/DetailComment.js";
import DetailReply from "../../Domains/replies/entities/DetailReply.js";

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    const detailComments = comments.map((comment) => {
      const commentReplies = replies
        .filter((reply) => reply.comment_id === comment.id)
        .map(
          (reply) =>
            new DetailReply({
              id: reply.id,
              content: reply.content,
              date: reply.date,
              username: reply.username,
              is_delete: reply.is_delete,
            })
        );

      return new DetailComment({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
        replies: commentReplies,
        is_delete: comment.is_delete,
      });
    });

    return new DetailThread({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: detailComments,
    });
  }
}
export default GetThreadUseCase;
