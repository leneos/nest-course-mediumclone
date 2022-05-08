import { CommentEntity } from '../comment.entity';
export interface ArticleCommentResponseInterface {
  comment: {
    body: CommentEntity['body'];
  };
}
