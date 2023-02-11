import { Test, TestingModule } from "@nestjs/testing";
import { PersonRoleResolver } from "./person_role.resolver";
import { PrismaService } from "../prisma/prisma.service";

describe("AlertLogResolver", () => {
    let resolver: PersonRoleResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PersonRoleResolver, PrismaService]
        }).compile();

        resolver = module.get<PersonRoleResolver>(PersonRoleResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
