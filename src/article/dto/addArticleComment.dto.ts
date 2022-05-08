import { IsNotEmpty } from 'class-validator';

export class AddArticleCommentDto {
  @IsNotEmpty()
  readonly body: string;
}
