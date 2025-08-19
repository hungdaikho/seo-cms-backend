import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';
import { PageType, PageStatus } from '@prisma/client';

export class CreateCmsPageDto {
  @ApiProperty({ description: 'Tiêu đề trang' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Slug URL của trang' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  slug: string;

  @ApiProperty({
    description: 'Loại trang',
    enum: PageType,
    enumName: 'PageType',
  })
  @IsEnum(PageType)
  pageType: PageType;

  @ApiProperty({ description: 'Nội dung trang' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Mô tả ngắn' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiPropertyOptional({ description: 'Meta title' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'Meta description' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'Meta keywords' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  metaKeywords?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái trang',
    enum: PageStatus,
    enumName: 'PageStatus',
    default: PageStatus.draft,
  })
  @IsOptional()
  @IsEnum(PageStatus)
  status?: PageStatus;

  @ApiPropertyOptional({ description: 'Thứ tự sắp xếp', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
