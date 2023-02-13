import { Module } from "@nestjs/common";
import { BlogPostResolver } from "./blog_post.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [BlogPostResolver],
    imports: [PrismaModule]
})
export class BlogPostModule {}
