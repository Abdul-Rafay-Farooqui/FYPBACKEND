import { IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber, IsBoolean, IsArray, IsEnum } from 'class-validator';

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  institute_id?: string;

  @IsUUID()
  @IsOptional()
  teacher_id?: string;

  @IsUUID()
  @IsOptional()
  class_batch_section_id?: string;

  @IsUUID()
  @IsOptional()
  subject_id?: string;

  @IsNumber()
  @IsOptional()
  total_marks?: number;

  @IsNumber()
  @IsOptional()
  duration_minutes?: number;

  @IsString()
  @IsOptional()
  due_date?: string;

  @IsBoolean()
  @IsOptional()
  is_published?: boolean;

  @IsArray()
  @IsOptional()
  questions?: any[];
}

export class UpdateQuizDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  total_marks?: number;

  @IsNumber()
  @IsOptional()
  duration_minutes?: number;

  @IsString()
  @IsOptional()
  due_date?: string;

  @IsBoolean()
  @IsOptional()
  is_published?: boolean;
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  question_text: string;

  @IsEnum(['mcq', 'true_false', 'short_answer'])
  @IsNotEmpty()
  question_type: 'mcq' | 'true_false' | 'short_answer';

  @IsArray()
  @IsOptional()
  options?: string[];

  @IsString()
  @IsNotEmpty()
  correct_answer: string;

  @IsNumber()
  @IsOptional()
  marks?: number;

  @IsNumber()
  @IsOptional()
  order_number?: number;
}

export class SubmitAnswerDto {
  @IsUUID()
  @IsNotEmpty()
  question_id: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class SubmitQuizDto {
  @IsArray()
  @IsNotEmpty()
  answers: SubmitAnswerDto[];
}
