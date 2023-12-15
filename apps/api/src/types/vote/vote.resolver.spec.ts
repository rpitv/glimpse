import { Test, TestingModule } from "@nestjs/testing";
import { VoteResolver } from "./vote.resolver";
import { PrismaService } from "../../prisma/prisma.service";

describe("VoteResolver", () => {
    let resolver: VoteResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VoteResolver, PrismaService]
        }).compile();

        resolver = module.get<VoteResolver>(VoteResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
