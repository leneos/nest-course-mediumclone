import { CommentsResponseInterface } from './types/commentsResponse.interface';
import { ArticleCommentResponseInterface } from './types/articleCommentResponse.interface';
import { CommentEntity } from '@app/article/comment.entity';
import { EditArticleDto } from './dto/editArticleDto.dto';
import { ArticlesResponseInterface } from './types/ArticlesResponseInterface.interface';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UserEntity } from '@app/user/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import slugify from 'slugify';
import { FollowEntity } from '@app/profile/follow.entity';
import { AddArticleCommentDto } from './dto/addArticleComment.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articlesRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async findAll(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }
    if (query.author) {
      const author = await this.userRepository.findOne({
        username: query.author,
      });
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne(
        {
          username: query.favorited,
        },
        { relations: ['favorites'] },
      );
      const ids = author.favorites.map((el) => el.id);
      if (ids.length > 0) {
        queryBuilder.andWhere('articles.authorId IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favouriteIds: number[] = [];
    if (currentUserId) {
      const currentUser = await this.userRepository.findOne(currentUserId, {
        relations: ['favorites'],
      });
      favouriteIds = currentUser.favorites.map((favourite) => favourite.id);
    }

    const articles = await queryBuilder.getMany();
    const articleWithFavorites = articles.map((article) => {
      const favorited = favouriteIds.includes(article.id);
      return { ...article, favorited };
    });
    return { articles: articleWithFavorites, articlesCount };
  }
  async getFeed(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const follows = await this.followRepository.find({
      followerId: currentUserId,
    });
    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }
    const followingUserIds = follows.map((item) => item.followingId);
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN (:...ids)', { ids: followingUserIds });

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }
    const articles = await queryBuilder.getMany();
    return { articles, articlesCount };
  }
  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);
    if (!article.tagList) {
      article.tagList = [];
    }
    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser;
    return await this.articlesRepository.save(article);
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articlesRepository.findOne({ slug });
  }

  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    return await this.articlesRepository.delete({ slug });
  }

  async editArticle(
    slug: string,
    currentUserId: number,
    editArticleDto: EditArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    if (editArticleDto.title && editArticleDto.title !== article.title) {
      article.slug = this.getSlug(editArticleDto.title);
    }
    return await this.articlesRepository.save({
      ...article,
      ...editArticleDto,
    });
  }

  async addArticleToFavorites(
    currentUserId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['favorites'],
    });
    const isNotFavourited =
      user.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) === -1;
    if (isNotFavourited) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articlesRepository.save(article);
    }
    return article;
  }

  async deleteArticleFromFavorites(
    currentUserId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['favorites'],
    });
    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );
    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articlesRepository.save(article);
    }
    return article;
  }

  async addComment(
    currentUserId: number,
    slug: string,
    addArticleCommentDto: AddArticleCommentDto,
  ): Promise<CommentEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId);
    const comment = new CommentEntity();
    if (article) {
      Object.assign(comment, {
        body: addArticleCommentDto.body,
        author: user,
        article: article,
      });
      await this.commentRepository.save(comment);
    }
    return comment;
  }
  async deleteArticleComment(
    currentUserId: number,
    slug: string,
    commentId: string,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    await this.commentRepository.delete(commentId);

    return article;
  }

  async getArticleComments(slug: string, currentUserId?: number): Promise<any> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    const queryBuilder = getRepository(CommentEntity)
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.author', 'author')
      .orderBy('comments.createdAt', 'DESC')
      .where('comments.article = :article', {
        article: article.id,
      });

    const comments = await queryBuilder.getMany();

    if (currentUserId) {
      const follows = await this.followRepository.find({
        followerId: currentUserId,
      });

      if (follows.length === 0) {
        return comments.map((comment) => {
          return {
            ...comment,
            author: {
              ...comment.author,
              following: false,
            },
          };
        });
      }

      const followingUserIds = follows.map((item) => item.followingId);
      return comments.map((comment) => {
        console.log(Boolean(followingUserIds.indexOf(currentUserId)));
        return {
          ...comment,
          author: {
            ...comment.author,
            following: !!followingUserIds.indexOf(currentUserId),
          },
        };
      });
    }
    return comments.map((comment) => {
      return {
        ...comment,
        author: {
          ...comment.author,
          following: false,
        },
      };
    });
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }
  buildArticleCommentResponse(
    comment: CommentEntity,
  ): ArticleCommentResponseInterface {
    return {
      comment: {
        body: comment.body,
      },
    };
  }
  buildCommentsRepsonse(comments: CommentEntity[]): CommentsResponseInterface {
    return { comments };
  }
}
