import NewComment from "../NewComment.js";

describe("a NewComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    expect(() => new NewComment({})).toThrowError(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    expect(() => new NewComment({ content: 123 })).toThrowError(
      "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create newComment object correctly", () => {
    const payload = { content: "sebuah comment" };
    const { content } = new NewComment(payload);
    expect(content).toEqual(payload.content);
  });
});
