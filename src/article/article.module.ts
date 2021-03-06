import { UserEntity } from '@app/user/user.entity';
import { ArticleEntity } from './article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { FollowEntity } from '@app/profile/follow.entity';
import { CommentEntity } from '@app/article/comment.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
@Module({
  controllers: [ArticleController],
  providers: [ArticleService, AuthGuard],
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      UserEntity,
      FollowEntity,
      CommentEntity,
    ]),
  ],
})
export class ArticleModule {}
