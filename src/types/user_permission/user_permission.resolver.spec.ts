import { Test, TestingModule } from "@nestjs/testing";
import { UserPermissionResolver } from "./user_permission.resolver";
import { PrismaService } from "../../prisma/prisma.service";

describe("UserPermissionResolver", () => {
    let resolver: UserPermissionResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserPermissionResolver, PrismaService]
        }).compile();

        resolver = module.get<UserPermissionResolver>(UserPermissionResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
