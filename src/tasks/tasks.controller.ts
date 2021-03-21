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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AddTaskDto } from './dto/add-task.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('/tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  public getAllTasks(@GetUser() user: User): Promise<Task[]> {
    return this.tasksService.getAllTasks(user);
  }

  @Get('/:taskId')
  public getOneTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTask(taskId, user);
  }

  // // public addNewTask(
  // //   @Body('taskDescription') taskDescription: string,
  // //   @Body('taskTitle') taskTitle: string,): Task {
  @Post()
  @UsePipes(ValidationPipe)
  public addNewTask(
    @Body() addTaskDto: AddTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.addOneTask(addTaskDto, user);
  }

  @Delete('/:taskId')
  public deleteTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    @GetUser() user: User,
  ): Promise<true> {
    return this.tasksService.deleteOneTask(taskId,user);
  }

  @Patch('/:taskId/status')
  @UsePipes(ValidationPipe)
  // @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  public updateTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    // @Body('taskStatus', new TaskStatusValidationPipe())
    @Body('taskStatus', TaskStatusValidationPipe)
    taskStatus: TaskStatus,
    @GetUser() user: User,
  ): Promise<true> {
    return this.tasksService.updateTaskStatus(taskId, taskStatus,user);
  }
}
