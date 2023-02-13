import { Test, TestingModule } from "@nestjs/testing";
import { RoleResolver } from "./role.resolver";
import { PrismaService } from "../../prisma/prisma.service";

describe("AlertLogResolver", () => {
    let resolver: RoleResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RoleResolver, PrismaService]
        }).compile();

        resolver = module.get<RoleResolver>(RoleResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
