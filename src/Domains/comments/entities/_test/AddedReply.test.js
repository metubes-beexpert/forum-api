import AddedReply from "../../../replies/entities/AddedReply.js";

describe("a AddedReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    expect(() => new AddedReply({ content: "sebuah balasan" })).toThrowError(
      "ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    expect(
      () => new AddedReply({ id: 123, content: "balasan", owner: {} })
    ).toThrowError("ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create addedReply object correctly", () => {
    const payload = {
      id: "reply-123",
      content: "sebuah balasan",
      owner: "user-123",
    };
    const addedReply = new AddedReply(payload);
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
