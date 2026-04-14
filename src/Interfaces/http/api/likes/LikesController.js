import ToggleLikeCommentUseCase from '../../../../Applications/use_case/ToggleLikeCommentUseCase.js';
import AuthenticationTokenManager from '../../../../Applications/security/AuthenticationTokenManager.js';
import AuthenticationError from '../../../../Commons/exceptions/AuthenticationError.js';

class LikesController {
  constructor(container) {
    this._container = container;
    this.putLikeHandler = this.putLikeHandler.bind(this);
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

  async putLikeHandler(req, res, next) {
    try {
      const owner = await this._verifyAndGetOwner(req);

      const toggleLikeCommentUseCase = this._container.getInstance(ToggleLikeCommentUseCase.name);
      
      await toggleLikeCommentUseCase.execute({
        threadId: req.params.threadId,
        commentId: req.params.commentId,
        owner,
      });

      res.status(200).json({
        status: 'success'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LikesController;
