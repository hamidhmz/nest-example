import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './config/typeorm.config';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './config/env.validation';

@Module({
  imports: [
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // constructor(private connection: Connection) {}
}
