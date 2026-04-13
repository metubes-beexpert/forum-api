import RepliesTableTestHelper from "../../../../tests/RepliesTableTestHelper.js";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import NewReply from "../../../Domains/replies/entities/NewReply.js";
import AddedReply from "../../../Domains/replies/entities/AddedReply.js";
import pool from "../../database/postgres/pool.js";
import ReplyRepositoryPostgres from "../ReplyRepositoryPostgres.js";
import NotFoundError from "../../../Commons/exceptions/NotFoundError.js";
import AuthorizationError from "../../../Commons/exceptions/AuthorizationError.js";

describe("ReplyRepositoryPostgres", () => {
  beforeAll(async () => {
    // Gunakan ID unik khusus balasan
    await UsersTableTestHelper.addUser({
      id: "user-reply-123",
      username: "dicoding_reply",
    });
    await ThreadsTableTestHelper.addThread({
      id: "thread-reply-123",
      owner: "user-reply-123",
    });
    await CommentsTableTestHelper.addComment({
      id: "comment-reply-123",
      threadId: "thread-reply-123",
      owner: "user-reply-123",
    });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addReply function", () => {
    it("should persist new reply and return added reply correctly", async () => {
      const newReply = new NewReply({ content: "sebuah balasan" });
      const fakeIdGenerator = () => "123";
      const repository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await repository.addReply(
        newReply,
        "comment-reply-123",
        "user-reply-123"
      );
      const replies = await RepliesTableTestHelper.findRepliesById("reply-123");
      expect(replies).toHaveLength(1);
    });

    it("should return added reply correctly", async () => {
      const newReply = new NewReply({ content: "sebuah balasan" });
      const fakeIdGenerator = () => "123";
      const repository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const addedReply = await repository.addReply(
        newReply,
        "comment-reply-123",
        "user-reply-123"
      );

      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: "sebuah balasan",
          owner: "user-reply-123",
        })
      );
    });
  });

  describe("checkAvailabilityReply function", () => {
    it("should throw NotFoundError when reply not available", async () => {
      const repository = new ReplyRepositoryPostgres(pool, {});
      await expect(
        repository.checkAvailabilityReply("reply-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when reply available", async () => {
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-reply-123",
        owner: "user-reply-123",
      });
      const repository = new ReplyRepositoryPostgres(pool, {});
      await expect(
        repository.checkAvailabilityReply("reply-123")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("verifyReplyOwner function", () => {
    it("should throw AuthorizationError when user is not the owner", async () => {
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-reply-123",
        owner: "user-reply-123",
      });
      const repository = new ReplyRepositoryPostgres(pool, {});
      await expect(
        repository.verifyReplyOwner("reply-123", "user-456")
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when user is the owner", async () => {
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-reply-123",
        owner: "user-reply-123",
      });
      const repository = new ReplyRepositoryPostgres(pool, {});
      await expect(
        repository.verifyReplyOwner("reply-123", "user-reply-123")
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("deleteReply function", () => {
    it("should soft delete reply", async () => {
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-reply-123",
        owner: "user-reply-123",
      });
      const repository = new ReplyRepositoryPostgres(pool, {});

      await repository.deleteReply("reply-123");
      const replies = await RepliesTableTestHelper.findRepliesById("reply-123");
      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe("getRepliesByThreadId function", () => {
    it("should return replies correctly", async () => {
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-reply-123",
        owner: "user-reply-123",
        isDelete: false,
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah balasan",
      });
      const repository = new ReplyRepositoryPostgres(pool, {});
      const replies = await repository.getRepliesByThreadId("thread-reply-123");

      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual("reply-123");
      expect(replies[0].username).toEqual("dicoding_reply");
    });
  });
});
