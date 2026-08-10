import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  IsEnum,
} from "class-validator";

export class StartClassNowDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsUUID()
  institute_id: string;

  @IsOptional()
  @IsUUID()
  class_batch_section_id?: string;

  @IsOptional()
  @IsUUID()
  subject_id?: string;

  @IsOptional()
  @IsNumber()
  duration_minutes?: number;

  @IsOptional()
  @IsEnum(["online", "onsite", "hybrid"])
  location_type?: "online" | "onsite" | "hybrid";

  @IsOptional()
  @IsEnum(["voice", "video"])
  call_type?: "voice" | "video";
}
