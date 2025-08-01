import { Test, TestingModule } from '@nestjs/testing';
import { LicenceCodeService } from './licence-code.service';

describe('LicenceCodeService', () => {
  let service: LicenceCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LicenceCodeService],
    }).compile();

    service = module.get<LicenceCodeService>(LicenceCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
