import { Test, TestingModule } from '@nestjs/testing';
import { LicenceCodeController } from './licence-code.controller';

describe('LicenceCodeController', () => {
  let controller: LicenceCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LicenceCodeController],
    }).compile();

    controller = module.get<LicenceCodeController>(LicenceCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
