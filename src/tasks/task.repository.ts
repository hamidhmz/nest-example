import { User } from './../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { AddTaskDto } from './dto/add-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  public createTask(addTaskDto: AddTaskDto,user:User): Promise<Task> {
    const task = new Task();
    task.title = addTaskDto.taskTitle;
    task.description = addTaskDto.taskDescription;
    task.status = TaskStatus.OPEN;
    task.user = user

    return task.save();
  }
}
