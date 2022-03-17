import { AuthGuard } from './../user/guards/auth.guard';
import { User } from './../user/decorators/user.decorator';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { UserEntity } from './../user/user.entity';
import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  @UsePipes(new ValidationPipe())
  async getProfile(
    @User('id') currentUserId: number,
    @Param('username') username: UserEntity['username'],
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(
      currentUserId,
      username,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') currentUserId: number,
    @Param('username') username: UserEntity['username'],
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.followProfile(
      currentUserId,
      username,
    );
    return this.profileService.buildProfileResponse(profile);
  }
}
