import { Module, Post } from '@nestjs/common';
import { UserController } from '@app/user/user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [UserService],
})
export class UserModule {
  @Post('users')
  async createUser(): Promise<any> {
    return 'user';
  }
}
