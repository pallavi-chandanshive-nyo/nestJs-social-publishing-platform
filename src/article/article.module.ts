import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './../user/user.entity';
import { ArticleEntity } from './article.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity])],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
