import LikeRepository from '../../Domains/likes/LikeRepository.js';

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(commentId, owner) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO thread_comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, owner],
    };
    await this._pool.query(query);
  }

  async deleteLike(commentId, owner) {
    const query = {
      text: 'DELETE FROM thread_comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };
    await this._pool.query(query);
  }

  async checkLikeExistence(commentId, owner) {
    const query = {
      text: 'SELECT id FROM thread_comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async getLikesByThreadId(threadId) {
    const query = {
      text: `SELECT thread_comment_likes.comment_id 
             FROM thread_comment_likes 
             INNER JOIN comments ON comments.id = thread_comment_likes.comment_id 
             WHERE comments.thread_id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

export default LikeRepositoryPostgres;
