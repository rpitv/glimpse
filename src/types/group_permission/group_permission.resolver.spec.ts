import { Test, TestingModule } from "@nestjs/testing";
import { GroupPermissionResolver } from "./group_permission.resolver";
import { PrismaService } from "../../prisma/prisma.service";

describe("GroupPermissionResolver", () => {
    let resolver: GroupPermissionResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GroupPermissionResolver, PrismaService]
        }).compile();

        resolver = module.get<GroupPermissionResolver>(GroupPermissionResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
