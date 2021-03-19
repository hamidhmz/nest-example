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

  public getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  public async getTask(taskId: number): Promise<Task> {
    const task = await this.taskRepository.findOne(taskId);

    if (!task) {
      throw new NotFoundException(`Task with Id "${taskId}" notfound`);
    }

    return task;
  }

  public addOneTask(addTaskDto: AddTaskDto): Promise<Task> {
    return this.taskRepository.createTask(addTaskDto);
  }

  public async deleteOneTask(taskId: number): Promise<true> {
    const targetTask = await this.taskRepository.delete(taskId);
    if (targetTask.affected === 0) {
      throw new NotFoundException(`Task with Id "${taskId}" notfound`);
    }

    return true;
  }

  public async updateTaskStatus(
    taskId: number,
    taskStatus: TaskStatus,
  ): Promise<true> {
    const myTask = await this.taskRepository.update(
      { id: taskId },
      { status: taskStatus },
    );

    if (myTask.affected === 0) {
      throw new NotFoundException(`Task with Id "${taskId}" notfound`);
    }

    return true;
  }
}
