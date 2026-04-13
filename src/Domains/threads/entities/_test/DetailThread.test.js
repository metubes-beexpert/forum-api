import DetailThread from "../DetailThread.js";

describe("a DetailThread entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    expect(() => new DetailThread({ title: "title" })).toThrowError(
      "DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should throw error when payload did not meet data type specification", () => {
    // Mengirim array kosong pada comments untuk melewati if pertama, dan id number (123) untuk gagal di if kedua
    expect(
      () =>
        new DetailThread({
          id: 123,
          title: "title",
          body: "body",
          date: "date",
          username: "user",
          comments: [],
        })
    ).toThrowError("DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });
  it("should create detailThread object correctly", () => {
    const payload = {
      id: "thread-123",
      title: "title",
      body: "body",
      date: "date",
      username: "user",
      comments: [],
    };
    const detailThread = new DetailThread(payload);
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.comments).toEqual(payload.comments);
  });
});
