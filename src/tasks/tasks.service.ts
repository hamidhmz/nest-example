import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { AddTaskDto } from './dto/add-task.dto';

import { Task, TaskStatus } from './tasks.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  public getAllTasks(): Task[] {
    return this.tasks;
  }

  public getTask(taskId: string): Task {
    return this.tasks.find((task: Task) => {
      return task.id === taskId;
    });
  }

  public addOneTask(addTaskDto: AddTaskDto): Task {
    const newTask = {
      id: uuid(),
      title: addTaskDto.taskTitle,
      description: addTaskDto.taskDescription,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(newTask);

    return newTask;
  }

  public deleteOneTask(taskId: string): boolean {
    const targetTask = this.tasks.findIndex(task => task.id === taskId);

    if (targetTask === -1) return false;

    this.tasks.splice(targetTask, 1);

    return true;
  }

  public updateTaskStatus(
    taskId: string,
    taskStatus: TaskStatus,
  ): Task | false {
    const updatedTask = this.tasks.find(task => {
      if (task.id === taskId) {
        task.status = taskStatus;
        return true;
      }
    });

    if (!updatedTask) return false;

    return updatedTask;
  }
}
