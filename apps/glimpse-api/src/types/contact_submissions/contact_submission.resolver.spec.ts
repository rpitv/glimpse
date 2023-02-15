import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../prisma/prisma.service";
import { ContactSubmissionResolver } from "./contact_submission.resolver";

describe("ContactSubmissionResolver", () => {
    let resolver: ContactSubmissionResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ContactSubmissionResolver, PrismaService]
        }).compile();

        resolver = module.get<ContactSubmissionResolver>(ContactSubmissionResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
