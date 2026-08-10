import { IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber, IsArray, IsEnum } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsUUID()
  @IsNotEmpty()
  institute_id: string;
}

export class UpdateBatchDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  year?: number;
}

export class AddStudentsToBatchDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  student_ids: string[];

  @IsUUID()
  @IsNotEmpty()
  class_batch_section_id: string;
}

export class RemoveStudentFromBatchDto {
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @IsUUID()
  @IsNotEmpty()
  class_batch_section_id: string;
}

export enum SortField {
  NAME = 'name',
  YEAR = 'year',
  CREATED_AT = 'created_at',
  STUDENT_COUNT = 'student_count'
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}
