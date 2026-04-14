import ToggleLikeCommentUseCase from '../ToggleLikeCommentUseCase.js';
import LikeRepository from '../../../Domains/likes/LikeRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';

describe('ToggleLikeCommentUseCase', () => {
  it('should orchestration the add like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = vi.fn().mockImplementation(() => Promise.resolve());
    mockLikeRepository.checkLikeExistence = vi.fn().mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.addLike = vi.fn().mockImplementation(() => Promise.resolve());

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.checkLikeExistence).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.addLike).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });

  it('should orchestration the delete like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = vi.fn().mockImplementation(() => Promise.resolve());
    mockLikeRepository.checkLikeExistence = vi.fn().mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.deleteLike = vi.fn().mockImplementation(() => Promise.resolve());

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.checkLikeExistence).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.deleteLike).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });
});
