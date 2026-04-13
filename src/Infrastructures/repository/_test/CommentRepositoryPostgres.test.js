import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import NewComment from "../../../Domains/comments/entities/NewComment.js";
import AddedComment from "../../../Domains/comments/entities/AddedComment.js";
import pool from "../../database/postgres/pool.js";
import CommentRepositoryPostgres from "../CommentRepositoryPostgres.js";
import NotFoundError from "../../../Commons/exceptions/NotFoundError.js";
import AuthorizationError from "../../../Commons/exceptions/AuthorizationError.js";

describe("CommentRepositoryPostgres", () => {
  // Hanya daftarkan prasyarat (User & Thread) SATU KALI di awal
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-123",
      username: "dicoding",
    });
    await ThreadsTableTestHelper.addThread({
      id: "thread-123",
      owner: "user-123",
    });
  });

  // Hanya bersihkan tabel komentar setiap selesai test agar test bersih
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  // Bersihkan semua prasyarat di akhir dan tutup koneksi database
  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist new comment and return added comment correctly", async () => {
      const newComment = new NewComment({ content: "sebuah comment" });
      const fakeIdGenerator = () => "123"; // Akan menghasilkan 'comment-123'
      const repository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await repository.addComment(newComment, "thread-123", "user-123");

      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );
      expect(comments).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      const newComment = new NewComment({ content: "sebuah comment" });
      const fakeIdGenerator = () => "123";
      const repository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await repository.addComment(
        newComment,
        "thread-123",
        "user-123"
      );

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "sebuah comment",
          owner: "user-123",
        })
      );
    });
  });

  describe("checkAvailabilityComment function", () => {
    it("should throw NotFoundError when comment not available", async () => {
      const repository = new CommentRepositoryPostgres(pool, {});
      await expect(
        repository.checkAvailabilityComment("comment-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when comment available", async () => {
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      const repository = new CommentRepositoryPostgres(pool, {});
      await expect(
        repository.checkAvailabilityComment("comment-123")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should throw AuthorizationError when user is not the owner", async () => {
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      const repository = new CommentRepositoryPostgres(pool, {});
      await expect(
        repository.verifyCommentOwner("comment-123", "user-456")
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when user is the owner", async () => {
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      const repository = new CommentRepositoryPostgres(pool, {});
      await expect(
        repository.verifyCommentOwner("comment-123", "user-123")
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("deleteComment function", () => {
    it("should soft delete comment", async () => {
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      const repository = new CommentRepositoryPostgres(pool, {});

      await repository.deleteComment("comment-123");

      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe("getCommentsByThreadId function", () => {
    it("should return comments correctly", async () => {
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
        isDelete: false,
        date: "2021-08-08T07:22:33.555Z",
      });

      const repository = new CommentRepositoryPostgres(pool, {});
      const comments = await repository.getCommentsByThreadId("thread-123");

      expect(comments).toBeInstanceOf(Array);
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual("comment-123");
      expect(comments[0].username).toEqual("dicoding");
      expect(comments[0].content).toEqual("sebuah comment");
      expect(comments[0].date).toEqual("2021-08-08T07:22:33.555Z");
      expect(comments[0].is_delete).toEqual(false);
    });
  });
});
