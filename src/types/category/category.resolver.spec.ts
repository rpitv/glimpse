import { Test, TestingModule } from "@nestjs/testing";
import { CategoryResolver } from "./category.resolver";
import { PrismaService } from "../../prisma/prisma.service";

describe("CategoryResolver", () => {
    let resolver: CategoryResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CategoryResolver, PrismaService]
        }).compile();

        resolver = module.get<CategoryResolver>(CategoryResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
