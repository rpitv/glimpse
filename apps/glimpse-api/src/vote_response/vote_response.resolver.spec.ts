import { Test, TestingModule } from "@nestjs/testing";
import { VoteResponseResolver } from "./vote_response.resolver";
import { PrismaService } from "../prisma/prisma.service";

describe("AlertLogResolver", () => {
    let resolver: VoteResponseResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VoteResponseResolver, PrismaService]
        }).compile();

        resolver = module.get<VoteResponseResolver>(VoteResponseResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
