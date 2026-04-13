import AddThreadUseCase from "../../../../Applications/use_case/AddThreadUseCase.js";
import GetThreadUseCase from "../../../../Applications/use_case/GetThreadUseCase.js";
import AuthenticationTokenManager from "../../../../Applications/security/AuthenticationTokenManager.js";
import AuthenticationError from "../../../../Commons/exceptions/AuthenticationError.js";

class ThreadsController {
  constructor(container) {
    this._container = container;
    this.postThread = this.postThread.bind(this);
    this.getThreadById = this.getThreadById.bind(this);
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

  async postThread(req, res, next) {
    try {
      const owner = await this._verifyAndGetOwner(req);
      const addThreadUseCase = this._container.getInstance(
        AddThreadUseCase.name
      );
      const addedThread = await addThreadUseCase.execute({
        ...req.body,
        owner,
      });
      res.status(201).json({ status: "success", data: { addedThread } });
    } catch (error) {
      next(error);
    }
  }

  async getThreadById(req, res, next) {
    try {
      const getThreadUseCase = this._container.getInstance(
        GetThreadUseCase.name
      );
      const thread = await getThreadUseCase.execute({
        threadId: req.params.threadId,
      });
      res.status(200).json({ status: "success", data: { thread } });
    } catch (error) {
      next(error);
    }
  }
}
export default ThreadsController;
