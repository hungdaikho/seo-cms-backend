import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CmsService } from './cms.service';
import { CreateContactSubmissionDto } from './dto';
import { PageType, PageStatus } from '@prisma/client';

@ApiTags('Public CMS')
@Controller('public/cms')
export class PublicCmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('pages')
  @ApiOperation({ summary: 'Lấy danh sách trang công khai' })
  @ApiQuery({ name: 'pageType', enum: PageType, required: false })
  @ApiResponse({ status: 200, description: 'Danh sách trang thành công' })
  async getPublicPages(@Query('pageType') pageType?: PageType) {
    return this.cmsService.findAllPages(PageStatus.published, pageType);
  }

  @Get('pages/:slug')
  @ApiOperation({ summary: 'Lấy trang theo slug' })
  @ApiParam({ name: 'slug', description: 'Slug của trang' })
  @ApiResponse({ status: 200, description: 'Trang tìm thấy' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy trang' })
  async getPageBySlug(@Param('slug') slug: string) {
    const page = await this.cmsService.findPageBySlug(slug);

    // Chỉ trả về trang đã publish
    if (page.status !== PageStatus.published) {
      throw new Error('Trang chưa được công bố');
    }

    return page;
  }

  @Get('pages/type/:pageType')
  @ApiOperation({ summary: 'Lấy trang theo loại' })
  @ApiParam({ name: 'pageType', enum: PageType, description: 'Loại trang' })
  @ApiResponse({ status: 200, description: 'Trang tìm thấy' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy trang' })
  async getPageByType(@Param('pageType') pageType: PageType) {
    const pages = await this.cmsService.findAllPages(
      PageStatus.published,
      pageType,
    );

    if (!pages || pages.length === 0) {
      throw new Error('Không tìm thấy trang');
    }

    return pages[0]; // Trả về trang đầu tiên vì mỗi loại chỉ có 1 trang
  }

  @Post('contact')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Gửi form liên hệ' })
  @ApiResponse({ status: 201, description: 'Gửi liên hệ thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async submitContact(
    @Body() createContactDto: CreateContactSubmissionDto,
    @Request() req: any,
  ) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    const result = await this.cmsService.createContactSubmission(
      createContactDto,
      ipAddress,
      userAgent,
    );

    return {
      success: true,
      message:
        'Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong vòng 24 giờ.',
      data: {
        id: result.id,
        submittedAt: result.createdAt,
      },
    };
  }

  @Get('statistics/public')
  @ApiOperation({ summary: 'Thống kê công khai' })
  @ApiResponse({ status: 200, description: 'Thống kê thành công' })
  async getPublicStatistics() {
    const stats = await this.cmsService.getCmsStatistics();

    // Chỉ trả về thông tin cần thiết cho public
    return {
      totalPages: stats.pages.published,
      lastUpdated: new Date().toISOString(),
    };
  }
}
