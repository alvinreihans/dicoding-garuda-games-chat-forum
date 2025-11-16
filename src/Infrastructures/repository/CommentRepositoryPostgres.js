// Exceptions
const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
// Domain
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const GetComment = require('../../Domains/comments/entities/GetComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const { content, thread, owner } = comment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const isDelete = false;

    const query = {
      text: `INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id, content, owner`,
      values: [id, content, thread, owner, date, isDelete],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async verifyAvailableComment(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, userId) {
    const query = {
      text: 'SELECT id, owner FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete=TRUE WHERE id=$1',
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete
            FROM comments
            LEFT JOIN users ON comments.owner = users.id
            WHERE comments.thread_id = $1 
            ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const comments = await this._pool.query(query);
    return comments.rows.map((row) => new GetComment(row));
  }
}

module.exports = CommentRepositoryPostgres;
