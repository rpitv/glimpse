import { Test, TestingModule } from "@nestjs/testing";
import { BlogPostResolver } from "./blog_post.resolver";
import { PrismaService } from "../prisma/prisma.service";

describe("AlertLogResolver", () => {
    let resolver: BlogPostResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BlogPostResolver, PrismaService]
        }).compile();

        resolver = module.get<BlogPostResolver>(BlogPostResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
