import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  CreateCmsPageDto,
  UpdateCmsPageDto,
  CreateCmsPageSectionDto,
  CreateContactSubmissionDto,
} from './dto';
import { PageType, PageStatus, Prisma } from '@prisma/client';

@Injectable()
export class CmsService {
  constructor(private readonly prisma: DatabaseService) {}

  // =============================
  // CMS PAGES METHODS
  // =============================

  async createPage(createPageDto: CreateCmsPageDto, lastEditedBy?: string) {
    // Kiểm tra slug đã tồn tại chưa
    const existingPage = await this.prisma.cmsPage.findUnique({
      where: { slug: createPageDto.slug },
    });

    if (existingPage) {
      throw new ConflictException('Slug đã tồn tại');
    }

    // Kiểm tra pageType đã có trang hệ thống chưa (chỉ cho phép 1 trang/loại)
    if (createPageDto.pageType !== 'custom') {
      const existingSystemPage = await this.prisma.cmsPage.findFirst({
        where: {
          pageType: createPageDto.pageType,
          isSystem: true,
        },
      });

      if (existingSystemPage) {
        throw new ConflictException(
          `Trang ${createPageDto.pageType} hệ thống đã tồn tại`,
        );
      }
    }

    return this.prisma.cmsPage.create({
      data: {
        ...createPageDto,
        lastEditedBy,
        isSystem: createPageDto.pageType !== 'custom',
        publishedAt: createPageDto.status === 'published' ? new Date() : null,
      },
      include: {
        lastEditor: {
          select: { id: true, name: true, email: true },
        },
        sections: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async findAllPages(status?: PageStatus, pageType?: PageType) {
    const where: Prisma.CmsPageWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (pageType) {
      where.pageType = pageType;
    }

    return this.prisma.cmsPage.findMany({
      where,
      include: {
        lastEditor: {
          select: { id: true, name: true, email: true },
        },
        sections: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findPageById(id: string) {
    const page = await this.prisma.cmsPage.findUnique({
      where: { id },
      include: {
        lastEditor: {
          select: { id: true, name: true, email: true },
        },
        sections: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!page) {
      throw new NotFoundException('Không tìm thấy trang');
    }

    return page;
  }

  async findPageBySlug(slug: string) {
    const page = await this.prisma.cmsPage.findUnique({
      where: { slug },
      include: {
        sections: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!page) {
      throw new NotFoundException('Không tìm thấy trang');
    }

    return page;
  }

  async updatePage(
    id: string,
    updatePageDto: UpdateCmsPageDto,
    lastEditedBy?: string,
  ) {
    const existingPage = await this.prisma.cmsPage.findUnique({
      where: { id },
    });

    if (!existingPage) {
      throw new NotFoundException('Không tìm thấy trang');
    }

    // Kiểm tra slug mới có trung với trang khác không
    if (updatePageDto.slug && updatePageDto.slug !== existingPage.slug) {
      const existingSlug = await this.prisma.cmsPage.findUnique({
        where: { slug: updatePageDto.slug },
      });

      if (existingSlug) {
        throw new ConflictException('Slug đã tồn tại');
      }
    }

    const updateData: any = {
      ...updatePageDto,
      lastEditedBy,
    };

    // Cập nhật publishedAt nếu status thay đổi
    if (
      updatePageDto.status === 'published' &&
      existingPage.status !== 'published'
    ) {
      updateData.publishedAt = new Date();
    } else if (updatePageDto.status !== 'published') {
      updateData.publishedAt = null;
    }

    return this.prisma.cmsPage.update({
      where: { id },
      data: updateData,
      include: {
        lastEditor: {
          select: { id: true, name: true, email: true },
        },
        sections: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async deletePage(id: string) {
    const existingPage = await this.prisma.cmsPage.findUnique({
      where: { id },
    });

    if (!existingPage) {
      throw new NotFoundException('Không tìm thấy trang');
    }

    if (existingPage.isSystem) {
      throw new BadRequestException('Không thể xóa trang hệ thống');
    }

    return this.prisma.cmsPage.delete({
      where: { id },
    });
  }

  // =============================
  // CMS PAGE SECTIONS METHODS
  // =============================

  async createPageSection(createSectionDto: CreateCmsPageSectionDto) {
    // Kiểm tra trang có tồn tại không
    const page = await this.prisma.cmsPage.findUnique({
      where: { id: createSectionDto.pageId },
    });

    if (!page) {
      throw new NotFoundException('Không tìm thấy trang');
    }

    return this.prisma.cmsPageSection.create({
      data: createSectionDto,
    });
  }

  async findSectionsByPageId(pageId: string) {
    return this.prisma.cmsPageSection.findMany({
      where: { pageId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async updatePageSection(
    id: string,
    updateData: Partial<CreateCmsPageSectionDto>,
  ) {
    const existingSection = await this.prisma.cmsPageSection.findUnique({
      where: { id },
    });

    if (!existingSection) {
      throw new NotFoundException('Không tìm thấy section');
    }

    return this.prisma.cmsPageSection.update({
      where: { id },
      data: updateData,
    });
  }

  async deletePageSection(id: string) {
    const existingSection = await this.prisma.cmsPageSection.findUnique({
      where: { id },
    });

    if (!existingSection) {
      throw new NotFoundException('Không tìm thấy section');
    }

    return this.prisma.cmsPageSection.delete({
      where: { id },
    });
  }

  // =============================
  // CONTACT SUBMISSIONS METHODS
  // =============================

  async createContactSubmission(
    createContactDto: CreateContactSubmissionDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    return this.prisma.contactSubmission.create({
      data: {
        ...createContactDto,
        ipAddress,
        userAgent,
      },
    });
  }

  async findAllContactSubmissions(skip = 0, take = 20, isRead?: boolean) {
    const where: Prisma.ContactSubmissionWhereInput = {};

    if (typeof isRead === 'boolean') {
      where.isRead = isRead;
    }

    const [submissions, total] = await Promise.all([
      this.prisma.contactSubmission.findMany({
        where,
        include: {
          replier: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.contactSubmission.count({ where }),
    ]);

    return {
      data: submissions,
      pagination: {
        total,
        skip,
        take,
        hasMore: skip + take < total,
      },
    };
  }

  async findContactSubmissionById(id: string) {
    const submission = await this.prisma.contactSubmission.findUnique({
      where: { id },
      include: {
        replier: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException('Không tìm thấy liên hệ');
    }

    return submission;
  }

  async markContactAsRead(id: string) {
    const submission = await this.prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException('Không tìm thấy liên hệ');
    }

    return this.prisma.contactSubmission.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markContactAsReplied(id: string, repliedBy: string, notes?: string) {
    const submission = await this.prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException('Không tìm thấy liên hệ');
    }

    return this.prisma.contactSubmission.update({
      where: { id },
      data: {
        isReplied: true,
        repliedAt: new Date(),
        repliedBy,
        notes,
        isRead: true, // Tự động đánh dấu đã đọc khi reply
      },
    });
  }

  async deleteContactSubmission(id: string) {
    const submission = await this.prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException('Không tìm thấy liên hệ');
    }

    return this.prisma.contactSubmission.delete({
      where: { id },
    });
  }

  // =============================
  // STATISTICS METHODS
  // =============================

  async getCmsStatistics() {
    const [
      totalPages,
      publishedPages,
      draftPages,
      totalContacts,
      unreadContacts,
      unrepliedContacts,
    ] = await Promise.all([
      this.prisma.cmsPage.count(),
      this.prisma.cmsPage.count({ where: { status: 'published' } }),
      this.prisma.cmsPage.count({ where: { status: 'draft' } }),
      this.prisma.contactSubmission.count(),
      this.prisma.contactSubmission.count({ where: { isRead: false } }),
      this.prisma.contactSubmission.count({ where: { isReplied: false } }),
    ]);

    return {
      pages: {
        total: totalPages,
        published: publishedPages,
        draft: draftPages,
        archived: totalPages - publishedPages - draftPages,
      },
      contacts: {
        total: totalContacts,
        unread: unreadContacts,
        unreplied: unrepliedContacts,
      },
    };
  }
}
