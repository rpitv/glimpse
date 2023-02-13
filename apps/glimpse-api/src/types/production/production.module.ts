import { Module } from "@nestjs/common";
import { ProductionResolver } from "./production.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [ProductionResolver],
    imports: [PrismaModule]
})
export class ProductionModule {}
