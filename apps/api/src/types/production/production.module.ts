import { Module } from "@nestjs/common";
import { ProductionResolver } from "./production.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import { ProductionService } from "./production.service";

@Module({
    providers: [ProductionResolver, ProductionService],
    exports: [ProductionService],
    imports: [PrismaModule]
})
export class ProductionModule {}
