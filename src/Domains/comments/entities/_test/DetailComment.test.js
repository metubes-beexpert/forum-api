import DetailComment from "../DetailComment.js";

describe("a DetailComment entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    expect(() => new DetailComment({})).toThrowError(
      "DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should throw error when payload did not meet data type specification", () => {
    // Mengirim array kosong pada replies agar lolos if pertama
    expect(
      () =>
        new DetailComment({
          id: 123,
          username: "user",
          date: "date",
          content: "content",
          replies: [],
          is_delete: false,
        })
    ).toThrowError("DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });
  it("should create detailComment object correctly when is_delete is false", () => {
    const payload = {
      id: "comment-123",
      username: "user",
      date: "date",
      content: "sebuah comment",
      replies: [],
      is_delete: false,
    };
    const detailComment = new DetailComment(payload);
    expect(detailComment.content).toEqual("sebuah comment");
  });
  it("should modify content when is_delete is true", () => {
    const payload = {
      id: "comment-123",
      username: "user",
      date: "date",
      content: "sebuah comment",
      replies: [],
      is_delete: true,
    };
    const detailComment = new DetailComment(payload);
    expect(detailComment.content).toEqual("**komentar telah dihapus**");
  });
});
