import { User } from './../auth/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddTaskDto } from './dto/add-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  public getAllTasks(user: User): Promise<Task[]> {
    return this.taskRepository.find({ user: { id: user.id } });
  }

  public async getTask(taskId: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      id: taskId,
      user: { id: user.id },
    });

    if (!task) {
      throw new NotFoundException(`Task with Id "${taskId}" notfound`);
    }

    return task;
  }

  public addOneTask(addTaskDto: AddTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(addTaskDto, user);
  }

  public async deleteOneTask(taskId: number, user: User): Promise<true> {
    const targetTask = await this.taskRepository.delete({
      id: taskId,
      user: { id: user.id },
    });
    if (targetTask.affected === 0) {
      throw new NotFoundException(`Task with Id "${taskId}" notfound`);
    }

    return true;
  }

  public async updateTaskStatus(
    taskId: number,
    taskStatus: TaskStatus,
    user: User,
  ): Promise<true> {
    const myTask = await this.taskRepository.update(
      { id: taskId, user: { id: user.id } },
      { status: taskStatus },
    );

    if (myTask.affected === 0) {
      throw new NotFoundException(`Task with Id "${taskId}" notfound`);
    }

    return true;
  }
}
