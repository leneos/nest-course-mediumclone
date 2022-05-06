import { UserEntity } from '@app/user/user.entity';
import { ArticleEntity } from './article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { FollowEntity } from '@app/profile/follow.entity';
@Module({
  controllers: [ArticleController],
  providers: [ArticleService],
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity]),
  ],
})
export class ArticleModule {}
