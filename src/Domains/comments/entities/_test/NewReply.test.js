import NewReply from "../../../replies/entities/NewReply.js";

describe("a NewReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    expect(() => new NewReply({})).toThrowError(
      "NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    expect(() => new NewReply({ content: 123 })).toThrowError(
      "NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create newReply object correctly", () => {
    const payload = { content: "sebuah balasan" };
    const { content } = new NewReply(payload);
    expect(content).toEqual(payload.content);
  });
});
