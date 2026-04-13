import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import NewThread from "../../../Domains/threads/entities/NewThread.js";
import AddedThread from "../../../Domains/threads/entities/AddedThread.js";
import pool from "../../database/postgres/pool.js";
import ThreadRepositoryPostgres from "../ThreadRepositoryPostgres.js";
import NotFoundError from "../../../Commons/exceptions/NotFoundError.js";

describe("ThreadRepositoryPostgres", () => {
  beforeAll(async () => {
    // Menggunakan user unik khusus file ini agar tidak tabrakan
    await UsersTableTestHelper.addUser({
      id: "user-thread-123",
      username: "dicoding_thread",
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist new thread and return added thread correctly", async () => {
      const newThread = new NewThread({
        title: "sebuah thread",
        body: "sebuah body thread",
      });
      const fakeIdGenerator = () => "123";
      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await repository.addThread(newThread, "user-thread-123");

      const threads = await ThreadsTableTestHelper.findThreadById("thread-123");
      expect(threads).toHaveLength(1);
    });

    it("should return added thread correctly", async () => {
      const newThread = new NewThread({
        title: "sebuah thread",
        body: "sebuah body thread",
      });
      const fakeIdGenerator = () => "123";
      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await repository.addThread(
        newThread,
        "user-thread-123"
      );

      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "sebuah thread",
          owner: "user-thread-123",
        })
      );
    });
  });

  describe("verifyThreadAvailability function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      const repository = new ThreadRepositoryPostgres(pool, {});
      await expect(
        repository.verifyThreadAvailability("thread-123")
      ).rejects.toThrowError(NotFoundError);
    });
    it("should not throw NotFoundError when thread exists", async () => {
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-thread-123",
      });
      const repository = new ThreadRepositoryPostgres(pool, {});
      await expect(
        repository.verifyThreadAvailability("thread-123")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("getThreadById function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      const repository = new ThreadRepositoryPostgres(pool, {});
      await expect(repository.getThreadById("thread-123")).rejects.toThrowError(
        NotFoundError
      );
    });
    it("should return thread correctly", async () => {
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        title: "sebuah thread",
        body: "sebuah body thread",
        date: "2021-08-08T07:19:09.775Z",
        owner: "user-thread-123",
      });
      const repository = new ThreadRepositoryPostgres(pool, {});
      const thread = await repository.getThreadById("thread-123");

      expect(thread.id).toEqual("thread-123");
      expect(thread.title).toEqual("sebuah thread");
      expect(thread.username).toEqual("dicoding_thread");
    });
  });
});
