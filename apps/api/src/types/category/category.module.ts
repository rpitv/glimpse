import { Module } from "@nestjs/common";
import { CategoryResolver } from "./category.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [CategoryResolver],
    imports: [PrismaModule]
})
export class CategoryModule {}
