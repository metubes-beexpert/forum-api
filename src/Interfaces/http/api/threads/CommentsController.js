import AddCommentUseCase from "../../../../Applications/use_case/AddCommentUseCase.js";
import DeleteCommentUseCase from "../../../../Applications/use_case/DeleteCommentUseCase.js";
import AuthenticationTokenManager from "../../../../Applications/security/AuthenticationTokenManager.js";
import AuthenticationError from "../../../../Commons/exceptions/AuthenticationError.js";

class CommentsController {
  constructor(container) {
    this._container = container;
    this.postComment = this.postComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
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

  async postComment(req, res, next) {
    try {
      const owner = await this._verifyAndGetOwner(req);
      const addCommentUseCase = this._container.getInstance(
        AddCommentUseCase.name
      );
      const addedComment = await addCommentUseCase.execute({
        ...req.body,
        threadId: req.params.threadId,
        owner,
      });
      res.status(201).json({ status: "success", data: { addedComment } });
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const owner = await this._verifyAndGetOwner(req);
      const deleteCommentUseCase = this._container.getInstance(
        DeleteCommentUseCase.name
      );
      await deleteCommentUseCase.execute({
        threadId: req.params.threadId,
        commentId: req.params.commentId,
        owner,
      });
      res.status(200).json({ status: "success" });
    } catch (error) {
      next(error);
    }
  }
}
export default CommentsController;
