import DetailReply from "../entities/DetailReply.js";

describe("a DetailReply entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    expect(() => new DetailReply({})).toThrowError(
      "DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should throw error when payload did not meet data type specification", () => {
    expect(
      () =>
        new DetailReply({
          id: 123,
          content: "content",
          date: "date",
          username: "user",
          is_delete: false,
        })
    ).toThrowError("DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });
  it("should create detailReply object correctly when is_delete is false", () => {
    const payload = {
      id: "reply-123",
      content: "sebuah balasan",
      date: "date",
      username: "user",
      is_delete: false,
    };
    const detailReply = new DetailReply(payload);
    expect(detailReply.content).toEqual("sebuah balasan");
  });
  it("should modify content when is_delete is true", () => {
    const payload = {
      id: "reply-123",
      content: "sebuah balasan",
      date: "date",
      username: "user",
      is_delete: true,
    };
    const detailReply = new DetailReply(payload);
    expect(detailReply.content).toEqual("**balasan telah dihapus**");
  });
});
