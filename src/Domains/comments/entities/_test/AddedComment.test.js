import AddedComment from "../AddedComment.js";

describe("a AddedComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    expect(() => new AddedComment({ content: "sebuah comment" })).toThrowError(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    expect(
      () => new AddedComment({ id: 123, content: "sebuah comment", owner: {} })
    ).toThrowError("ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create addedComment object correctly", () => {
    const payload = {
      id: "comment-123",
      content: "sebuah comment",
      owner: "user-123",
    };
    const addedComment = new AddedComment(payload);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
