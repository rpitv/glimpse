import { Test, TestingModule } from "@nestjs/testing";
import { AlertLogResolver } from "./alert_log.resolver";
import { PrismaService } from "../prisma/prisma.service";

describe("AlertLogResolver", () => {
    let resolver: AlertLogResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AlertLogResolver, PrismaService]
        }).compile();

        resolver = module.get<AlertLogResolver>(AlertLogResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
