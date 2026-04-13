import express from "express";

const routes = (threadsController, commentsController, repliesController) => {
  const router = express.Router();

  // Route khusus Thread
  router.post("/", threadsController.postThread);
  router.get("/:threadId", threadsController.getThreadById);

  // Route khusus Comment
  router.post("/:threadId/comments", commentsController.postComment);
  router.delete(
    "/:threadId/comments/:commentId",
    commentsController.deleteComment
  );

  // Route khusus Reply
  router.post(
    "/:threadId/comments/:commentId/replies",
    repliesController.postReply
  );
  router.delete(
    "/:threadId/comments/:commentId/replies/:replyId",
    repliesController.deleteReply
  );

  return router;
};
export default routes;
