import { Test, TestingModule } from "@nestjs/testing";
import { VideoResolver } from "./video.resolver";
import { PrismaService } from "../prisma/prisma.service";

describe("AlertLogResolver", () => {
    let resolver: VideoResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VideoResolver, PrismaService]
        }).compile();

        resolver = module.get<VideoResolver>(VideoResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
