import routes from "./routes.js";
import ThreadsController from "./ThreadsController.js";
import CommentsController from "./CommentsController.js";
import RepliesController from "./RepliesController.js";

const threads = (container) => {
  const threadsController = new ThreadsController(container);
  const commentsController = new CommentsController(container);
  const repliesController = new RepliesController(container);

  return routes(threadsController, commentsController, repliesController);
};
export default threads;
