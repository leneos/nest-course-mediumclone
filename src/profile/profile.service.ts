import { FollowEntity } from './follow.entity';
import { ProfileType } from './types/profile.type';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { UserEntity } from './../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepostory: Repository<FollowEntity>,
  ) {}

  async getProfile(
    currentUserId: number,
    username: UserEntity['username'],
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new HttpException("Profile doesn't exist", HttpStatus.NOT_FOUND);
    }
    return { ...user, following: false };
  }

  async followProfile(
    currentUserId: number,
    username: UserEntity['username'],
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new HttpException("Profile doesn't exist", HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException(
        "Follower and following can't be equal",
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepostory.findOne({
      followerId: currentUserId,
      followingId: user.id,
    });

    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;
      this.followRepostory.save(followToCreate);
    }

    return { ...user, following: true };
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return {
      profile,
    };
  }
}
