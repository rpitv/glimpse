import { Test, TestingModule } from "@nestjs/testing";
import { CreditResolver } from "./credit.resolver";
import { PrismaService } from "../../prisma/prisma.service";

describe("CreditResolver", () => {
    let resolver: CreditResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CreditResolver, PrismaService]
        }).compile();

        resolver = module.get<CreditResolver>(CreditResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
