import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './config/typeorm.config';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './config/env.validation';
import { GraphQLModule } from '@nestjs/graphql';
import { LessonModule } from './lesson/lesson.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    TasksModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? 'test/test.env' : '.env',
      validate,
    }),
    LessonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // constructor(private connection: Connection) {}
}
