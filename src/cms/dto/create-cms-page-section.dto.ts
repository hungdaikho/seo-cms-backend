import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  Min,
  IsJSON,
} from 'class-validator';

export class CreateCmsPageSectionDto {
  @ApiProperty({ description: 'ID của trang' })
  @IsNotEmpty()
  @IsString()
  pageId: string;

  @ApiPropertyOptional({ description: 'Tiêu đề section' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Nội dung section' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Loại section',
    examples: ['text', 'image', 'video', 'contact_form', 'faq'],
  })
  @IsNotEmpty()
  @IsString()
  sectionType: string;

  @ApiPropertyOptional({ description: 'Cài đặt section dưới dạng JSON' })
  @IsOptional()
  settings?: any;

  @ApiPropertyOptional({ description: 'Thứ tự sắp xếp', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Trạng thái kích hoạt', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
