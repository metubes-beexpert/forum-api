import express from 'express';

const routes = (controller) => {
  const router = express.Router();

  router.put('/:threadId/comments/:commentId/likes', controller.putLikeHandler.bind(controller));

  return router;
};

export default routes;
