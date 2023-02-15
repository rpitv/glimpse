import { Test, TestingModule } from "@nestjs/testing";
import { ProductionRSVPResolver } from "./production_rsvp.resolver";
import { PrismaService } from "../../prisma/prisma.service";

describe("ProductionRSVPResolver", () => {
    let resolver: ProductionRSVPResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProductionRSVPResolver, PrismaService]
        }).compile();

        resolver = module.get<ProductionRSVPResolver>(ProductionRSVPResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
