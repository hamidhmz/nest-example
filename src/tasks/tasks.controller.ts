import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TasksService } from './tasks.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AddTaskDto } from './dto/add-task.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Controller('/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  public getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Get('/:taskId')
  public getOneTask(
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<Task> {
    return this.tasksService.getTask(taskId);
  }

  // // public addNewTask(
  // //   @Body('taskDescription') taskDescription: string,
  // //   @Body('taskTitle') taskTitle: string,): Task {
  @Post()
  @UsePipes(ValidationPipe)
  public addNewTask(@Body() addTaskDto: AddTaskDto): Promise<Task> {
    return this.tasksService.addOneTask(addTaskDto);
  }

  @Delete('/:taskId')
  public deleteTask(
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<true> {
    return this.tasksService.deleteOneTask(taskId);
  }

  @Patch('/:taskId/status')
  @UsePipes(ValidationPipe)
  // @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  public updateTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    // @Body('taskStatus', new TaskStatusValidationPipe())
    @Body('taskStatus', TaskStatusValidationPipe)
    taskStatus: TaskStatus,
  ): Promise<true> {
    return this.tasksService.updateTaskStatus(taskId, taskStatus);
  }
}
