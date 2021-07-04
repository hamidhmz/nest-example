import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  validateSync,
  IsNotEmpty,
  IsString,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  PORT: number = 3000;

  @IsNotEmpty()
  @IsString()
  POSTGRES_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  POSTGRES_PORT: number;

  @IsNotEmpty()
  @IsString()
  POSTGRES_USERNAME: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_DATABASE: string;

  @IsNumber()
  @IsNotEmpty()
  JWT_SECRET: number;

  @IsNumber()
  @IsNotEmpty()
  JWT_EXPIRE_IN_MILLISECOND: number;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
