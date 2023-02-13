import { Test, TestingModule } from "@nestjs/testing";
import { ProductionResolver } from "./production.resolver";
import { PrismaService } from "../../prisma/prisma.service";

describe("AlertLogResolver", () => {
    let resolver: ProductionResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProductionResolver, PrismaService]
        }).compile();

        resolver = module.get<ProductionResolver>(ProductionResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
