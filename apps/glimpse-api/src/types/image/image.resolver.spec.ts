import { Test, TestingModule } from "@nestjs/testing";
import { ImageResolver } from "./image.resolver";
import { PrismaService } from "../../prisma/prisma.service";

describe("AlertLogResolver", () => {
    let resolver: ImageResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ImageResolver, PrismaService]
        }).compile();

        resolver = module.get<ImageResolver>(ImageResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
