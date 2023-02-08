import { Test, TestingModule } from "@nestjs/testing";
import { AccessLogResolver } from "./access_log.resolver";
import { PrismaService } from "../prisma/prisma.service";

describe("AccessLogResolver", () => {
    let resolver: AccessLogResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AccessLogResolver, PrismaService]
        }).compile();

        resolver = module.get<AccessLogResolver>(AccessLogResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
