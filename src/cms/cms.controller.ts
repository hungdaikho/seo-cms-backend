import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
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
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CmsService } from './cms.service';
import {
  CreateCmsPageDto,
  UpdateCmsPageDto,
  CreateCmsPageSectionDto,
  CreateContactSubmissionDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../admin/guards/admin.guard';
import { PageType, PageStatus } from '@prisma/client';

@ApiTags('CMS')
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  // =============================
  // PUBLIC ENDPOINTS
  // =============================

  @Get('pages/public')
  @ApiOperation({ summary: 'Lấy danh sách trang công khai' })
  @ApiQuery({ name: 'pageType', enum: PageType, required: false })
  @ApiResponse({ status: 200, description: 'Danh sách trang thành công' })
  async getPublicPages(@Query('pageType') pageType?: PageType) {
    return this.cmsService.findAllPages(PageStatus.published, pageType);
  }

  @Get('pages/public/:slug')
  @ApiOperation({ summary: 'Lấy trang theo slug (công khai)' })
  @ApiParam({ name: 'slug', description: 'Slug của trang' })
  @ApiResponse({ status: 200, description: 'Trang tìm thấy' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy trang' })
  async getPublicPageBySlug(@Param('slug') slug: string) {
    const page = await this.cmsService.findPageBySlug(slug);

    // Chỉ trả về trang đã publish
    if (page.status !== PageStatus.published) {
      throw new Error('Trang chưa được công bố');
    }

    return page;
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

    return this.cmsService.createContactSubmission(
      createContactDto,
      ipAddress,
      userAgent,
    );
  }

  // =============================
  // ADMIN ENDPOINTS - CMS PAGES
  // =============================

  @Post('pages')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo trang CMS mới (Admin)' })
  @ApiResponse({ status: 201, description: 'Trang được tạo thành công' })
  @ApiResponse({ status: 409, description: 'Slug đã tồn tại' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createPage(
    @Body() createPageDto: CreateCmsPageDto,
    @Request() req: any,
  ) {
    return this.cmsService.createPage(createPageDto, req.user.id);
  }

  @Get('pages')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách trang CMS (Admin)' })
  @ApiQuery({ name: 'status', enum: PageStatus, required: false })
  @ApiQuery({ name: 'pageType', enum: PageType, required: false })
  @ApiResponse({ status: 200, description: 'Danh sách trang thành công' })
  async getAllPages(
    @Query('status') status?: PageStatus,
    @Query('pageType') pageType?: PageType,
  ) {
    return this.cmsService.findAllPages(status, pageType);
  }

  @Get('pages/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy trang theo ID (Admin)' })
  @ApiParam({ name: 'id', description: 'ID của trang' })
  @ApiResponse({ status: 200, description: 'Trang tìm thấy' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy trang' })
  async getPageById(@Param('id') id: string) {
    return this.cmsService.findPageById(id);
  }

  @Patch('pages/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật trang CMS (Admin)' })
  @ApiParam({ name: 'id', description: 'ID của trang' })
  @ApiResponse({ status: 200, description: 'Trang được cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy trang' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async updatePage(
    @Param('id') id: string,
    @Body() updatePageDto: UpdateCmsPageDto,
    @Request() req: any,
  ) {
    return this.cmsService.updatePage(id, updatePageDto, req.user.id);
  }

  @Delete('pages/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa trang CMS (Admin)' })
  @ApiParam({ name: 'id', description: 'ID của trang' })
  @ApiResponse({ status: 200, description: 'Trang được xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy trang' })
  @ApiResponse({ status: 400, description: 'Không thể xóa trang hệ thống' })
  async deletePage(@Param('id') id: string) {
    return this.cmsService.deletePage(id);
  }

  // =============================
  // ADMIN ENDPOINTS - PAGE SECTIONS
  // =============================

  @Post('sections')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo section cho trang (Admin)' })
  @ApiResponse({ status: 201, description: 'Section được tạo thành công' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createPageSection(@Body() createSectionDto: CreateCmsPageSectionDto) {
    return this.cmsService.createPageSection(createSectionDto);
  }

  @Get('pages/:pageId/sections')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy sections của trang (Admin)' })
  @ApiParam({ name: 'pageId', description: 'ID của trang' })
  @ApiResponse({ status: 200, description: 'Danh sách sections thành công' })
  async getPageSections(@Param('pageId') pageId: string) {
    return this.cmsService.findSectionsByPageId(pageId);
  }

  @Patch('sections/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật section (Admin)' })
  @ApiParam({ name: 'id', description: 'ID của section' })
  @ApiResponse({ status: 200, description: 'Section được cập nhật thành công' })
  async updatePageSection(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateCmsPageSectionDto>,
  ) {
    return this.cmsService.updatePageSection(id, updateData);
  }

  @Delete('sections/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa section (Admin)' })
  @ApiParam({ name: 'id', description: 'ID của section' })
  @ApiResponse({ status: 200, description: 'Section được xóa thành công' })
  async deletePageSection(@Param('id') id: string) {
    return this.cmsService.deletePageSection(id);
  }

  // =============================
  // ADMIN ENDPOINTS - CONTACT SUBMISSIONS
  // =============================

  @Get('contacts')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách liên hệ (Admin)' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Trang',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số item mỗi trang',
    type: Number,
  })
  @ApiQuery({
    name: 'isRead',
    required: false,
    description: 'Trạng thái đã đọc',
    type: Boolean,
  })
  @ApiResponse({ status: 200, description: 'Danh sách liên hệ thành công' })
  async getAllContacts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('isRead') isRead?: string,
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const isReadFilter = isRead !== undefined ? isRead === 'true' : undefined;

    return this.cmsService.findAllContactSubmissions(
      skip,
      limitNum,
      isReadFilter,
    );
  }

  @Get('contacts/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy liên hệ theo ID (Admin)' })
  @ApiParam({ name: 'id', description: 'ID của liên hệ' })
  @ApiResponse({ status: 200, description: 'Liên hệ tìm thấy' })
  async getContactById(@Param('id') id: string) {
    return this.cmsService.findContactSubmissionById(id);
  }

  @Patch('contacts/:id/read')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đánh dấu liên hệ đã đọc (Admin)' })
  @ApiParam({ name: 'id', description: 'ID của liên hệ' })
  @ApiResponse({ status: 200, description: 'Đánh dấu thành công' })
  async markContactAsRead(@Param('id') id: string) {
    return this.cmsService.markContactAsRead(id);
  }

  @Patch('contacts/:id/reply')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đánh dấu liên hệ đã trả lời (Admin)' })
  @ApiParam({ name: 'id', description: 'ID của liên hệ' })
  @ApiResponse({ status: 200, description: 'Đánh dấu thành công' })
  async markContactAsReplied(
    @Param('id') id: string,
    @Body('notes') notes: string,
    @Request() req: any,
  ) {
    return this.cmsService.markContactAsReplied(id, req.user.id, notes);
  }

  @Delete('contacts/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa liên hệ (Admin)' })
  @ApiParam({ name: 'id', description: 'ID của liên hệ' })
  @ApiResponse({ status: 200, description: 'Liên hệ được xóa thành công' })
  async deleteContact(@Param('id') id: string) {
    return this.cmsService.deleteContactSubmission(id);
  }

  // =============================
  // ADMIN ENDPOINTS - STATISTICS
  // =============================

  @Get('statistics')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thống kê CMS (Admin)' })
  @ApiResponse({ status: 200, description: 'Thống kê thành công' })
  async getCmsStatistics() {
    return this.cmsService.getCmsStatistics();
  }
}
