import { TasksService } from './tasks.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { AddTaskDto } from './dto/add-task.dto';

@Controller('/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  public getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Get('/:taskId')
  public getOneTask(@Param('taskId') taskId: string): Task {
    return this.tasksService.getTask(taskId);
  }

  // public addNewTask(
  //   @Body('taskDescription') taskDescription: string,
  //   @Body('taskTitle') taskTitle: string,): Task {
  @Post()
  public addNewTask(@Body() addTaskDto: AddTaskDto): Task {
    return this.tasksService.addOneTask(addTaskDto);
  }

  @Delete('/:taskId')
  public deleteTask(@Param('taskId') taskId: string): boolean {
    return this.tasksService.deleteOneTask(taskId);
  }

  @Patch('/:taskId/status')
  public updateTask(
    @Param('taskId') taskId: string,
    @Body('taskStatus') taskStatus: TaskStatus,
  ): Task | false {
    return this.tasksService.updateTaskStatus(taskId, taskStatus);
  }
}
