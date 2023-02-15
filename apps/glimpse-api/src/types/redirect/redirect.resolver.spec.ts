import { Test, TestingModule } from "@nestjs/testing";
import { RedirectResolver } from "./redirect.resolver";
import { PrismaService } from "../../prisma/prisma.service";

describe("RedirectResolver", () => {
    let resolver: RedirectResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RedirectResolver, PrismaService]
        }).compile();

        resolver = module.get<RedirectResolver>(RedirectResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
