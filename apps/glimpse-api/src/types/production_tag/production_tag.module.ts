import { Module } from "@nestjs/common";
import { ProductionTagResolver } from "./production_tag.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [ProductionTagResolver],
    imports: [PrismaModule]
})
export class ProductionTagModule {}
