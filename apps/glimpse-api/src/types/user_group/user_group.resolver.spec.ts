import { Test, TestingModule } from "@nestjs/testing";
import { UserGroupResolver } from "./user_group.resolver";
import { PrismaService } from "../../prisma/prisma.service";

describe("AlertLogResolver", () => {
    let resolver: UserGroupResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserGroupResolver, PrismaService]
        }).compile();

        resolver = module.get<UserGroupResolver>(UserGroupResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
