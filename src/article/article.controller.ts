import { CommentsResponseInterface } from './types/commentsResponse.interface';
import { CommentEntity } from '@app/article/comment.entity';
import { BackedValidationPipe } from './../shared/pipes/BackedValidation.pipe';
import { ArticlesResponseInterface } from './types/ArticlesResponseInterface.interface';
import { EditArticleDto } from './dto/editArticleDto.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UserEntity } from '@app/user/user.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { User } from '@app/user/decorators/user.decorator';
import { AddArticleCommentDto } from './dto/addArticleComment.dto';
import { ArticleCommentResponseInterface } from './types/articleCommentResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAll(currentUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.getFeed(currentUserId, query);
  }

  @Get(':slug')
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackedValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    return await this.articleService.deleteArticle(slug, currentUserId);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackedValidationPipe())
  async editArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') editArticleDto: EditArticleDto,
  ): Promise<ArticleResponseInterface> {
    const newArticle = await this.articleService.editArticle(
      slug,
      currentUserId,
      editArticleDto,
    );
    return this.articleService.buildArticleResponse(newArticle);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  @UsePipes(new BackedValidationPipe())
  async addArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.addArticleToFavorites(
      currentUserId,
      slug,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  @UsePipes(new BackedValidationPipe())
  async deleteArticleFromFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.deleteArticleFromFavorites(
      currentUserId,
      slug,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Post(':slug/comments')
  @UseGuards(AuthGuard)
  @UsePipes(new BackedValidationPipe())
  async addArticleComment(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('comment') addArticleCommentDto: AddArticleCommentDto,
  ): Promise<ArticleCommentResponseInterface> {
    const comment = await this.articleService.addComment(
      currentUserId,
      slug,
      addArticleCommentDto,
    );
    return this.articleService.buildArticleCommentResponse(comment);
  }
  @Delete(':slug/comments/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new BackedValidationPipe())
  async deleteArticleComment(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Param('id') commentId: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.deleteArticleComment(
      currentUserId,
      slug,
      commentId,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug/comments')
  @UsePipes(new BackedValidationPipe())
  async getArticleComments(
    @Param('slug') slug: string,
  ): Promise<CommentsResponseInterface> {
    const comments = await this.articleService.getArticleComments(slug);
    return this.articleService.buildCommentsRepsonse(comments);
  }
}
