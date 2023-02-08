import { Test, TestingModule } from "@nestjs/testing";
import { AuditLogResolver } from "./audit_log.resolver";
import { PrismaService } from "../prisma/prisma.service";

describe("AuditLogResolver", () => {
    let resolver: AuditLogResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuditLogResolver, PrismaService]
        }).compile();

        resolver = module.get<AuditLogResolver>(AuditLogResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
