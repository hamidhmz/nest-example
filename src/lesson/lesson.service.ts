import { Injectable } from '@nestjs/common';
import { Lesson } from './lesson.entity';
import { LessonRepository } from './lesson.repository';

@Injectable()
export class LessonService {
  constructor(private lessonRepository: LessonRepository) {}

  public getAllServices(): Promise<Lesson[]> {
    return this.lessonRepository.find();
  }
}
