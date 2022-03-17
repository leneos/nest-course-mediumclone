import { ProfileController } from './profile.controller';
import { UserEntity } from '@app/user/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { FollowEntity } from './follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
