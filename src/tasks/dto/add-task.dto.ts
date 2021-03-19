import { IsNotEmpty } from 'class-validator';

export class AddTaskDto {
  @IsNotEmpty()
  taskDescription: string;
  @IsNotEmpty()
  taskTitle: string;
}
