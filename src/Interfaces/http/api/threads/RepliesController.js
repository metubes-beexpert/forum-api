import AddReplyUseCase from "../../../../Applications/use_case/AddReplyUseCase.js";
import DeleteReplyUseCase from "../../../../Applications/use_case/DeleteReplyUseCase.js";
import AuthenticationTokenManager from "../../../../Applications/security/AuthenticationTokenManager.js";
import AuthenticationError from "../../../../Commons/exceptions/AuthenticationError.js";

class RepliesController {
  constructor(container) {
    this._container = container;
    this.postReply = this.postReply.bind(this);
    this.deleteReply = this.deleteReply.bind(this);
    this._verifyAndGetOwner = this._verifyAndGetOwner.bind(this);
  }

  async _verifyAndGetOwner(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new AuthenticationError("Missing authentication");
    const token = authHeader.split(" ")[1];
    const tokenManager = this._container.getInstance(
      AuthenticationTokenManager.name
    );
    try {
      const payload = await tokenManager.decodePayload(token);
      return payload.id;
    } catch (error) {
      throw new AuthenticationError("Token tidak valid");
    }
  }

  async postReply(req, res, next) {
    try {
      const owner = await this._verifyAndGetOwner(req);
      const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
      const addedReply = await addReplyUseCase.execute({
        ...req.body,
        threadId: req.params.threadId,
        commentId: req.params.commentId,
        owner,
      });
      res.status(201).json({ status: "success", data: { addedReply } });
    } catch (error) {
      next(error);
    }
  }

  async deleteReply(req, res, next) {
    try {
      const owner = await this._verifyAndGetOwner(req);
      const deleteReplyUseCase = this._container.getInstance(
        DeleteReplyUseCase.name
      );
      await deleteReplyUseCase.execute({
        threadId: req.params.threadId,
        commentId: req.params.commentId,
        replyId: req.params.replyId,
        owner,
      });
      res.status(200).json({ status: "success" });
    } catch (error) {
      next(error);
    }
  }
}
export default RepliesController;
