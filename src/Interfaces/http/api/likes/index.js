import LikesController from './LikesController.js';
import routes from './routes.js';

export default {
  name: 'likes',
  register: async (app, { container }) => {
    const likesController = new LikesController(container);
    app.use('/threads', routes(likesController));
  },
};
