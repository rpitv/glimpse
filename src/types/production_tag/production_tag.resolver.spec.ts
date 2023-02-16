import { Test, TestingModule } from "@nestjs/testing";
import { ProductionTagResolver } from "./production_tag.resolver";
import { PrismaService } from "../../prisma/prisma.service";

describe("ProductionTagResolver", () => {
    let resolver: ProductionTagResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProductionTagResolver, PrismaService]
        }).compile();

        resolver = module.get<ProductionTagResolver>(ProductionTagResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
