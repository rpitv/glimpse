import { Test, TestingModule } from "@nestjs/testing";
import { ProductionImageResolver } from "./production_image.resolver";
import { PrismaService } from "../../prisma/prisma.service";

describe("AlertLogResolver", () => {
    let resolver: ProductionImageResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProductionImageResolver, PrismaService]
        }).compile();

        resolver = module.get<ProductionImageResolver>(ProductionImageResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
