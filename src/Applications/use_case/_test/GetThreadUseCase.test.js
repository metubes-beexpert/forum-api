import { vi } from "vitest";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import ReplyRepository from "../../../Domains/replies/ReplyRepository.js";
import GetThreadUseCase from "../GetThreadUseCase.js";
import DetailThread from "../../../Domains/threads/entities/DetailThread.js";
import DetailComment from "../../../Domains/comments/entities/DetailComment.js";
import DetailReply from "../../../Domains/replies/entities/DetailReply.js";

describe("GetThreadUseCase", () => {
  it("should orchestrating the get thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };

    const expectedThread = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
    };

    const expectedComments = [
      {
        id: "comment-1",
        username: "dicoding",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
        is_delete: false,
      },
      {
        id: "comment-2",
        username: "johndoe",
        date: "2021-08-08T07:26:21.338Z",
        content: "rahasia",
        is_delete: true,
      },
    ];

    const expectedReplies = [
      {
        id: "reply-1",
        comment_id: "comment-1",
        content: "sebuah balasan",
        date: "2021-08-08T07:30:33.555Z",
        username: "dicoding",
        is_delete: false,
      },
      {
        id: "reply-2",
        comment_id: "comment-1",
        content: "balasan rahasia",
        date: "2021-08-08T07:32:33.555Z",
        username: "johndoe",
        is_delete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = vi
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = vi
      .fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockReplyRepository.getRepliesByThreadId = vi
      .fn()
      .mockImplementation(() => Promise.resolve(expectedReplies));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert (Di sini kita membungkus expected output dengan Entitas)
    const expectedDetailThread = new DetailThread({
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [
        new DetailComment({
          id: "comment-1",
          username: "dicoding",
          date: "2021-08-08T07:22:33.555Z",
          content: "sebuah comment",
          is_delete: false,
          replies: [
            new DetailReply({
              id: "reply-1",
              content: "sebuah balasan",
              date: "2021-08-08T07:30:33.555Z",
              username: "dicoding",
              is_delete: false,
            }),
            new DetailReply({
              id: "reply-2",
              content: "balasan rahasia",
              date: "2021-08-08T07:32:33.555Z",
              username: "johndoe",
              is_delete: true,
            }),
          ],
        }),
        new DetailComment({
          id: "comment-2",
          username: "johndoe",
          date: "2021-08-08T07:26:21.338Z",
          content: "rahasia",
          is_delete: true,
          replies: [],
        }),
      ],
    });

    expect(detailedThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
      useCasePayload.threadId
    );
  });
});
