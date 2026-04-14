import DetailReply from "../../replies/entities/DetailReply.js";

class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, username, date, content, replies, is_delete, likeCount } = payload;
    this.id = id;
    this.username = username;
    this.date = date;
    this.replies = replies;
    this.likeCount = likeCount;
    this.content = is_delete ? "**komentar telah dihapus**" : content; // Logika soft-delete
  }

  _verifyPayload({ id, username, date, content, replies, is_delete, likeCount }) {
    if (
      !id ||
      !username ||
      !date ||
      !content ||
      !Array.isArray(replies) ||
      is_delete === undefined ||
      likeCount === undefined
    ) {
      throw new Error("DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      typeof date !== "string" ||
      typeof content !== "string" ||
      typeof is_delete !== "boolean" ||
      typeof likeCount !== "number"
    ) {
      throw new Error("DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}
export default DetailComment;
