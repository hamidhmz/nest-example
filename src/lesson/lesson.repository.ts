import { EntityRepository, Repository } from 'typeorm';
import { Lesson } from './lesson.entity';

@EntityRepository(Lesson)
export class LessonRepository extends Repository<Lesson> {}
