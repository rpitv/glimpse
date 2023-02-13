import { Test, TestingModule } from "@nestjs/testing";
import { PersonImageResolver } from "./person_image.resolver";
import { PrismaService } from "../../prisma/prisma.service";

describe("AlertLogResolver", () => {
    let resolver: PersonImageResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PersonImageResolver, PrismaService]
        }).compile();

        resolver = module.get<PersonImageResolver>(PersonImageResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
