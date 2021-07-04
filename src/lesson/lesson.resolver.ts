import { Resolver, Query } from '@nestjs/graphql';
import { Lesson } from './lesson.entity';
import { LessonService } from './lesson.service';
import { LessonType } from './lesson.type';

@Resolver(of => LessonType)
export class LessonResolver {
  constructor(private lessonService: LessonService) {}
  @Query(returns => [LessonType])
  lesson(): Promise<Lesson[]> {
    return this.lessonService.getAllServices();
  }
}
