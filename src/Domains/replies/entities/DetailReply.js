class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, date, username, is_delete } = payload;
    this.id = id;
    this.date = date;
    this.username = username;
    this.content = is_delete ? "**balasan telah dihapus**" : content; // Logika soft-delete
  }

  _verifyPayload({ id, content, date, username, is_delete }) {
    if (!id || !content || !date || !username || is_delete === undefined) {
      throw new Error("DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string" ||
      typeof is_delete !== "boolean"
    ) {
      throw new Error("DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}
export default DetailReply;
