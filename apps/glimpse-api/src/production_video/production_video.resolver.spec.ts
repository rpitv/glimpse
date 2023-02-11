import { Test, TestingModule } from "@nestjs/testing";
import { ProductionVideoResolver } from "./production_video.resolver";
import { PrismaService } from "../prisma/prisma.service";

describe("AlertLogResolver", () => {
    let resolver: ProductionVideoResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProductionVideoResolver, PrismaService]
        }).compile();

        resolver = module.get<ProductionVideoResolver>(ProductionVideoResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
