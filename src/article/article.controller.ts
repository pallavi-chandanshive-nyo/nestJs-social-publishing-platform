import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { User } from '@app/user/decorators/user.decorators';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDTO } from './dto/createArticle.dto';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { ArticleEntity } from './article.entity';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipes';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async createArticle(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDTO: CreateArticleDTO,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDTO,
    );

    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(slug);
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
}
