import { Test, TestingModule } from "@nestjs/testing";
import { GroupResolver } from "./group.resolver";
import { PrismaService } from "../prisma/prisma.service";

describe("AlertLogResolver", () => {
    let resolver: GroupResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GroupResolver, PrismaService]
        }).compile();

        resolver = module.get<GroupResolver>(GroupResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
