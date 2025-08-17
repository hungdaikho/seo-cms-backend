import { Test, TestingModule } from '@nestjs/testing';
import { BacklinkGapController } from './backlink-gap.controller';
import { BacklinkGapService } from './backlink-gap.service';
import { BacklinkGapCompareDto, LinkType } from './dto/backlink-gap.dto';

describe('BacklinkGapController', () => {
  let controller: BacklinkGapController;
  let service: BacklinkGapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BacklinkGapController],
      providers: [BacklinkGapService],
    }).compile();

    controller = module.get<BacklinkGapController>(BacklinkGapController);
    service = module.get<BacklinkGapService>(BacklinkGapService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('compareBacklinkGaps', () => {
    it('should return backlink gap analysis', async () => {
      const dto: BacklinkGapCompareDto = {
        targetDomain: 'example.com',
        competitors: ['competitor1.com', 'competitor2.com'],
        filters: {
          minAuthorityScore: 30,
          linkType: LinkType.DOFOLLOW,
        },
      };

      const result = await controller.compareBacklinkGaps(dto);

      expect(result).toBeDefined();
      expect(result.overview).toBeDefined();
      expect(result.overview.targetDomain).toBe(dto.targetDomain);
      expect(result.overview.competitors).toEqual(dto.competitors);
      expect(result.backlinkDetails).toBeDefined();
      expect(result.opportunities).toBeDefined();
      expect(typeof result.totalBacklinks).toBe('number');
    });
  });

  describe('getBacklinkProspects', () => {
    it('should return backlink prospects', async () => {
      const domain = 'example.com';
      const dto = {
        domain,
        limit: 50,
        filters: {
          minAuthorityScore: 40,
        },
      };

      const result = await controller.getBacklinkProspects(domain, dto);

      expect(result).toBeDefined();
      expect(result.prospects).toBeDefined();
      expect(Array.isArray(result.prospects)).toBe(true);
      expect(typeof result.totalFound).toBe('number');
      expect(result.analysisDate).toBeDefined();
    });
  });
});
